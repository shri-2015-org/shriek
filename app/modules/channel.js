var slugify = require('transliteration').slugify;
var ChannelModel = require('../models/channel');
var MessageModel = require('../models/message');

var ChannelModule = function (socket) {

  /**
  * Слушаем создание чата с фронта
  * @param data
  * @param data.name название чата
  */
  socket.on('channel create', function (data) {
    var createChannel = new Promise(function (resolve, reject) {
      var slug = slugify(data.name, {lowercase: true, separator: '_'}); // трансилитирируем name

      var channelUserList = [socket.username];

      if (data.userslist.length > 0) {
        channelUserList = data.userslist;
        channelUserList.unshift(socket.username);
      }

      var newChannel = ChannelModel({
        name: data.name,
        description: data.description,
        slug: slug,
        is_private: data.privateUsers,
        users: channelUserList
      });

      newChannel.save({runValidators: true}, function (err, data) {
        if (err) {
          var error;

          if (err.code === 11000) {
            error = new Error('Такой канал уже существует');
          } else {
            error = new Error('Ошибка создания чата');
          }

          reject(error);
        } else {
          var out = {
            status: 'ok',
            creator: socket.username,
            channel: data // здесь будет запись из БД со всеми полями (см схему)
          };

          resolve(out);
        }
      });
    });

    createChannel
      .then(function (data) {
        socket.broadcast.emit('channel create', data); // броадкастим на всех, только если все прошло удачно
        socket.emit('channel create', data);
      })
      .catch(function (error) {
        socket.emit('channel create error', error.toString());
      });
  });

  /**
  * Получение информации о чате
  * @param data
  * @param data.channel слаг чата
  */
  socket.on('channel info', function (data) {
    var getChannelInfo = new Promise(function (resolve, reject) {
      ChannelModel.findOne({slug: data.slug}, function (err, data) {
        if (err) {
          var error = new Error('Ошибка получения чата');

          reject(error);
        } else {
          var out = {
            status: 'ok',
            channel: data
          };

          resolve(out);
        }
      });

    });

    getChannelInfo
      .then(function (data) {
        socket.emit('channel info', data);
      })
      .catch(function (error) {
      });
  });

  /**
  * Получение всех чатов
  */
  socket.on('channel list', function () {
    var getChannelList = new Promise(function (resolve, reject) {
      ChannelModel.find({$or: [{is_private: false}, {is_private: true, users: socket.username}]},
        function (err, data) {
          if (err) {
            var error = new Error('Ошибка получения чатов');

            reject(error);
          } else {
            var out = {
              status: 'ok',
              channels: data
            };

            resolve(out);
          }
        }
      );
    });

    getChannelList
      .then(function (data) {
        socket.emit('channel list', data);
      })
      .catch(function (error) {
      });
  });

  /**
   * Получение сообщений из чата
   * @param data
   * @param data.channel string слаг чата
   * @param data.limit integer сколько сообщений
   * @param data.skip integer начиная с
   * @param data.date date дата от которой брать ( < date )
   */
  socket.on('channel get', function (data) {
    var indata = data;
    var getMessages = new Promise(function (resolve, reject) {

      // строим запрос в БД
      var limit = 20;
      var query = {channel: data.channel}; // канал нужно учитывать всегда

      if (data.hasOwnProperty('date')) {
        if (data.hasOwnProperty('rtl') && data.rtl == 'gte') {
          query.created_at = {$gte: data.date}; // дата — если пришла
        } else {
          query.created_at = {$lt: data.date}; // дата — если пришла
        }
      }

      var q = MessageModel.find(query);

      q.sort({created_at: -1});

      if (data.hasOwnProperty('limit')) {
        limit = data.limit;
      }
      if (limit !== -1) {
        q.limit(limit);
      }

      var newSkip = 0;

      if (data.hasOwnProperty('skip')) {
        newSkip = data.skip + 1;
        q.skip(newSkip * limit); // offset
      }



      q.exec(function (err, dbdata) { // выполняем запрос
        if (err) {
          var error = new Error('Ошибка получения сообщений');

          reject(error);
        } else {

          var out = {
            status: 'ok',
            // возвращаем сообщения или пустой массив, чтобы не возвращать null
            messages: (dbdata.length > 0 ? dbdata.reverse() : []),
            slug: indata.channel,
            type: 'channel get',
            newSkip: newSkip,
            force: indata.force || false,
            limit: limit,
            indata: indata
          };

          resolve(out);
        }
      });
    });

    getMessages
      .then(function (data) {
        return new Promise(function(resolve, reject) {
          if (data.force == true) {
            MessageModel.find({channel: data.slug}, function(testerr, testdata){
              if (testerr) {
                reject(testerr);
              }
              if (testdata.length <= data.messages.length) {
                data.hideMore = true;
              }
              resolve(data);
            });
          } else {
            data.hideMore = false;
            resolve(data);
          }
        });
      })
      .then(function (data) {
        socket.emit(data.type, data);
      })
      .catch(function (error) {
        console.log(error);
      });

  });
};

module.exports = ChannelModule;

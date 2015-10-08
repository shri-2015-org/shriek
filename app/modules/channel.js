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
          var error = new Error('Ошибка создания чата');

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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        query.created_at = {$lt: data.date}; // дата — если пришла
      }

      var q = MessageModel.find(query);

      q.sort({created_at: -1});
      q.limit(limit);

      if (data.hasOwnProperty('skip')) {
        q.skip(data.skip * limit); // offset
      }

      q.exec(function (err, data) { // выполняем запрос
        if (err) {
          var error = new Error('Ошибка получения сообщений');

          reject(error);
        } else {

          var now = new Date();
          var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          data = data.map(function (message) {
            var value = {};
            value._id = message._id;
            value.channel = message.channel;
            value.created_at = message.created_at;
            value.text = message.text;
            value.type = message.type;
            value.username = message.username;
            if (message.created_at < today) {
              var day = message.created_at.getDate();
              var month = message.created_at.getMonth();
              value.date = (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + message.created_at.getFullYear();
            } else {
              var hour = message.created_at.getHours();
              var minutes = message.created_at.getMinutes();
              value.date = (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes);
            }
            return value;
          });

          var out = {
            status: 'ok',
            // возвращаем сообщения или пустой массив, чтобы не возвращать null
            messages: (data.length > 0 ? data.reverse() : []),
            slug: indata.channel,
            type: 'channel get'
          };

          if (indata.skip) {
            out.type = 'scroll';
          }

          if (data.length < limit) {
            out.stopScroll = true;
          }

          resolve(out);
        }
      });
    });

    getMessages
      .then(function (data) {
        return socket.emit(data.type, data);
      })
      .catch(function (error) {
        console.log('channel get error', error);
      });
  });
};

module.exports = ChannelModule;

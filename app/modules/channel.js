var slugify = require('transliteration').slugify;
var ChannelModel = require('../models/channel');
var MessageModel = require('../models/message');

var channelModule = function (socket) {

  /**
  * Слушаем создание чата с фронта
  * @param data
  * @param data.name название чата
  */
  socket.on('channel create', function (data) {

    var createChannel = new Promise(function (resolve, reject) {
      slug = slugify(data.name, { lowercase: true, separator: '_' }); // трансилитирируем name

      var newChannel = ChannelModel({
        name: data.name,
        slug: slug
      });

      newChannel.save({ runValidators: true }, function (err, data) {
        var out = {};

        if (!err) {
          out.status = 'ok';
          out.channel = data; // здесь будет запись из БД со всеми полями (см схему)
          resolve(out);
        } else {
          var error = new Error('Ошибка создания чата');
          reject(error);
        }
      });
    });

    createChannel
      .then(function (data) {
        socket.broadcast.emit('channel create', out); // броадкастим на всех, только если все прошло удачно
        socket.emit('channel create', out);
      })
      .catch(function (error) {
        console.log(error);
      });

  });

  /**
  * Получение информации о чате
  * @param data
  * @param data.slug слаг чата
  */
  socket.on('channel info', function (data) {

    var getChannelInfo = new Promise(function (resolve, reject) {
      ChannelModel.findOne({ slug: data.slug }, function (err, data) {
        var out = {};

        if (!err) {
          out.status = 'ok';
          out.channel = data;
          resolve(out);
        } else {
          var error = new Error('Ошибка получения чата');
          reject(error);
        }
      });
    });

    getChannelInfo
      .then(function (data) {
        socket.emit('channel info', out);
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
      ChannelModel.find(function (err, data) {
        var out = {};

        if (!err) {
          out.status = 'ok';
          out.channels = data;
          resolve(out);
        } else {
          var error = new Error('Ошибка получения чатов');
          reject(error);
        }
      });
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
      var query = { channel: data.channel }; // канал нужно учитывать всегда
      if ('date' in data) {
        query.created_at = { $lt: data.date }; // дата — если пришла
      }

      var q = MessageModel.find(query);
      if ('limit' in data) {
        q.limit(data.limit); // limit
      }
      if ('skip' in data) {
        q.skip(data.skip); // offset
      }

      q.exec(function (err, data) { // выполняем запрос
        var out = {};

        if (!err) {
          out.status = 'ok';
          out.messages = (data.length > 0 ? data : []); // возвращаем пустой массив или сообщения (чтобы не возвращать null)
          out.slug = indata.channel;
          resolve(out);
        } else {
          var error = new Error('Ошибка получения сообщений');
          reject(error);
        }
      });
    });

    getMessages
      .then(function (data) {
        return socket.emit('channel get', data);
      })
      .catch(function (error) {
        console.log('channel get error', error);
      });

  });
}

module.exports = channelModule;

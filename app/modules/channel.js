var mongoose = require('../models/mongoose');
var slugify = require('transliteration').slugify;
var ChannelModel = mongoose.ChannelModel;
var MessageModel = mongoose.MessageModel;

var channelModule = function(socket) {

  /** Слушаем создание чата с фронта
  * @param data
  * @param data.name название чата
  */
  socket.on('chat create', function (data) {

  slug = slugify(data.name, {lowercase: true, separator: '_'}); // трансилитирируем name

    var newChannel = ChannelModel({
      name: data.name,
      slug: slug
    });

    newChannel.save({runValidators: true}, function (err, data) {

      var out = {};
      if (!err) {
        out.status = 'ok';
        out.channel = data; // здесь будет запись из БД со всеми полями (см схему)
      } else {
        out.status = 'error';
        out.error_message = 'Ошибка создания чата';
      }

      if (out.status == 'ok') socket.broadcast.emit('chat create', out); // броадкастим на всех, только если все прошло удачно
      socket.emit('chat create', out);

    });

  });

  /** Получение информации о чате
  * @param data
  * @param data.slug слаг чата
  */
  socket.on('chat info', function (data) {

    ChannelModel.findOne({ slug: data.slug }, function (err, data) {

      var out = {};
      if (!err) {
        out.status = 'ok';
        out.channel = data;
      } else {
        out.status = 'error';
        out.error_message = 'Ошибка получение чата';
      }

      socket.emit('chat info', out);

    });

  });

  /** Получение всех чатов
  */
  socket.on('chat list', function () {

    ChannelModel.find(function (err, data) {

      var out = {};
      if (!err) {
        out.status = 'ok';
        out.channels = data;
      } else {
        out.status = 'error';
        out.error_message = 'Ошибка получения чатов';
      }

      socket.emit('chat list', out);

    });

  });

  /** Получение сообщений из чата
  * @param data
  * @param data.channel string слаг чата
  * @param data.limit integer сколько сообщений
  * @param data.skip integer начиная с
  * @param data.date date дата от которой брать ( < date )
  */
  socket.on('chat get', function (data) {

    // строим запрос в БД

    var query = {
      channel: data.channel // канал нужно учитывать всегда
    };
    if (data.date !== undefined) query.created_at = { $lt: data.date }; // дата — если пришла

    var q = MessageModel.find(query);

    if (data.limit !== undefined) q.limit(data.limit); // limit
    if (data.skip !== undefined) q.skip(data.skip); // offset

    q.exec(function (err, data) { // выполняем запрос

      var out = {};
      if (!err) {
        out.status = 'ok';
        out.messages = (data.length > 0?data:[]); // возвращаем пустой массив или сообщения (чтобы не возвращать null)
      } else {
        out.status = 'error';
        out.error_message = 'Ошибка получения сообщений';
      }
      socket.emit('chat get', out);

    });

  });

}

module.exports = channelModule;

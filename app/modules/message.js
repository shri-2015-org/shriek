var MessageModel = require('../models/message');

var shriekPlugins = require('./plugins');

var MessageModule = function(socket) {

  /** Слушаем сообщение с фронта
  * @param data
  * @param data.user string логин юзера
  * @param data.channel string канал в который пишем (не обязательное)
  * @param data.text string текст сообщения
  * @param data.type string не обязательное, по умолчанию text
  */

  socket.on('message send', function (data) {

    // здесь еще нужно проверять на существование чата, если его нет — создавать
    var res = {};
    var newMessage = MessageModel({
      username: socket.username,
      channel: ( data.channel !== undefined ? data.channel : 'general' ), // если канал не пришёл, пишем в general
      text: data.text,
      raw: data.text,
      type: ( data.type !== undefined ? data.type : 'text' ) // если не пришёл тип, то думаем, что это текст
    });

    shriekPlugins.reduce(function (prev, plugin) {
      return prev.then(function (data) {
        return new Promise(function (resolveModule, rejectModule) {
          if (plugin.forEvent === 'channelGet') {
            plugin(data, function (err, result) {
              if (err) {
                return rejectModule(err);
              }
              resolveModule(result);
            });
          } else {
            resolveModule(data);
          }
        })
          .then(function (result) {
            return result;
          })
          .catch(function (err) {
            reject(err);
          });
      });
    }, Promise.resolve([newMessage])).then(function (result) {
      newMessage.raw = result[0].text;

      var setMessage = new Promise(function (resolve, reject) {
        res.status = 'ok';
        res.message = newMessage;
        res.message.created_at = Date.now();
        socket.emit('message send', res);

        newMessage.save({runValidators: true}, function (err, data) {
          if (!err) {
            var out = {
              status: 'ok',
              message: data // здесь будет запись из БД со всеми полями (см схему)
            };

            resolve(out);
          } else {
            reject('Ошибка создания сообщения');
          }
        });
      });

      setMessage
        .then(function (data) {
          return socket.broadcast.emit('message send', data);
        })
        .catch(function (error) {
          return socket.emit('message send', {
            status: 'error',
            error_message: error
          });
        });
    });
  });
}

module.exports = MessageModule;

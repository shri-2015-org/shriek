var MessageModel = require('../models/message');

var shriekModules = require('./modules');

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

    var newMessage = MessageModel({
      username: socket.username,
      channel: ( data.channel !== undefined ? data.channel : 'general' ), // если канал не пришёл, пишем в general
      text: data.text,
      type: ( data.type !== undefined ? data.type : 'text' ) // если не пришёл тип, то думаем, что это текст
    });

    var setMessage = new Promise(function (resolve, reject) {
      newMessage.save({runValidators: true}, function (err, data) {
        var out = {};
        if (!err) {
          shriekModules.reduce(function (prev, module) {
            return prev.then(function (data) {
              return module(data);
            });
          }, Promise.resolve([data])).then(function (result) {
            out.status = 'ok';
            out.message = result[0]; // здесь будет запись из БД со всеми полями (см схему)
            resolve(out);
          });

        } else {
          reject('Ошибка создания сообщения');
        }
      });
    });

    setMessage
      .then(function (data) {
        socket.broadcast.emit('message send', data);
        return socket.emit('message send', data);
      })
      .catch(function (error) {
        console.log('message send error', error);
        return socket.emit('message send', {
          status: 'error',
          error_message: error
        });
      });

  });
}

module.exports = MessageModule;

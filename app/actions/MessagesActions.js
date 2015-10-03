var alt_obj = require('./../controllers/alt_obj');

var MessagesActions = alt_obj.createActions({
  displayName: 'MessagesActions', // обязательное поле в ES5

  updateMessages: function (messages) {  // на эту функцию мы будем подписываться в сторе
    this.dispatch(messages); // это блин ТРИГГЕР, на который реагирует стор
  },
  pushMessage: function (message) {
    this.dispatch(message);
  },
  prepandMessages: function (messages) {
    this.dispatch(messages);
  },
  initMessages: function (socket) { // это функция инициализации, тут мы подписываемся на сообщение из сокета
    var _this = this;

      socket.on('message send', function (data) {
        if (data.message.channel == socket.activeChannel) { // проверяем, правда ли сообщение пришло в текущий чат?
          _this.actions.pushMessage({ message: data.message });
          $(".msg__list").scrollTop($(".msg__list").get(0).scrollHeight); // унести отсюда
        }
      });
      socket.on('channel get', function (data) {
        _this.actions.updateMessages({ messages: data.messages });
        $(".msg__list").scrollTop($(".msg__list").get(0).scrollHeight); // унести отсюда
      });
      socket.on('scroll', function (messages) {
        _this.actions.prepandMessages(messages);
      });
  },

  getMessages: function (socket, skip) {
    skip = skip || 0;
    socket.emit('channel get', {channel: socket.activeChannel, date: new Date(), skip: skip});
  }

});

module.exports = alt_obj.createActions('MessagesActions', MessagesActions); // первый параметр имя экшена — обязательный в ES5

var alt_obj = require('./../controllers/alt_obj');

var MessagesActions = alt_obj.createActions({
  displayName: 'MessagesActions', // обязательное поле в ES5

  updateMessages: function (messages) {  // на эту функцию мы будем подписываться в сторе
    this.dispatch(messages); // это блин ТРИГГЕР, на который реагирует стор
  },
  pushMessage: function (message) {
    this.dispatch(message);
  },

  initMessages: function(socket) { // это функция инициализации, тут мы подписываемся на сообщение из сокета
    var that = this;

      socket.on('message send', function (data) {
        that.actions.pushMessage({ message: data.message });
        $(".msg__list").scrollTop(10000); // унести отсюда
      });
      socket.on('channel get', function (data) {
        that.actions.updateMessages({ messages: data.messages });
        $(".msg__list").scrollTop(10000); // унести отсюда
      });

  },

  getMessages: function(socket) {
    socket.emit('channel get', {channel: socket.activeChannel, date: new Date()});
  }

});

module.exports = alt_obj.createActions('MessagesActions', MessagesActions); // первый параметр имя экшена — обязательный в ES5

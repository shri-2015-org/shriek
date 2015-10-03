var alt_obj = require('./../controllers/alt_obj');
var MessagesActions = require('./../actions/MessagesActions');

function MessagesStore() {
  this.messages = []; // это бывший initState у компонента
  this.stopScroll = false;
  this.displayName = 'MessagesStore'; // обязательное поле для ES5
  this.bindListeners({ // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
    updateMessages: MessagesActions.UPDATE_MESSAGES,  // ключ хеша — функция стора, значение — функция экшена
    pushMessage: MessagesActions.PUSH_MESSAGE,
    prepandMessages: MessagesActions.PREPAND_MESSAGES,
    setSearchedMessage: MessagesActions.SET_SEARCHED_MESSAGE
  });
}


// тут описываем все функции стора (в основном это присваение стейта нового значения)
MessagesStore.prototype.pushMessage = function (fetched_data) {
    var messagesAll = this.messages;
    messagesAll.push(fetched_data.message);
    this.messages = messagesAll;
};
MessagesStore.prototype.updateMessages = function (fetched_data) {
    this.messages = fetched_data.messages;
};
MessagesStore.prototype.prepandMessages = function (fetched_data) {
  if (fetched_data.stopScroll) {
    this.stopScroll = true;
  }
  this.messages = fetched_data.messages.concat(this.messages);
};
MessagesStore.prototype.setSearchedMessage = function (_ids) {
  var listOfMessages = [];
  this.messages.map(function (message) {
    if (_ids.indexOf(message._id) !== -1) {
      message.searched = true;
    } else {
      message.searched = false;
    }
    listOfMessages.push(message);
  });
  this.messages = listOfMessages;
}
module.exports = alt_obj.createStore(MessagesStore);

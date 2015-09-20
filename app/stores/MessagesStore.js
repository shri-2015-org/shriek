var alt_obj = require('./../controllers/alt_obj');
var MessagesActions = require('./../actions/MessagesActions');

function MessagesStore() {
  this.messages = []; // это бывший initState у компонента
  this.displayName = 'MessagesStore'; // обязательное поле для ES5
  this.bindListeners({ // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
    updateMessages: MessagesActions.UPDATE_MESSAGES,  // ключ хеша — функция стора, значение — функция экшена
    pushMessage: MessagesActions.PUSH_MESSAGE
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

module.exports = alt_obj.createStore(MessagesStore);

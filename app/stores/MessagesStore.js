var MessagesStoreObj = null;
var MessagesStoreFunction = function () {
  var alt_obj = require('./../controllers/alt_obj');
  var MessagesActions = require('./../actions/MessagesActions');

  function MessagesStore() {
    this.messages = []; // это бывший initState у компонента
    this.plugins = [];
    this.stopScroll = false;
    this.displayName = 'MessagesStore'; // обязательное поле для ES5
    this.bindListeners({ // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
      updateMessages: MessagesActions.UPDATE_MESSAGES,  // ключ хеша — функция стора, значение — функция экшена
      pushMessage: MessagesActions.PUSH_MESSAGE,
      prepandMessages: MessagesActions.PREPAND_MESSAGES,
      setSearchedMessage: MessagesActions.SET_SEARCHED_MESSAGE,
    registerPlugin: MessagesActions.REGISTER_PLUGIN
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
      var isSearched = _ids.indexOf(message._id) > -1;

      message.searched = isSearched;

      listOfMessages.push(message);
    });

    this.messages = listOfMessages;
  };

  MessagesStore.prototype.registerPlugin = function (plugin) {
    this.plugins.push(plugin);
  };

  if (MessagesStoreObj === null) {
    MessagesStoreObj = alt_obj.createStore(MessagesStore);
  }
  return MessagesStoreObj;
};

module.exports = MessagesStoreFunction;

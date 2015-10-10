var ChannelUsersStoreObj = null;

var ChannelUsersStoreFunction = function () {

  var alt_obj = require('./../controllers/alt_obj');
  var ChannelsUsersActions = require('./../actions/ChannelUsersActions');

  function ChannelUsersStore() {
    this.displayName = 'ChannelUsersStore'; // обязательное поле для ES5

    this.channel = {};
    this.users = [];
    this.bindListeners({
      // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
      getInfoChannelUsers: ChannelsUsersActions.GET_INFO_CHANNEL_USERS,
      // ключ хеша — функция стора, значение — функция экшена
      getUsersChannel: ChannelsUsersActions.GET_USERS_CHANNEL
    });
  }

  ChannelUsersStore.prototype.getInfoChannelUsers = function (data) {
    this.channel = data;
  };

  ChannelUsersStore.prototype.getUsersChannel = function (data) {
    this.users = data;
  };

  if (ChannelUsersStoreObj === null) {
    ChannelUsersStoreObj = alt_obj.createStore(ChannelUsersStore);
  }
  return ChannelUsersStoreObj;

};

module.exports = ChannelUsersStoreFunction;

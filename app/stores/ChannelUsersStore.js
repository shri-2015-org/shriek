var alt_obj = require('./../controllers/alt_obj');
var ChannelsUsersActions = require('./../actions/ChannelUsersActions');

function ChannelUsersStore() {
  this.displayName = 'ChannelUsersStore'; // обязательное поле для ES5

  this.channel = {};
  this.bindListeners({ // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
    getInfoChannelUsers: ChannelsUsersActions.GET_INFO_CHANNEL_USERS  // ключ хеша — функция стора, значение — функция экшена
  });
}

ChannelUsersStore.prototype.getInfoChannelUsers = function (data) {
  this.channel = data;
};

module.exports = alt_obj.createStore(ChannelUsersStore);

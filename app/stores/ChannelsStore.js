var ChannelsStoreFunction = function (socket) {

var alt_obj = require('./../controllers/alt_obj');
var ChannelsActions = require('./../actions/ChannelsActions');

  function ChannelsStore() {
    this.channels = []; // это бывший initState у компонента
    this.show_modal = false;

    // для создания нового канала
    this.newChannel={};
    this.newChannel.name = '';
    this.newChannel.desc = '';
    this.newChannel.userList = [];
    // для создания нового канала

    this.displayName = 'ChannelsStore'; // обязательное поле для ES5
    this.bindListeners({ // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
      updateChannels: ChannelsActions.UPDATE_CHANNELS,  // ключ хеша — функция стора, значение — функция экшена
      setActiveChannel: ChannelsActions.SET_ACTIVE_CHANNEL,
      setUnreadChannel: ChannelsActions.SET_UNREAD_CHANNEL,
      addUserToNewChannel:ChannelsActions.ADD_USER_TO_NEW_CHANNEL,
      deleteUserFromNewChannel:ChannelsActions.DELETE_USER_FROM_NEW_CHANNEL,
      createdNewChannel: ChannelsActions.CREATED_NEW_CHANNEL,
      addNewChannel:ChannelsActions.ADD_NEW_CHANNEL,
      updateShowModal:ChannelsActions.UPDATE_SHOW_MODAL
    });
  }


  // тут описываем все функции стора (в основном это присваение стейта нового значения)

  ChannelsStore.prototype.recalcActiveChannel = function (fetched_data) {

    var listOfChannels = [];
    this.channels.map(function (channel) {
      if (socket.activeChannel == channel.slug) {
        channel.isActive = true;
        channel.isUnread = false;
        listOfChannels.unshift(channel);
      } else {
        channel.isActive = false;
        listOfChannels.push(channel);
      }
    });

    this.channels = listOfChannels;

  };

  ChannelsStore.prototype.updateChannels = function (fetched_data) {
    this.channels = fetched_data.channels;
    this.recalcActiveChannel();
  };

  ChannelsStore.prototype.setActiveChannel = function (channel_slug) {
    socket.activeChannel = channel_slug;
    this.recalcActiveChannel();
  };

  ChannelsStore.prototype.updateShowModal = function (stateShowModal) {
    this.show_modal = stateShowModal;
  };

  ChannelsStore.prototype.createdNewChannel = function (fetched_data) {
    var oldstate  = this.show_modal;

    if (fetched_data.creator === socket.username) {
      oldstate = false;
    }

    this.show_modal = oldstate;
    this.channels.push(fetched_data.channel);
  };

  ChannelsStore.prototype.setUnreadChannel = function (channel_slug) {

    var listOfChannels = [];
    this.channels.map(function (channel) {
      if (channel_slug == channel.slug) {
        channel.isUnread = true;
      }
      listOfChannels.push(channel);
    });

    this.channels = listOfChannels;

  };

  ChannelsStore.prototype.addUserToNewChannel = function(username) {
    console.log('store addUserToNewChannel');
    this.newChannel.userList.push(username);
    console.log(this.newChannel);
  };

  ChannelsStore.prototype.deleteUserFromNewChannel = function(username) {
    console.log('store deleteUserFromNewChannel', username);
    var nowUserList = this.newChannel.userList;
    this.newChannel.userList = [];
    var _this = this;
    nowUserList.map(function(names) {
      if (names != username) {
        _this.newChannel.userList.push(names);
      }
    });
    console.log(this.newChannel);
  };

  ChannelsStore.prototype.addNewChannel = function (data) {
     if (data.desc) this.newChannel.desc = data.desc;
     if (data.name) {
       this.newChannel.name = data.name;
       socket.emit('channel create', {
         name: this.newChannel.name,
         desc: this.newChannel.desc,
         userslist: this.newChannel.userList
       });
     }
  };

  return alt_obj.createStore(ChannelsStore);
};

module.exports = ChannelsStoreFunction;

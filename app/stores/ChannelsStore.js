var ChannelStoreObj = null;
var ChannelsStoreFunction = function (socket) {
  var alt_obj = require('./../controllers/alt_obj');
  var ChannelsActions = require('./../actions/ChannelsActions');

  function ChannelsStore() {
    this.channels = []; // это бывший initState у компонента
    this.show_modal = false;
    this.userList = [];

    // для создания нового канала
    this.newChannel = {};
    this.newChannel.privateUsers = false;
    this.newChannel.userList = [];

    // errors
    this.hasError = false;

    this.displayName = 'ChannelsStore'; // обязательное поле для ES5
    this.bindListeners({ // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
      updateChannels: ChannelsActions.UPDATE_CHANNELS,  // ключ хеша — функция стора, значение — функция экшена
      setActiveChannel: ChannelsActions.SET_ACTIVE_CHANNEL,
      setUnreadChannel: ChannelsActions.SET_UNREAD_CHANNEL,
      updateUserList: ChannelsActions.UPDATE_USER_LIST,
      addUserToNewChannel:ChannelsActions.ADD_USER_TO_NEW_CHANNEL,
      deleteUserFromNewChannel:ChannelsActions.DELETE_USER_FROM_NEW_CHANNEL,
      createdNewChannel: ChannelsActions.CREATED_NEW_CHANNEL,
      addNewChannel:ChannelsActions.ADD_NEW_CHANNEL,
      updateShowModal:ChannelsActions.UPDATE_SHOW_MODAL,
      setPrivateMoreUsersChannel:ChannelsActions.SET_PRIVATE_MORE_USERS_CHANNEL,
      showError:ChannelsActions.SHOW_ERROR
    });
  }

  // тут описываем все функции стора (в основном это присваение стейта нового значения)
  ChannelsStore.prototype.recalcActiveChannel = function () {

    var listOfChannels = [];
    var i = 0;
    this.channels.map(function (channel) {
      i++;
      if (socket.activeChannel === channel.slug) {
        channel.isActive = true;
        channel.isUnread = false;
        if (i <= 5) {
          listOfChannels.push(channel);
        } else {
          listOfChannels.unshift(channel);
        }
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

  ChannelsStore.prototype.updateUserList = function (data) {
    this.userList = data;
  };

  ChannelsStore.prototype.createdNewChannel = function (data) {
    var oldstate  = this.show_modal;
    var users = [];
    var len_users = 0;

    if (data.channel.is_private) {
      users = data.channel.users;
    } else {
      users = this.userList.map(function (user) {
        return user.username;
      });
      users.unshift(socket.username);
    }

    len_users = users.length;

    if (data.creator === socket.username) {
      oldstate = false;
    }

    if (len_users > 0) {
      for (var i = 0; i < len_users; i++) {
        if (socket.username === users[i]) {
          this.channels.push(data.channel);
        }
      }
    }

    this.show_modal = oldstate;
  };

  ChannelsStore.prototype.setUnreadChannel = function (channel_slug) {

    var listOfChannels = [];
    this.channels.map(function (channel) {
      if (channel_slug === channel.slug) {
        channel.isUnread = true;
      }
      listOfChannels.push(channel);
    });

    this.channels = listOfChannels;

  };

  ChannelsStore.prototype.addUserToNewChannel = function (username) {
    this.newChannel.userList.push(username);
  };

  ChannelsStore.prototype.deleteUserFromNewChannel = function (username) {
    var _this = this;
    var nowUserList = this.newChannel.userList;
    this.newChannel.userList = [];
    nowUserList.map(function (name) {
      if (name !== username) {
        _this.newChannel.userList.push(name);
      }
    });
  };

  ChannelsStore.prototype.setPrivateMoreUsersChannel = function (setPrivate) {
    this.newChannel.privateUsers = setPrivate;
  };

  ChannelsStore.prototype.showError = function (data) {
    this.hasError = data;
  };

  ChannelsStore.prototype.addNewChannel = function (data) {
    var users = [];

    if (this.newChannel.privateUsers) {
      users = this.newChannel.userList;
    }

    if (data.name) {
      socket.emit('channel create', {
        name: data.name,
        description: data.description,
        userslist: users,
        privateUsers: this.newChannel.privateUsers
      });

      // после отправки переводим данные в начальное состояние
      this.newChannel.privateUsers = false;
      this.newChannel.userList = [];
    }
  };

  if (ChannelStoreObj === null) {
    ChannelStoreObj = alt_obj.createStore(ChannelsStore);
  }
  return ChannelStoreObj;

};

module.exports = ChannelsStoreFunction;

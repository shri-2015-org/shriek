var UserListStoreObj = null;
var UserListStoreFunction = function (socket) {
  var alt_obj = require('./../controllers/alt_obj');
  var UserListActions = require('./../actions/UserListActions');


  function UserListStore() {
    this.users = [];
    this.channels = [];
    this.bindListeners({
      updateUserList: UserListActions.UPDATE_USER_LIST,
      updateChannelList: UserListActions.UPDATE_CHANNEL_LIST,
      addUserChannel: UserListActions.ADD_USER_CHANNEL
    });
  }

  UserListStore.prototype.updateUserList = function (data) {
    this.users = data.users;
  };

  UserListStore.prototype.updateChannelList = function (data) {
    this.channels = data;
  };

  UserListStore.prototype.addUserChannel = function (elem) {
    var _this = this;
    var creator = socket.username.trim();
    var user = elem.innerHTML.trim();

    var nameCnannel = creator+'_'+user;

    socket.emit('channel list');
    socket.on('channel list', function (data) {
      _this.channels = data.channels;
      console.log(_this.channels);
    });

    var newChannel = {
      name: nameCnannel,
      isPrivate: true,
      isDirect: true,
      userslist: [user]
    };

    socket.emit('channel create', newChannel);
  };

  if (UserListStoreObj === null) {
    UserListStoreObj = alt_obj.createStore(UserListStore);
  }
  return UserListStoreObj;

};

module.exports = UserListStoreFunction;

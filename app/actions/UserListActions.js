var alt_obj = require('./../controllers/alt_obj');

var UserListActions = alt_obj.createActions({
  displayName: 'UserListActions', // обязательное поле в ES5

  updateUserList: function (data) {
    this.dispatch(data);
  },

  updateChannelList: function (data) {
    this.dispatch(data);
  },

  initUserList: function (socket) {
    var _this = this;

    socket.on('user list', function (data) {
      if (data.status === 'ok') {
        _this.actions.updateUserList(data);
      }
    });

    socket.on('channel list', function (data) {
      if (data.status === 'ok') {
        _this.actions.updateChannelList(data.channels);
      }
    });
  },

  addUserChannel: function (elem) {
    this.dispatch(elem);
  }
});

module.exports = alt_obj.createActions('UserListActions', UserListActions);

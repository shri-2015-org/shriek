var alt_obj = require('./../controllers/alt_obj');

var ChannelsUsersActions = alt_obj.createActions({
  displayName: 'ChannelsUsersActions',

  getInfoChannelUsers: function (data){
    this.dispatch(data);
  },

  initChannels: function (socket) {
    var _this = this;

    socket.on('channel info', function (data) {
      if (data.status == 'ok') {
        _this.actions.getInfoChannelUsers(data.channel);
      }
    });

    socket.on('channel create', function (data) {
      if (data.status === 'ok') {
        if (data.creator === socket.username) {
          _this.actions.getInfoChannelUsers(data.channel);
        }
      }
    });
  }
});

module.exports = alt_obj.createActions('ChannelsUsersActions', ChannelsUsersActions);

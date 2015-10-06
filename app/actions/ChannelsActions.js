var alt_obj = require('./../controllers/alt_obj');

var ChannelsActions = alt_obj.createActions({
  displayName: 'ChannelsActions', // обязательное поле в ES5

  updateChannels: function (channels) {  // на эту функцию мы будем подписываться в сторе
    this.dispatch(channels); // это блин ТРИГГЕР, на который реагирует стор
  },
  setActiveChannel: function (channelSlug) {
    this.dispatch(channelSlug);
  },
  createdNewChannel: function (channel) {
    this.dispatch(channel);
  },
  setUnreadChannel: function (channelSlug) {
    this.dispatch(channelSlug);
  },
  updateUserList: function (users) {
    this.dispatch(users);
  },

  initChannels: function (socket) { // это функция инициализации, тут мы подписываемся на сообщение из сокета
    var _this = this;

    socket.on('channel list', function (data) {
      _this.actions.updateChannels(data); // получили данные и передали в функцию, которая умеет триггерить стор
    });

    socket.on('channel get', function (data) {
      _this.actions.setActiveChannel(data.slug);
    });

    socket.on('message send', function (data) {
      if (data.message.channel != socket.activeChannel) { // только если сообщение пришло в не активный канал
        _this.actions.setUnreadChannel(data.message.channel);
      }
    });

    socket.on('user list', function(data) {
      if (data.status === 'ok') {
        _this.actions.updateUserList(data.users);
      }
    });

    socket.on('channel create', function (data) {
      if (data.status === 'ok') {
        _this.actions.createdNewChannel(data);

        if (data.creator === socket.username) {
          _this.actions.setActiveChannel(data.channel.slug);
          socket.emit('channel get', {
            channel: data.channel.slug,
            date: new Date()
          });
        }
      }
    });
  },

  //обновляем стейт показа/убирания окна добавления канала
  updateShowModal: function(state) {
    this.dispatch(state);
  },

  getChannels: function (socket) {
    socket.emit('channel list'); // дергаем бекенд, чтобы получить список каналов
  },

  //срабатывает при клике на чекбокс, добавляет юзера в новый канал
  addUserToNewChannel: function(username) {
    this.dispatch(username);
  },

  //срабатывает при клике на чекбокс, отменяет добавление юзера в новый канал
  deleteUserFromNewChannel: function(username) {
    this.dispatch(username);
  },

  //срабатывает на клике формы добавление канала
  addNewChannel: function(newChannel) {
    this.dispatch(newChannel);
  },

  setPrivateMoreUsersChannel: function(setPrivate) {
    this.dispatch(setPrivate);
  }
});

module.exports = alt_obj.createActions('ChannelsActions', ChannelsActions); // первый параметр имя экшена — обязательный в ES5

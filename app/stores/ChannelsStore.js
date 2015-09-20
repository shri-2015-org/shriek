var ChannelsStoreFunction = function (socket) {

var alt_obj = require('./../controllers/alt_obj');
var ChannelsActions = require('./../actions/ChannelsActions');

  function ChannelsStore() {
    this.channels = []; // это бывший initState у компонента
    this.displayName = 'ChannelsStore'; // обязательное поле для ES5
    this.bindListeners({ // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
      updateChannels: ChannelsActions.UPDATE_CHANNELS,  // ключ хеша — функция стора, значение — функция экшена
      setActiveChannel: ChannelsActions.SET_ACTIVE_CHANNEL
    });
  }


  // тут описываем все функции стора (в основном это присваение стейта нового значения)

  ChannelsStore.prototype.recalcActiveChannel = function (fetched_data) {

      var listOfChannels = [];
      this.channels.map(function (channel) {
        if (socket.activeChannel == channel.slug) {
          channel.isActive = true;
        } else {
          channel.isActive = false;
        }
        listOfChannels.push(channel);
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

  return alt_obj.createStore(ChannelsStore);
}

module.exports = ChannelsStoreFunction;

var alt_obj = require('./../controllers/alt_obj');
var ChannelsActions = require('./../actions/ChannelsActions');

function ChannelsStore() {
  this.channels = []; // это бывший initState у компонента
  this.displayName = 'ChannelsStore'; // обязательное поле для ES5
  this.bindListeners({ // это биндинги на события экшена, сработает только если внутри функции экшена есть dispatch()
    updateChannels: ChannelsActions.UPDATE_CHANNELS  // ключ хеша — функция стора, значение — функция экшена
  });
}


// тут описываем все функции стора (в основном это присваение стейта нового значения)
ChannelsStore.prototype.updateChannels = function (fetched_channels) {
    this.channels = fetched_channels;
};

module.exports = alt_obj.createStore(ChannelsStore);

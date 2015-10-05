var SearchComponent = function (socket) {

var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор

  var SearchBlock = React.createClass({

    getInitialState: function () {
      return {};
    },

    handleSearch: function () {
      var _this = this;
      var allowedChannels = ChannelsStore.state.channels.map(function (channel) {
        return channel.slug;
      });

      socket.emit('search text', {
        channels: allowedChannels,
        text: $('#search').val()
      });
    },

    render: function () {
      return (
        <div className='search'>
          <div className='form__row'>
            <label className='form__label' htmlFor='search' onClick={this.handleSearch}>
              <i className='fa fa-search'></i>
            </label>
            <input className='form__text' type='text' id='search' ref='search' onChange={this.handleSearch}/>
          </div>
        </div>
      );
    }
  });

  return SearchBlock;
};

module.exports = SearchComponent;

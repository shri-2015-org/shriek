var SearchComponent = function (socket) {

var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор

  var SearchBlock = React.createClass({

    getInitialState: function () {
      return {};
    },

    handleSearch: function (e) {

      if ($('#search').val().trim()) {
        var chList = [];
        ChannelsStore.getState().channels.map(function(ch) {
          chList.push(ch.slug);
        });

        socket.emit('search text', {
          channels: chList,
          text: $('#search').val().trim()
        });
        $('#search').val('');
      }
    },

    render: function () {
      return (
        <div className='search'>
          <div className='form__row'>
            <label className='form__label' htmlFor='search' onClick={this.handleSearch}>
              <i className='fa fa-search'></i>
            </label>
            <input className='form__text' type='text' id='search' ref='search'/>
          </div>
        </div>
      );
    }
  });

  return SearchBlock;
};

module.exports = SearchComponent;

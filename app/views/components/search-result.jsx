var SearchResultComponent = function (socket) {

  var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор

  var SearchResultList = React.createClass({
    getInitialState: function () {
      return {};
    },

    render: function () {
      var Messages = (<div>Loading messages...</div>);
      if (this.props.messages) {
        Messages = this.props.messages.map(function (message) {
          return (<SearchResult message={message} key={'search' + message._id} />);
        });
      }
      return (
        <div className='search-results'>
          {Messages}
        </div>
      );
    }
  });

  var SearchResult = React.createClass({
    render: function () {
      return (
        <div className='search-result'>
          <span className='search-result__date'>{this.props.message.date}</span>
          <span> </span>
          <span className='search-result__author'>{this.props.message.username}</span>
          <span> </span>
          <a href={"#" + this.props.message._id} className="search-result__source">Go to message</a>
          <div
            className='search-result__text'
            dangerouslySetInnerHTML={{
              __html: this.props.message.text
            }} />
        </div>
      );
    }
  });

  var SearchModel = React.createClass({

    getInitialState: function () {
      return {
        showSearchResult: false,
        messages: []
      };
    },

    componentWillMount: function () {
      var _this = this;

      socket.on('search text', function (data) {
        if (data.status === 'ok') {
          _this.setState({showSearchResult: true});
          _this.setState({messages: data.messages})
        }
      });
    },

    handleSearch: function (e) {
    },

    handleClose: function (e) {
      this.setState({showSearchResult: false});
    },

    render: function () {
      return (
        <div>
          {this.state.showSearchResult == true && (
            <div className="modal" ref="overlaySearchResult">
                <div className="form modal__body modal__search">
                  <h2 className="modal__heading heading">Результат поиска</h2>
                  <SearchResultList messages={this.state.messages} />
                  <button className="btn" onClick={this.handleClose} type="button">Close</button>
                </div>
            </div>
          )}
        </div>
      );
    }
  });

  return SearchModel;
};

module.exports = SearchResultComponent;

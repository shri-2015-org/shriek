var ReconnectComponent = function (socket) {

  var ReconnectComponent = React.createClass({
    getInitialState: function () {
      return {
        reconnecting: false
      };
    },

    componentDidMount: function () {
      var _this = this;

      socket.on('connect_error', function () {
        _this.setState({
          reconnecting: true
        });
      });

      socket.on('reconnect', function () {
        _this.setState({
          reconnecting: false
        });
      });
    },

    render: function () {
      var cx = require('classnames');
      var classes = cx({
        'reconnecting': true,
        'active': this.state.reconnecting
      });

      return (
        <div className={classes}>
          <span className="fa fa-circle-o-notch fa-spin"></span>
          Подключение…
        </div>
      );
    }
  });

  return ReconnectComponent;
};

module.exports = ReconnectComponent;

var ChannelComponent = function(socket) {

  var ChannelsList = React.createClass({
    getInitialState: function () {
      return {
        channels: []
      };
    },

    componentDidMount: function () {
      var that = this;
      socket.on('channel list', function (data) {
        that.setState({ channels: data.channels });
      });
      socket.emit('channel list');
      socket.on('channel get', function (data) {
        console.log('change chat room');
        // React.ChatBox.setState({messages: data.messages});
      });
    },

    changeChannel: function(event) {
      socket.emit('channel get', {channel: event.target.dataset.slug, date: new Date()});
    },
    render: function () {
      var Channels = (<div>Loading channels...</div>);
      var that = this;

      if (this.state.channels) {
        Channels = this.state.channels.map(function (channel) {
          return (<Channel channel={channel} changeChannel={that.changeChannel}/>);
        });
      }

      return (
        <div className="group">
          <div className="heading heading_group">
            <h3 className="heading__header">Каналы</h3>
            <span className="heading__plus"><i class="fa fa-plus-square-o fa-lg"></i></span>
          </div>
          <ul className="list list_channels">
            {Channels}
          </ul>
          <MoreChannels />
        </div>
      );
    }
  });

  var Channel = React.createClass({
    clickHandler: function(event) {
      this.props.changeChannel(event);
    },

    render: function () {
      return (
        <li className="list__item">
          <a className="name" onClick={this.clickHandler} data-slug={this.props.channel.slug}>{this.props.channel.name}</a>
        </li>
      );
    }
  });

  var MoreChannels = React.createClass({
    render: function() {
      return (
        <div className="more">
          <span>Показать +7</span>
        </div>
      );
    }
  });

  return ChannelsList
};

module.exports = ChannelComponent;

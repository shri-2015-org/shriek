var ChannelComponent = function(socket, ChatComponent) {

  var ChannelsList = React.createClass({
    getInitialState: function () {
      return {
        channels: []
      };
    },

    componentDidMount: function () {
      var that = this;
      socket.on('channel list', function (data) {
        if (socket.activeChannel == undefined) {
          socket.activeChannel = 'general';
        }
        that.setState({ channels: data.channels });
      });
      socket.emit('channel list');
      socket.on('channel get', function (data) {
        console.log('change chat room');
        // console.log(ChatComponent);
        // ChatComponent({messages: data.messages});
      });
    },

    changeChannel: function(event) {
      socket.activeChannel = event.target.dataset.slug;
      socket.emit('channel get', { channel: event.target.dataset.slug, date: new Date() });
      socket.emit('channel list');
    },
    render: function () {
      var Channels = (<div>Loading channels...</div>);
      var that = this;

      if (this.state.channels) {
        Channels = this.state.channels.map(function (channel) {
          if (channel.slug == socket.activeChannel) {
            activeClass = 'active';
          } else {
            activeClass = '';
          }
          return (<Channel channel={channel} changeChannel={that.changeChannel} activeClass={activeClass}/>);
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

      var className = 'list__item ' + this.props.activeClass;

      return (
        <li className={className}>
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

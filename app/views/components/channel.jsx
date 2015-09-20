var ChannelComponent = function (socket) {

var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор
var ChannelsActions = require('./../../actions/ChannelsActions'); // подключаем экшены

  var ChannelsList = React.createClass({
    getInitialState: function () {
      return ChannelsStore.getState(); // теперь мы возвращаем стор, внутри которого хранятся значения стейтов по умолчанию
    },

    componentDidMount: function () {
      ChannelsStore.listen(this.onChange); // подписываемся на изменения store
      ChannelsActions.initChannels(socket); // вызываем функцию, которая внутри экшена подпишется на событие сокета
      ChannelsActions.getChannels(socket); // вызываем первый экшен, который пулучит список каналов. на самом деле, его нужно делать не здесь, а сразу после успешного логина
    },

    componentWillUnmount() {
      ChannelsStore.unlisten(this.onChange); // отписываемся от изменений store
    },

    // эта функция выполняется когда store триггерит изменения внутри себя
    onChange(state) {
      this.setState(state);
    },

    changeChannel: function (event) {
      socket.activeChannel = event.target.dataset.slug;
      socket.emit('channel get', { channel: event.target.dataset.slug, date: new Date() });
    },

    render: function () {
      var Channels = (<div>Loading channels...</div>);
      var _this = this;

      if (this.state.channels) {
        Channels = this.state.channels.map(function (channel) {
          return (<Channel channel={channel} changeChannel={_this.changeChannel} key={channel._id}/>);

        });
      }

      return (
        <div className="group">
          <div className="heading heading_group">
            <h3 className="heading__header">Каналы</h3>
            <span className="heading__plus"><i className="fa fa-plus-square-o fa-lg"></i></span>
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
    clickHandler: function (event) {
      this.props.changeChannel(event);
    },

    render: function () {

      console.log(this.props.channel.isUnread);

      var className = 'list__item ' + (this.props.channel.isActive ? ' active' : '') + (this.props.channel.isUnread ? ' unread' : '');

      return (
        <li className={className}>
          <a className="name" onClick={this.clickHandler} data-slug={this.props.channel.slug}>{this.props.channel.name}</a>
        </li>
      );
    }
  });

  var MoreChannels = React.createClass({
    render: function () {
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

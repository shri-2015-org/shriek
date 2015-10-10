var ChannelUsersComponent = function (socket) {

  var ChannelUsersStore = require('./../../stores/ChannelUsersStore')(socket);
  var ChannelUsersActions = require('./../../actions/ChannelUsersActions');

  var ChannelUsers = React.createClass({
    getInitialState: function () {
      return ChannelUsersStore.getState(); // теперь мы возвращаем стор, внутри которого хранятся значения стейтов по умолчанию
    },

    componentDidMount: function () {
      ChannelUsersStore.listen(this.onChange); // подписываемся на изменения store
      ChannelUsersActions.initChannels(socket); // вызываем функцию, которая внутри экшена подпишется на событие сокета
    },

    componentWillUnmount: function () {
      ChannelUsersStore.unlisten(this.onChange); // отписываемся от изменений store
    },

    // эта функция выполняется когда store триггерит изменения внутри себя
    onChange: function (state) {
      this.setState(state);
    },

    render: function () {
      var Users = (<div>Загрузка пользователей…</div>);
      var channel = this.state.channel;
      var channelUsers = channel.users;
      var len = 0;

      if (channelUsers) {
        Users = channelUsers.map(function (user) {
          return (<ChannelUser user={user} key={user} />);
        });
        len = channelUsers.length;
      }

      return (
        <div className="msg__users" >
          <div className="msg__users-wrap">
            <div className="channel-info">
              <h3 className="channel-info__heading">{channel.name}</h3>
              {channel.description && channel.description != "" && (
                <h5 className="channel-info__decs">{channel.description}</h5>
              )}
              <input type="checkbox" id="showUsersChannels" className="show_all_checkbox" />
              <ul className="list list_channelUsers">
                {Users}
              </ul>
              <MoreChannels len={len} />
            </div>
          </div>
        </div>
      );
    }
  });

  var ChannelUser = React.createClass({
    render: function () {
      return (
        <li className="list__item">
          <span>{this.props.user}</span>
        </li>
      );
    }
  });

  var MoreChannels = React.createClass({
    render: function () {
      var countDisplaying = 6;
      var hiddenUsersChannelCount = this.props.len - countDisplaying;

      return hiddenUsersChannelCount > 0 && (
        <label className="more more_userschannel show_all_label" htmlFor="showUsersChannels">
          <span>Показать +{hiddenUsersChannelCount}</span>
        </label>
      );
    }
  });

  var AddUsers = React.createClass({
      render: function () {
        return (
          <div className="user__item">
            <span className="user__title"></span>
          </div>
        );
      }
  });

  return ChannelUsers;
}

module.exports = ChannelUsersComponent;

var ChannelUsersComponent = function (socket) {

  var ChannelUsersStore = require('./../../stores/ChannelUsersStore');
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
      var Users = ( <div> Loadingusers... </div>);
      var channel = this.state.channel;
      var userschannel = channel.users;
      if (userschannel) {
        Users = userschannel.map(function (user) {
          return ( <ChannelUser
            user = {user}
            key = {user} />
          );
        });
      }
      return (
        <div className = "msg__users" >
          <div className="channel-info">
            <h3 className="channel-info__heading">{channel.name}</h3>
            {channel.desc && (channel.desc != "") && (
              <h5 className="channel-info__decs">{channel.desc}</h5>
            )}
            <div className="list list_channelUsers">
              {Users}
            </div>
          </div>
        </div>
      );
    }
  });

  var ChannelUser = React.createClass({
    render: function () {
      return(
        <div className = "list__item" >
          <span>
          {this.props.user}
          </span>
        </div>
      );
    }
  });

  var AddUsers = React.createClass({
      render: function () {
        return(
          <div className = "user__item" >
            <span className = "user__title">
            </span>
          </div>
        );
      }
  });

  return ChannelUsers
}

module.exports = ChannelUsersComponent;

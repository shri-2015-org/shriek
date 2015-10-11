var UserComponent = function (socket) {
  var UserListStore = require('./../../stores/UserListStore')(socket); // подключаем стор
  var UserListActions = require('./../../actions/UserListActions'); // подключаем экшены

  var UsersList = React.createClass({
    getInitialState: function() {
    return UserListStore.getState();
    },

    componentDidMount: function () {
      UserListStore.listen(this.onChange); // подписываемся на изменения store
      UserListActions.initUserList(socket);
    },

    componentWillUnmount: function () {
      UserListStore.unlisten(this.onChange); // отписываемся от изменений store
    },

    onChange: function (state) {
      this.setState(state);
    },

    render: function () {
      var Users = (<div>Loading users...</div>);

      if (this.state.users) {
        Users = this.state.users.map(function(user) {
          return (<User key={user._id} user={user} />);
        });
      }

      return (
        <div className="group">
          <div className="heading heading_group">
            <h3 className="heading__header">Пользователи</h3>
          </div>

          <input type="checkbox" id="showAllUsers" className="show_all_checkbox" />
          <ul className="list list_users">
            {Users}
          </ul>
          {this.state.users && (
            <MoreUsers users={this.state.users}/>
          )}
        </div>
      );
    }
  });

  var User = React.createClass({
      componentWillMount: function () {
        this.setState(this.props.user);
      },

      componentDidMount: function () {
        var _this = this;

        socket.on('user connected', function(data) {
          if (data.status === 'ok') {
            socket.emit('user connected');

            data.user.online = true;

            _this.updateUser(data.user);
          }
        });

        socket.on('user disconnected', function(data) {
          if (data.status === 'ok') {
            data.user.online = false;

            _this.updateUser(data.user);
          }
        });
      },

      updateUser: function (user) {
        if (user.username === this.state.username) {
          this.setState(user);
        }
      },

      addUserChannel: function (e) {
        var elem = e.target;
        UserListActions.addUserChannel(elem);
      },

      render: function() {
        var classes = ['list__item'];

        if (this.state.online) {
          classes.push('online');
        }

        return (
          <li className={classes.join(' ')}>
            <a className="name" onClick={this.addUserChannel}>{this.props.user.username}</a>
          </li>
        );
      }
  });

  var MoreUsers = React.createClass({
    render: function() {
      var usersDisplaying = 5;
      var hiddenUsersCount = this.props.users.length - usersDisplaying;

      // Отображаем «Показать» только в случае избыточного количества пользователей
      return hiddenUsersCount > 0 && (
        <label className="more show_all_label" htmlFor="showAllUsers">
          <span>Показать +{hiddenUsersCount}</span>
        </label>
      );
    }
  });

  return UsersList;
};

module.exports = UserComponent;

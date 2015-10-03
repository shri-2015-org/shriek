var UserComponent = function (socket) {
  var Users;

  var UsersList = React.createClass({
    getInitialState: function() {
      return {
        users: []
      };
    },

    componentDidMount: function () {
      var _this = this;

      socket.on('user list', function(data) {
        if (data.status === 'ok') {
          _this.setState({users: data.users});
        }
      });
    },

    render: function () {
      Users = (<div>Loading users...</div>);

      if (this.state.users) {
        Users = this.state.users.map(function(user) {
          var currentUser = '';

          if (socket.username === user.username) {
            currentUser = 'active';
          }

          return (<User key={user._id} user={user} current={currentUser} />);
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

          <MoreUsers/>
        </div>
      );
    }
  });

  var User = React.createClass({
      render: function() {
        var className = 'list__item ' + this.props.current;

        return (
          <li className={className}>
            <a className="name">{this.props.user.username}</a>
          </li>
        );
      }
  });

  var MoreUsers = React.createClass({
    render: function() {
      var usersDisplaying = 3;
      var hiddenUsersCount = Users.length - usersDisplaying;

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

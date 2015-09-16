var UserComponent = function(socket) {

  var UsersList = React.createClass({
    getInitialState: function () {
      return {
        users: []
      };
    },

    componentDidMount: function () {
      var that = this;
      socket.on('user list', function (data) {
        if (data.status === 'ok') {
          that.setState({users: data.users})
        }
      });
      // socket.emit('user list');
    },

    render: function() {
      var Users = (<div>Loading users...</div>);
      var that = this;

      if (this.state.users) {
        Users = this.state.users.map(function (user) {
          var currentUser = '';
          if (socket.username === user.username) {
            currentUser = 'list__item_active';
          }
          return (<User key={user._id} user={user} current={currentUser} />);
        })
      }

      return (
        <div className="group">
          <div className="heading heading_group">
            <h3 className="heading__header">Пользователи</h3>
          </div>
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
      return (
        <div className="more">
          <span>Показать +15</span>
        </div>
      );
    }
  });

  return UsersList;
};

module.exports = UserComponent;

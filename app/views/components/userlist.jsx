var UserComponent = function(socket) {
  var Users;

  var UsersList = React.createClass({
    getInitialState: function() {
      return {
        users: []
      };
    },

    componentDidMount: function() {
      var that = this;

      socket.on('user list', function(data) {
        if (data.status === 'ok') {
          that.setState({users: data.users});
        }
      });
    },

    render: function() {
      Users = (<div>Loading users...</div>);

      var that = this;

      if (this.state.users) {
        Users = this.state.users.map(function(user) {
          var currentUser = '';

          if (socket.username === user.username) {
            currentUser = 'list__item_active';
          }

          return (<User key={user._id} user={user} current={currentUser} />);
        });
      }

      return (
        <div className="group">
          <div className="heading heading_group">
            <h3 className="heading__header">Пользователи</h3>
          </div>
          <ul className="list list_users">
            {Users.slice(0,3)}
          </ul>
          <MoreUsers/>
          <UsersFullList/>
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

  var UsersFullList = React.createClass({
    componentDidMount: function() {
      var dropBox = React.findDOMNode(this.refs.dropBox);
      var OFFSET = 30;
      var geometry = dropBox.getBoundingClientRect();

      var height = window.innerHeight - geometry.top - dropBox.offsetHeight;
      dropBox.style.top = (height > 0 ? geometry.top : geometry.top + height) - OFFSET + 'px';
    },

    handleClick: function() {
      $(React.findDOMNode(this.refs.dropBox)).prev().toggleClass('active_list');
    },

    render: function() {
      return (
        <div className="drop-box" ref="dropBox">
          <div className="drop-box__wrap">
            <div className="heading heading_group heading_dropdown">
              <h3 className="heading__header">Полный список</h3>
              <span className="heading__plus"><i className="fa fa-times" ref="dropBoxClose" onClick={this.handleClick}></i></span>
            </div>
            <ul className="list list_users list_dropdown">
              {Users}
            </ul>
          </div>
        </div>
      );
    }
  });

  var MoreUsers = React.createClass({

    handleClick: function() {
      $(React.findDOMNode(this.refs.moreUsers)).toggleClass("active_list");
    },

    render: function() {
      var len = Users.length;
      var that = this;
      return (
        <div className="more" ref="moreUsers" onClick={that.handleClick}>
          <span>Показать +{len}</span>
        </div>
      );
    }
  });

  return UsersList;
};

module.exports = UserComponent;

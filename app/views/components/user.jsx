var UserComponent = function(socket) {

  var UsersList = React.createClass({

    render: function() {
      return (
        <div className="group">
          <div className="heading heading_group">
            <h3 className="heading__header">Пользователи</h3>
          </div>
          <ul className="list list_users">
            <User/>
          </ul>
          <MoreUsers/>
        </div>
      );
    }

  });

  var User = React.createClass({
    render: function() {
      return (
        <li className="list__item list__item_active">
          <a className="name">User</a>
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

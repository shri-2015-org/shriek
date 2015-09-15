var app = app || {};
var socket = io();

// CHAT MODULE
var ChatComponent = require('../../views/components/message.jsx')(socket);

// CHANNEL LIST MODULE
var ChannelComponent = require('../../views/components/channel.jsx')(socket);

// USERS LIST
var UserComponent = require('../../views/components/user.jsx')(socket);

(function () {
  'use strict';
  var username;

var Title = React.createClass({
  render: function() {
    return (
      <div className="heading">
        <h3 className="heading__header">Shriek Chat</h3>
      </div>
    );
  }
});


var ChatApp = React.createClass({
    render: function () {
    var profileUser;
    var menu, main;

    profileUser = (
      <div className='profile'>
        <div className="profile__out"><i className="fa fa-sign-out fa-2x"></i></div>
          <div className="profile__tools"><i className="fa fa-cog fa-2x"></i></div>
          <div className="profile__img">
          <img src="http://3.bp.blogspot.com/_TbnTJqaNl4U/SVVJ0Mhb4cI/AAAAAAAAANE/57QF4arMr-A/S220-s40/40x40falloutav-vb.gif"/>
        </div>
      </div>
    );

    menu = (
      <div className='nav'>
        <Title/>
        <ChannelComponent/>
        <UserComponent/>
      </div>
    );

    main = (
      <div className="content">
        {profileUser}
        <ChatComponent/>
      </div>
    );

    return (
      <div className="container">
        {menu}
        {main}
      </div>
    );
  }
});


// askLogin component
var AskLogin = React.createClass({
  componentDidMount: function() {
    socket.on('user enter', function(data) {
      if (data.status == 'ok') {
        socket.username = username;

        // i believe, there's a better way
        $('.modal').modal('hide');
      }
    });
  },

  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },

  handlePasswordChange: function(e) {
    this.setState({password: e.target.value});
  },

  handleLogin: function(e) {
    e.preventDefault();
    var warning = $('.modal-body p');
    var warningText = 'Please, fill all fields!';

    if (this.state != null && this.state.name && this.state.password) {
      socket.emit('user enter', {username: this.state.name, password: this.state.password});
    } else {
      warning.css('color', 'red');
      warning.text(warningText);
    }
  },

  render: function() {

    var login_box;

    login_box = (
      <div className='modal fade'>
        <div className='modal-dialog'>
          <div className='modal-content'>
              <div className='modal-header'>
                  <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
                  <h4 className='modal-title'>Login</h4>
              </div>
              <div className='modal-body'>
                  <p>Please, specify your name and password:</p>
                  <form className="form-horizontal" onSubmit={this.handleLogin}>
                    <div className="form-group">
                      <label htmlFor="inputUsername" className="col-sm-2 control-label">Username</label>
                      <div className="col-sm-10">
                        <input onChange={this.handleNameChange} type="username" className="form-control" id="inputUsername" placeholder="Username"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputPassword" className="col-sm-2 control-label">Password</label>
                      <div className="col-sm-10">
                        <input onChange={this.handlePasswordChange} type="password" className="form-control" id="inputPassword" placeholder="Password"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-offset-2 col-sm-10">
                        <button onClick={this.handleLogin} type="submit" className="btn btn-primary">Sign in</button>
                      </div>
                    </div>
                  </form>
              </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {login_box}
      </div>
    );
  }
});

function render() {
  React.render(
    <ChatApp/>,
    document.getElementsByClassName('layout')[0]
  );
}

render();

})();

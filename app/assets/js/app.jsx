var app = app || {};
// Если убираем test.js, то надо раскомментить
// var socket = io();

// CHAT MODULE
var ChatComponent = require('../../views/components/message.jsx')(socket);

// CHANNEL LIST MODULE
var ChannelComponent = require('../../views/components/channel.jsx')(socket, ChatComponent);

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
          <div className="profile__out"><i className="fa fa-power-off fa-lg"></i></div>
            <div className="profile__tools"><i className="fa fa-cog fa-lg"></i></div>
            <div className="profile__img">
            <img src="http://media.steampowered.com/steamcommunity/public/images/avatars/78/78acf20c6efa57fcadad137ff7ababb6f8210305_full.jpg"/>
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
      $('.overflow').css("display", 'none');
      socket.on('user enter', function(data) {
        if (data.status == 'ok') {
          socket.username = username;

          // Request for user list
          socket.emit('user list');

          // i believe, there's a better way
          //$('.modal').modal('hide');

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
      //var warning = $('.modal-body p');
      //var warningText = 'Please, fill all fields!';

      if (this.state != null && this.state.name && this.state.password) {
        socket.emit('user enter', {username: this.state.name, password: this.state.password});
        $('.overflow').css("display", 'none');
      } else {
        //warning.css('color', 'red');
       // warning.text(warningText);
      }
    },

    render: function() {

      var formAuth;

      formAuth = (
        <form className="auth" onSubmit={this.handleLogin}>
          <div className="auth__row">
            <label className="auth__label" htmlFor="inputUsername"><i className="fa fa-user"></i></label>
            <input className="auth__text" onChange={this.handleNameChange} type="username" id="inputUsername" placeholder="Username"/>
          </div>
          <div className="auth__row">
            <label className="auth__label" htmlFor="inputPassword"><i className="fa fa-asterisk"></i></label>
            <input className="auth__text" onChange={this.handlePasswordChange} type="password"id="inputPassword" placeholder="Password"/>
          </div>
          <button className="auth__sbmt" onClick={this.handleLogin} type="submit">Sign in</button>
        </form>
      );

      return (
        <div className="overflow">
          {formAuth}
        </div>
      );
    }
  });

  var Content = React.createClass({
    render: function() {
      return (
        <div className="layout">
          <AskLogin />
          <ChatApp />
        </ div >
      );
    }
  });

  function render() {
    React.render(
      <Content/>,
      document.body
    );
  }

  render();

})();

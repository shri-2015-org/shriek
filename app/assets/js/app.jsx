var app = app || {};
// Если убираем test.js, то надо раскомментить
// var socket = io();

// CHAT MODULE
var ChatComponent = require('../../views/components/message.jsx')(socket);

// CHANNEL LIST MODULE
var ChannelComponent = require('../../views/components/channel.jsx')(socket, ChatComponent);

// USERS LIST
var UserComponent = require('../../views/components/user.jsx')(socket);

// LOGIN MODULE
var LoginComponent = require('../../views/components/login.jsx')(socket);

(function () {
  'use strict';

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

  var Content = React.createClass({
    render: function() {
      return (
        <div className="layout">
          <LoginComponent />
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

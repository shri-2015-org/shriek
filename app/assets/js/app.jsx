var app = app || {};
// Если убираем test.js, то надо раскомментить
var socket = io();
socket.activeChannel = 'general';

// CHAT MODULE
var ChatComponent = require('../../views/components/message.jsx')(socket);

// CHANNEL LIST MODULE
var ChannelComponent = require('../../views/components/channel.jsx')(socket);

// USERS LIST
var UserComponent = require('../../views/components/userlist.jsx')(socket);

// LOGIN MODULE
var LoginComponent = require('../../views/components/login.jsx')(socket);

// PROFILE MODULE
var ProfileComponent = require('../../views/components/profile.jsx')(socket);

// SETTING MODULE
var SettingComponent = require('../../views/components/setting.jsx')(socket);

(function () {
  'use strict';

  var Title = React.createClass({
    render: function () {
      return (
        <div className="heading">
          <h3 className="heading__header">Shriek Chat</h3>
        </div>
      );
    }
  });

  var ChatApp = React.createClass({
    render: function () {
      var menu, main;

      menu = (
        <div className='nav'>
          <Title/>
          <ChannelComponent/>
          <UserComponent/>
        </div>
      );

      main = (
        <div className="content">
          <ProfileComponent/>
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
    render: function () {
      return (
        <div className="layout">
          <SettingComponent />
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

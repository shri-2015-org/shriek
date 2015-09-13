var app = app || {};

(function () {
  'use strict';
  var socket = io();
  var username;

  var TodoApp = React.createClass({displayName: "TodoApp",

      render: function () {
      var footer;
      var main;
      var left_panel;
      var chat_div;
      var send_form;

        left_panel = (
          React.createElement("div", {className: "left_panel"}, 
            "text"
          )
        );
        chat_div = (
          React.createElement("div", {className: "chat_div"}, 
            "chat"
          )
        );
        send_form = (
          React.createElement("div", {className: "send_form"}, 
            "form"
          )
        );

        main = (
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-md-2 left_part"}, 
              left_panel
            ), 
            React.createElement("div", {className: "col-md-10 right_part"}, 
              chat_div, 
              send_form
            )
          )
        );

      return (
        React.createElement("div", {className: "container-fluid"}, 
          main
        )
      );
    }
  });



  function render() {
    React.render(
      React.createElement(TodoApp, null),
      document.getElementsByClassName('todoapp')[0]
    );
    askLogin();
  }

  function askLogin() {
    username = prompt('What is your login?');
    socket.emit('user add', username);
  }

  socket.on('user add', function(data) {
    if (data.status == 'ok') {
      socket.username = username;
    } else {
      askLogin();
    }
  });

  render();

})();
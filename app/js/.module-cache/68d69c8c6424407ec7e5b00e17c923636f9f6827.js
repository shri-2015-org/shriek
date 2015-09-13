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
    askLogin(); // спрашиваем логин (temporary)
  }

/* ЭТО ВРЕМЕННЫЙ КУСОК КОДА */

  // здесь промтом выясняем под каким логином хочется войти и шлем на сервер
  function askLogin() {
    username = prompt('What is your login?');
    socket.emit('user login', username);
  }

  // получаем ответ, если все ок, продолжаем работу, иначе переспрашиваем логин
  socket.on('user login', function(data) {
    if (data.status == 'ok') {
      socket.username = username;
    } else {
      askLogin();
    }
  });

/* ЭТО ВРЕМЕННЫЙ КУСОК КОДА */

  render();

})();

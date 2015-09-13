var app = app || {};

(function () {
  'use strict';
  var socket = io();
  var username;
  var ENTER_KEY = 13;


var ChatBox = React.createClass({displayName: "ChatBox",
  getInitialState: function () {
    return {
      messages: null
    };
  },
  componentDidMount: function () {
    var that = this;
    this.socket = io();
    this.socket.on('message send', function (messages) {
      that.setState({ messages: messages });
    });
    // this.socket.emit('fetchComments');
  },
  submitMessage: function (comment, callback) {
    var message = {
      username: this.socket.username,
      channel: 'general',
      text: 'sometext',
      type: 'text'
    };
    this.socket.emit('message send', message, function (err) {
      if (err)
        return console.error('New comment error:', err);
      callback();
    });
  },
  render: function() {
    return (
      React.createElement("div", {className: "chatBox"}, 
        React.createElement(MessagesList, {messages: this.state.messages}), 
        React.createElement(MessageForm, {submitMessage: this.submitMessage})
      )
    );
  }
});

var MessagesList = React.createClass({displayName: "MessagesList",
  render: function () {
    var Messages = (React.createElement("div", null, "Loading messages..."));
    if (this.props.messages) {
      Messages = this.props.messages.map(function (message) {
        return (React.createElement(Messages, {message: message}));
      });
    }
    return (
      React.createElement("div", {className: "messagesList"}, 
        Messages
      )
    );
  }
});


  var TodoApp = React.createClass({displayName: "TodoApp",

      // handleNewMessageKeyDown: function (event) {
      //   if (event.keyCode !== ENTER_KEY) {
      //     return;
      //   }

      //   event.preventDefault();

      //   var val = React.findDOMNode(this.refs.newField).value.trim();

      //   if (val) {
      //     // this.props.model.addTodo(val); // работа через модель
      //     var message = {
      //       username: socket.username,
      //       channel: 'general',
      //       text: val,
      //       type: 'text'
      //     };
      //     socket.emit('message send', message);
      //     React.findDOMNode(this.refs.newField).value = '';
      //   }
      // },

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
            React.createElement("input", {
              ref: "newField", 
              className: "new-message", 
              placeholder: "Type here your message", 
              onKeyDown: this.handleNewMessageKeyDown, 
              autoFocus: true}
            )
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

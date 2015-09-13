var app = app || {};

(function () {
  'use strict';
  var socket = io();
  var username;
  var ENTER_KEY = 13;


var ChatBox = React.createClass({displayName: "ChatBox",
  getInitialState: function () {
    return {
      messages: []
    };
  },
  componentDidMount: function () {
    var that = this;
    socket.on('message send', function (data) {
      var messagesAll = that.state.messages.slice();
      messagesAll.push(data.message);
      that.setState({ messages: messagesAll });
    });
    // socket.emit('fetch messages');
  },
  submitMessage: function (comment, callback) {
    var message = {
      username: socket.username,
      channel: 'general',
      text: comment,
      type: 'text'
    };
    socket.emit('message send', message);
    callback();
  },
  render: function() {
    return (
      React.createElement("div", {className: "chat_box"}, 
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
        return (React.createElement(Message, {message: message}));
      });
    }
    return (
      React.createElement("div", {className: "chat_div"}, 
        Messages
      )
    );
  }
});

var Message = React.createClass({displayName: "Message",
  render: function () {
    return (
      React.createElement("div", {className: "message"}, 
        React.createElement("span", {className: "author"}, this.props.message.user, ":"), React.createElement("span", {className: "body"}, this.props.message.text)
      )
    );
  }
});

var MessageForm = React.createClass({displayName: "MessageForm",
  handleSubmit: function (e) {
    e.preventDefault();
    var that = this; // чтобы потом найти текстовое поле
    var text = this.refs.text.getDOMNode().value; // получаем текст
    var submitButton = this.refs.submitButton.getDOMNode(); // получаем кнопку
    submitButton.innerHTML = 'Posting message...'; // отключаем кнопку и меняем текст
    submitButton.setAttribute('disabled', 'disabled');
    this.props.submitMessage(text, function (err) { // вызываем submitMessage, передаем колбек
      that.refs.text.getDOMNode().value = '';
      submitButton.innerHTML = 'Post message';
      submitButton.removeAttribute('disabled');
    });
  },
  render: function () {
    return (
      React.createElement("div", {className: "send_form"}, 
        React.createElement("form", {className: "messageForm", onSubmit: this.handleSubmit}, 
          React.createElement("input", {name: "text", ref: "text", placeholder: "Message", required: true}), 
          React.createElement("button", {type: "submit", ref: "submitButton"}, "Post message")
        )
      )
    );
  }
});

  var TodoApp = React.createClass({displayName: "TodoApp",


      componentDidMount: function() {

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

          askLogin(); // спрашиваем логин (temporary)
      },

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

        main = (
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-md-2 left_part"}, 
              left_panel
            ), 
            React.createElement("div", {className: "col-md-10 right_part"}, 
              React.createElement(ChatBox, null)
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

  }

  render();

})();

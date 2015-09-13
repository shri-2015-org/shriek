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
    this.socket = io();
    this.socket.on('message send', function (data) {
      var messagesAll = that.state.messages.slice();
      messagesAll.push(data.message);
      that.setState({ messages: messagesAll });
    });
    // this.socket.emit('fetch messages');
  },
  submitMessage: function (comment, callback) {
    var message = {
      username: this.socket.username,
      channel: 'general',
      text: 'sometext',
      type: 'text'
    };
    console.log('1231312');
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
        return (React.createElement(Message, {message: message}));
      });
    }
    return (
      React.createElement("div", {className: "messagesList"}, 
        Messages
      )
    );
  }
});

var Message = React.createClass({displayName: "Message",
  render: function () {
    return (
      React.createElement("div", {className: "message"}, 
        React.createElement("span", {className: "author"}, this.props.message.username), " said:", React.createElement("br", null), 
        React.createElement("div", {className: "body"}, this.props.message.text)
      )
    );
  }
});

var MessageForm = React.createClass({displayName: "MessageForm",
  handleSubmit: function (e) {
    e.preventDefault();
    var that = this;
    var author = socket.username;
    var text = this.refs.text.getDOMNode().value;
    var comment = { user: username, text: text };
    var submitButton = this.refs.submitButton.getDOMNode();
    submitButton.innerHTML = 'Posting comment...';
    submitButton.setAttribute('disabled', 'disabled');
    this.props.submitMessage(comment, function (err) {
      that.refs.text.getDOMNode().value = '';
      submitButton.removeAttribute('disabled');
    });
  },
  render: function () {
    return (
      React.createElement("form", {className: "messageForm", onSubmit: this.handleSubmit}, 
        React.createElement("textarea", {name: "text", ref: "text", placeholder: "Comment", required: true}), React.createElement("br", null), 
        React.createElement("button", {type: "submit", ref: "submitButton"}, "Post comment")
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

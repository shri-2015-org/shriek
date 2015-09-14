var app = app || {};

(function () {
  'use strict';
  var socket = io();
  var username;

// CHAT MODULE
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
    socket.emit('channel get', {channel: 'general', date: new Date()});
  },
  submitMessage: function (text, callback) {
    var message = {
      username: socket.username,
      channel: 'general',
      text: text,
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
        React.createElement("span", {className: "author"}, this.props.message.username, ":"), React.createElement("span", {className: "body"}, this.props.message.text)
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
// CHAT MODULE

// CHANEL LIST MODULE
var ChannelsList = React.createClass({displayName: "ChannelsList",
  getInitialState: function () {
    return {
      channels: []
    };
  },
  componentDidMount: function () {
    var that = this;
    socket.on('channel list', function (data) {
      that.setState({ channels: data.channels });
    });
    socket.emit('channel list');
    socket.on('channel get', function (data) {
      console.log('change chat room');
      // React.ChatBox.setState({messages: data.messages});
    });
  },
  changeChannel: function(event) {
    socket.emit('channel get', {channel: event.target.dataset.slug, date: new Date()});
  },
  render: function () {
    var Channels = (React.createElement("div", null, "Loading channels..."));
    var that = this;
    if (this.state.channels) {
      Channels = this.state.channels.map(function (channel) {
        return (React.createElement(Channel, {channel: channel, changeChannel: that.changeChannel}));
      });
    }
    return (
      React.createElement("div", {className: "channel_list"}, 
        Channels
      )
    );
  }
});

var Channel = React.createClass({displayName: "Channel",
  clickHandler: function(event) {
    this.props.changeChannel(event);
  },
  render: function () {
    return (
      React.createElement("div", {className: "channel"}, 
        React.createElement("a", {className: "name", onClick: this.clickHandler, "data-slug": this.props.channel.slug}, this.props.channel.name)
      )
    );
  }
});
// CHANEL LIST MODULE

var ChatApp = React.createClass({displayName: "ChatApp",

    render: function () {
    var main;
    var left_panel;

    left_panel = (
      React.createElement("div", {className: "left_panel"}, 
        React.createElement(ChannelsList, null)
      )
    );

    main = (
      React.createElement("div", {className: "row"}, 
        React.createElement(AskLogin, null), 
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


// askLogin component
var AskLogin = React.createClass({displayName: "AskLogin",

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

  handleLogin: function() {
    socket.emit('user enter', {username: this.state.name, password: this.state.password});
  },

  render: function() {

    var login_box;

    login_box = (
      React.createElement("div", {className: "modal fade"}, 
        React.createElement("div", {className: "modal-dialog"}, 
          React.createElement("div", {className: "modal-content"}, 
              React.createElement("div", {className: "modal-header"}, 
                  React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
                  React.createElement("h4", {className: "modal-title"}, "Login")
              ), 
              React.createElement("div", {className: "modal-body"}, 
                  React.createElement("p", null, "Please, specify your name and password:"), 
                  React.createElement("div", {className: "input-group"}, 
                    React.createElement("input", {onChange: this.handleNameChange, type: "text", className: "form-control", placeholder: "Username"}), 
                    React.createElement("input", {onChange: this.handlePasswordChange, type: "password", className: "form-control", placeholder: "Password"})
                  )
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                  React.createElement("button", {onClick: this.handleLogin, type: "button", className: "btn btn-primary"}, "Enter chat")
              )
          )
        )
      )
    );

    return (
      React.createElement("div", null, 
        login_box
      )
    );
  }
});

function render() {
  React.render(
    React.createElement(ChatApp, null),
    document.getElementsByClassName('chatApp')[0]
  );
}

render();

})();

$(function() {
  $('.modal').modal('show');
});

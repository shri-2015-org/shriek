var app = app || {};

(function () {
  'use strict';
  var socket = io();
  var username;

// CHAT MODULE
var ChatBox = React.createClass({
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
      <div className="chat_box">
        <MessagesList messages={this.state.messages}/>
        <MessageForm submitMessage={this.submitMessage}/>
      </div>
    );
  }
});

var MessagesList = React.createClass({
  render: function () {
    var Messages = (<div>Loading messages...</div>);
    if (this.props.messages) {
      Messages = this.props.messages.map(function (message) {
        return (<Message message={message} />);
      });
    }
    return (
      <div className="chat_div">
        {Messages}
      </div>
    );
  }
});

var Message = React.createClass({
  render: function () {
    return (
      <div className="message">
        <span className="author">{this.props.message.username}:</span><span className="body">{this.props.message.text}</span>
      </div>
    );
  }
});

var MessageForm = React.createClass({
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
      <div className='send_form'>
        <form className="messageForm" onSubmit={this.handleSubmit}>
          <input name="text" ref="text" placeholder="Message" required />
          <button type="submit" ref="submitButton">Post message</button>
        </form>
      </div>
    );
  }
});
// CHAT MODULE

// CHANEL LIST MODULE
var ChannelsList = React.createClass({
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
    var Channels = (<div>Loading channels...</div>);
    var that = this;
    if (this.state.channels) {
      Channels = this.state.channels.map(function (channel) {
        return (<Channel channel={channel} changeChannel={that.changeChannel}/>);
      });
    }
    return (
      <div className="channel_list">
        {Channels}
      </div>
    );
  }
});

var Channel = React.createClass({
  clickHandler: function(event) {
    this.props.changeChannel(event);
  },
  render: function () {
    return (
      <div className="channel">
        <a className="name" onClick={this.clickHandler} data-slug={this.props.channel.slug}>{this.props.channel.name}</a>
      </div>
    );
  }
});
// CHANEL LIST MODULE

var ChatApp = React.createClass({

    render: function () {
    var main;
    var left_panel;

    left_panel = (
      <div className='left_panel'>
        <ChannelsList/>
      </div>
    );

    main = (
      <div className="row">
        <AskLogin/>
        <div className="col-md-2 left_part">
          {left_panel}
        </div>
        <div className="col-md-10 right_part">
          <ChatBox/>
        </div>
      </div>
    );

    return (
      <div className='container-fluid'>
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

  handleLogin: function() {
    socket.emit('user enter', {username: this.state.name, password: this.state.password});
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
                  <div className="input-group">
                    <input onChange={this.handleNameChange} type="text" className="form-control" placeholder="Username"/>
                    <input onChange={this.handlePasswordChange} type="password" className="form-control" placeholder="Password"/>
                  </div>
              </div>
              <div className="modal-footer">
                  <button onClick={this.handleLogin} type='button' className='btn btn-primary'>Enter chat</button>
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
    document.getElementsByClassName('chatApp')[0]
  );
}

render();

})();

$(function() {
  $('.modal').modal('show');
});

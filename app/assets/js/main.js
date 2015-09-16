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
      <div className="msg">
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
      <div className="msg__list">
        {Messages}
      </div>
    );
  }
});

var Message = React.createClass({
  render: function () {
    return (
      <div className="msg__item">
        <span className="msg__author">{this.props.message.username}: </span><span className="msg__text">{this.props.message.text}</span>
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
      <div className='send'>
        <form className="send__form" onSubmit={this.handleSubmit}>
          <input className="send__text" name="text" ref="text" placeholder="Сообщение" required />
          <button type="submit" className="hidden" ref="submitButton">Post message</button>
        </form>
      </div>
    );
  }
});
// CHAT MODULE

// CHANNEL LIST MODULE
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
      <div className="group">
        <div className="heading heading_group">
          <h3 className="heading__header">Каналы</h3>
          <span className="heading__plus"><i className="fa fa-plus-square-o fa-lg"></i></span>
        </div>
        <ul className="list list_channels">
          {Channels}
        </ul>
        <MoreChannels />
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
      <li className="list__item">
        <a className="name" onClick={this.clickHandler} data-slug={this.props.channel.slug}>{this.props.channel.name}</a>
      </li>
    );
  }
});

var MoreChannels = React.createClass({
  render: function() {
    return (
      <div className="more">
        <span>Показать +7</span>
      </div>
    );
  }
});

// USERS LIST
var UsersList = React.createClass({

  render: function() {
    return (
      <div className="group">
        <div className="heading heading_group">
          <h3 className="heading__header">Пользователи</h3>
        </div>
        <ul className="list list_users">
          <User/>
        </ul>
        <MoreUsers/>
      </div>
    );
  }

});

var User = React.createClass({
  render: function() {
    return (
      <li className="list__item list__item_active">
        <a className="name">User</a>
      </li>
    );
  }
});

var MoreUsers = React.createClass({
  render: function() {
    return (
      <div className="more">
      <span>Показать +15</span>
      </div>
    );
  }
});

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
        <div className="profile__out"><i className="fa fa-sign-out fa-2x"></i></div>
          <div className="profile__tools"><i className="fa fa-cog fa-2x"></i></div>
          <div className="profile__img">
          <img src="http://3.bp.blogspot.com/_TbnTJqaNl4U/SVVJ0Mhb4cI/AAAAAAAAANE/57QF4arMr-A/S220-s40/40x40falloutav-vb.gif"/>
        </div>
      </div>
    );

    menu = (
      <div className='nav'>
        <Title/>
        <ChannelsList/>
        <UsersList/>
      </div>
    );

    main = (
      <div className="content">
        {profileUser}
        <ChatBox/>
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
    socket.on('user enter', function(data) {
      if (data.status == 'ok') {
        socket.username = username;

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


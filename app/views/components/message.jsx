var MessagesStore = require('./../../stores/MessagesStore'); // подключаем стор
var MessagesActions = require('./../../actions/MessagesActions'); // подключаем экшены

var ChatComponent = function (socket) {
  var ChatBox = React.createClass({
    getInitialState: function () {
      return MessagesStore.getState(); // теперь мы возвращаем стор, внутри которого хранятся значения стейтов по умолчанию
    },

    componentDidMount: function () {
      MessagesStore.listen(this.onChange); // подписываемся на изменения store
      MessagesActions.initMessages(socket);
      MessagesActions.getMessages(socket);
    },

    componentWillUnmount() {
      MessagesStore.unlisten(this.onChange); // отписываемся от изменений store
    },

    // эта функция выполняется когда store триггерит изменения внутри себя
    onChange(state) {
      this.setState(state);
    },

    submitMessage: function (text, callback) {

      var message = {
        username: socket.username,
        channel: socket.activeChannel,
        text: text,
        type: 'text'
      };
      socket.emit('message send', message);
      callback();

    },

    render: function () {
      return (
        <div className="msg">
          <div className="msg__wrap">
            <ChannelUsers users={this.state.users}/>
            <div className="msg__body">
            <MessagesList messages={this.state.messages}/>
            </div>
          </div>
          <MessageForm submitMessage={this.submitMessage}/>
        </div>
      );
    }
  });

  var MessagesList = React.createClass({
    componentDidMount: function () {
      var msglist = $(React.findDOMNode(this.refs.msg_list));
    },

    render: function () {
      var Messages = (<div>Loading messages...</div>);

      if (this.props.messages) {
        Messages = this.props.messages.map(function (message) {
          return (<Message message={message} key={message._id}/>);
        });
      }

      return (
        <div className="msg__list" ref="msglist">
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

  var ChannelUsers = React.createClass({
    render: function () {

      var Users = (<div>Loading users...</div>);

      if (this.props.users) {
        Users = this.props.users.map(function (user) {
          return (<ChannelUser user={user} key={user}/>);
        });
      }

      return (
        <div className="msg__users">
          {Users}
        </div>
      );
    }
  });

  var ChannelUser = React.createClass({
    render: function () {
      return (
        <div className="user__item">
          <span className="user__title">{this.props.user}</span>
        </div>
      );
    }
  });

  var MessageForm = React.createClass({
    handleSubmit: function (e) {
      e.preventDefault();
      var _this = this; // чтобы потом найти текстовое поле
      var text = this.refs.text.getDOMNode().value; // получаем текст
      var submitButton = this.refs.submitButton.getDOMNode(); // получаем кнопку
      submitButton.innerHTML = 'Posting message...'; // отключаем кнопку и меняем текст
      submitButton.setAttribute('disabled', 'disabled');

      this.props.submitMessage(text, function (err) { // вызываем submitMessage, передаем колбек
        _this.refs.text.getDOMNode().value = '';
        submitButton.innerHTML = 'Post message';
        submitButton.removeAttribute('disabled');
      });

    },

    render: function () {
      return (
        <div className='send'>
          <form className="send__form" onSubmit={this.handleSubmit}>
            <input className="send__text" name="text" ref="text" placeholder="Сообщение" autoComplete="off" autoFocus required />
            <button type="submit" className="hidden" ref="submitButton">Post message</button>
          </form>
        </div>
      );
    }
  });

  return ChatBox;
};

module.exports = ChatComponent;

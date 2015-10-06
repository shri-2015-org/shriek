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

    componentWillUnmount: function () {
      MessagesStore.unlisten(this.onChange); // отписываемся от изменений store
    },

    // эта функция выполняется когда store триггерит изменения внутри себя
    onChange: function (state) {
      this.setState(state);
    },

    submitMessage: function (text, callback) {

      if (!text) {
        callback('Enter message, please!');
      } else {
        var message = {
          username: socket.username,
          channel: socket.activeChannel,
          text: text,
          type: 'text'
        };
        socket.emit('message send', message);
        callback();
      }

    },

    render: function () {
      return (
        <div className="msg">
          <div className="msg__wrap">
            <div className="msg__body">
            <MessagesList messages={this.state.messages} stopScroll={this.state.stopScroll}/>
            </div>
          </div>
          <MessageForm submitMessage={this.submitMessage}/>
        </div>
      );
    }
  });

  var MessagesList = React.createClass({
    getInitialState: function () {
      return ( { scrollValue: 0, scrollHeight: 0 } );
    },
    componentDidMount: function () {
      var msglist = $(React.findDOMNode(this.refs.msg_list));
    },
    handleScroll: function () {
      if (!this.props.stopScroll) {
        var node = this.getDOMNode();
        if (node.scrollTop === 0) {
          if (this.state.scrollValue == 0) {
            this.state.startScrollHeight = node.scrollHeight;
          }
          this.state.scrollValue++;
          MessagesActions.getMessages(socket, this.state.scrollValue);
          this.state.scrollHeight = this.state.startScrollHeight;
          this.forceUpdate();
        }
      }
    },
    componentDidUpdate: function () {
      this.getDOMNode().scrollTop = this.state.scrollHeight;
    },
    render: function () {
      var Messages = (<div>Loading messages...</div>);
      if (this.props.messages) {
        Messages = this.props.messages.map(function (message) {
          return (<Message message={message} key={message._id}/>);
        });
      }
      return (
        <div className="msg__list" ref="msglist" onScroll={this.handleScroll}>
          {Messages}
        </div>
      );
    }
  });

  var Message = React.createClass({
    render: function () {
      var classes = ['msg__item'];

      if (this.props.message.searched) {
        classes.push('msg__searched');
      }

      return (
        <div className={classes.join(' ')}>
          <MessageDate date={this.props.message.date}/>
          <span className="msg__author">{this.props.message.username}: </span>
          <div
            className="msg__text"
            dangerouslySetInnerHTML={{
              __html: this.props.message.text
            }} />
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

    handleKeyDown: function (e) {
      var pressSubmit = !(e.metaKey || e.ctrlKey) && e.keyCode === 13;
      var pressNewLine = (e.metaKey || e.ctrlKey) && e.keyCode === 13;
      if (pressSubmit) {
        this.handleSubmit(e);
      }
      if (pressNewLine) {
        var area = document.getElementsByName('text').item(0);
        if ( (area.selectionStart) || (area.selectionStart == '0') ) {
          var start = area.selectionStart;
          var end = area.selectionEnd;
          area.value = area.value.substring(0, start) +
            '\n' + area.value.substring(end, area.value.length);
          area.setSelectionRange(start + 1, start + 1);
        }
      }
    },

    render: function () {
      return (
        <div className='send'>
          <form className="send__form" onSubmit={this.handleSubmit} ref="formMsg">
            <textarea className="send__text" onKeyDown={this.handleKeyDown} name="text" ref="text" placeholder="Сообщение" autoFocus required />
            <Emoji/>
            <button type="submit" className="hidden" ref="submitButton">Post message</button>
          </form>
        </div>
      );
    }
  });

  var MessageDate = React.createClass({
    render: function () {
      return (
        <span className='message-date'>{this.props.date}</span>
      )
    }
  });

  return ChatBox;
};

module.exports = ChatComponent;

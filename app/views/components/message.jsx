var MessagesStore = require('./../../stores/MessagesStore'); // подключаем стор
var MessagesActions = require('./../../actions/MessagesActions'); // подключаем экшены

var markDownConverter = new showdown.Converter();

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
      this.props.message.text = this.props.message.text.replace(/:(\w{3,10}):/gmi, function(string, firstVal) {
        return '<span class="emoji emoji-'+firstVal+'"></span>';
      });
      return (
        <div className="msg__item">
          <span className="msg__author">{this.props.message.username}: </span>
          <div
            className="msg__text"
            dangerouslySetInnerHTML={{
              __html: markDownConverter.makeHtml(this.props.message.text)
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
      var pressKeys = (e.metaKey || e.ctrlKey) && e.keyCode === 13;
      if (pressKeys) {
        this.handleSubmit(e);
      }
    },

    render: function () {
      return (
        <div className='send'>
          <form className="send__form" onSubmit={this.handleSubmit} ref="formMsg">
            <textarea className="send__text" onKeyDown={this.handleKeyDown} name="text" ref="text" placeholder="Сообщение" autoFocus required />
            <EmojiBtn/>
            <button type="submit" className="hidden" ref="submitButton">Post message</button>
          </form>
        </div>
      );
    }
  });

  var EmojiBtn = React.createClass({
    getInitialState: function () {
      return { showEmojiMenu : false };
    },
    toggleEmojiMenu: function (e) {
      var active = this.state.showEmojiMenu ? false : true;
      this.setState({ showEmojiMenu : active });
    },
    render: function () {
      var emojiValues = ['smile',
        'grin',
        'wink',
        'laugh',
        'tongue',
        'yum',
        'inlove',
        'business',
        'sad',
        'yeah',
        'pensive',
        'tears',
        'cry',
        'weary',
        'shout',
        'pokerface',
        'relieved',
        'angry',
        'rage',
        'angel',
        'fearful',
        'shoked',
        'astonished',
        'mask',
        'kisses',
        'devil',
        'heart',
        'thumbsup',
        'thumbsdown',
        'pointup',
        'victory',
        'okey'
      ];
      var classes = this.state.showEmojiMenu ? 'emoji-btn active' : 'emoji-btn';
      return (
        <div>
          <a className={classes} onClick={this.toggleEmojiMenu}></a>
          <EmojiMenu show={this.state.showEmojiMenu} items={emojiValues}/>
        </div>
      )
    }
  });

  var EmojiMenu = React.createClass({
    addEmoji: function(type) {
      var emoji = ' :' + type + ': ';
      var area = document.getElementsByName('text').item(0);
      if ( (area.selectionStart) || (area.selectionStart == '0') ) {
        var start = area.selectionStart;
        var end = area.selectionEnd;
        area.value = area.value.substring(0, start) + emoji + area.value.substring(end, area.value.length);
      }
    },
    render: function () {
      var self = this;
      var classes = this.props.show ? 'emoji-menu active' : 'emoji-menu';
      return (
        <div className={classes}>
          { this.props.items.map(function(value){
            var classes = 'emoji emoji-' + value;
            return <span className={classes} onClick={self.addEmoji.bind(self, value)}></span>;
          }) }
        </div>
      )
    }
  });
  return ChatBox;
};

module.exports = ChatComponent;

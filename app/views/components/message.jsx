var ChatComponent = function (socket) {
  var MessagesStore = require('./../../stores/MessagesStore')(socket); // подключаем стор
  var MessagesActions = require('./../../actions/MessagesActions'); // подключаем экшены

  var ChannelUsers = require('../../views/components/channelUsers.jsx')(socket);

  var ChatBox = React.createClass({
    getInitialState: function () {
      return MessagesStore.getState(); // теперь мы возвращаем стор, внутри которого хранятся значения стейтов по умолчанию
    },

    componentDidMount: function () {
      MessagesStore.listen(this.onChange); // подписываемся на изменения store
      MessagesActions.initMessages(socket);

      socket.emit('channel get', {
        channel: socket.activeChannel,
        limit: 20,
        force: true,
        scrollAfter: true
      });
      socket.emit('channel info', {
        slug: socket.activeChannel
      });

      window.shriek = {};
      window.shriek.stopscroll = false;
    },

    componentWillUnmount: function () {
      MessagesStore.unlisten(this.onChange); // отписываемся от изменений store
    },

    // эта функция выполняется когда store триггерит изменения внутри себя
    onChange: function (state) {
      this.setState(state);
    },

    submitMessage: function (text, callback) {
      if (text) {
        var message = {
          username: socket.username,
          channel: socket.activeChannel,
          text: text,
          type: 'text'
        };

        socket.emit('message send', message);
        callback();
      } else {
        callback('Enter message, please!');
      }

    },

    render: function () {
      return (
        <div className="msg">
          <div className="msg__loading"><i className="fa fa-circle-o-notch fa-spin"></i></div>
          <div className="msg__wrap">
            <div className="msg__body">
              <MessagesList messages={this.state.messages} hideMore={this.state.hideMore} />
            </div>
            <ChannelUsers />
          </div>
          <MessageForm submitMessage={this.submitMessage} plugins={this.state.plugins}/>
        </div>
      );
    }
  });

  var MessagesList = React.createClass({
    getInitialState: function () {
      return ( { } );
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

    },
    clickMoreHandler: function() {
      var skip = MessagesStore.getState().skip; // подписываемся на изменения store
      MessagesActions.getMessages(socket, skip);
    },

    render: function () {
      var Messages = (<div>Loading messages...</div>);

      if (this.props.messages) {
        Messages = this.props.messages.map(function (message) {
          return (<Message message={message} key={message._id} />);
        });
      }

      var classes = 'msg__load_more ' + (this.props.hideMore ? 'hidden' : '');
      return (
        <div className="msg__list" ref="msglist">
          <div className={classes} onClick={this.clickMoreHandler}>Загрузить еще</div>
          {Messages}
        </div>
      );
    }
  });

  var Message = React.createClass({
    render: function () {
      var classes = ['msg__item'];
      var message = this.props.message.raw || this.props.message.text;

      if (this.props.message.searched) {
        classes.push('msg__searched');
      }

      return (
        <div className={classes.join(' ')}>
          <MessageDate date={this.props.message.created_at}/>
          <span className="msg__author">{this.props.message.username}: </span>
          <div
            className="msg__text"
            dangerouslySetInnerHTML={{__html: message}} />
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

    resize: function() {
      var textarea = this.refs.text.getDOMNode();
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight > 105 ? 105 : textarea.scrollHeight)+'px';
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

      this.resize();
    },

    render: function () {
      var messagePlugins = this.props.plugins || [];
      return (
        <div className='send'>
          <form className="send__form" onSubmit={this.handleSubmit} ref="formMsg">
            <textarea className="send__text" onKeyDown={this.handleKeyDown} onKeyUp={this.resize} onInput={this.resize} name="text" ref="text" placeholder="Сообщение" autoFocus required rows="1" />
            {messagePlugins.map(function (PluginComponent) {
              return <PluginComponent/>;
            })}
            <button type="submit" className="hidden" ref="submitButton">Post message</button>
          </form>
        </div>
      );
    }
  });

  var MessageDate = React.createClass({
    render: function () {
      var localDate = new Date(this.props.date);
      var hour = localDate.getHours();
      var minutes = localDate.getMinutes();
      var date = ('0' + hour).slice(-2) + ':' + ('0' + minutes).slice(-2);
      var day = localDate.getDate();
      var month = localDate.getMonth();
      var fullDate = date + ' ' + ('0' + day).slice(-2) + '/' +
        ('0' + month).slice(-2) + '/' + localDate.getFullYear();
      return (
        <span className='msg__date' title={fullDate}>{date}</span>
      )
    }
  });

  return ChatBox;
};

module.exports = ChatComponent;

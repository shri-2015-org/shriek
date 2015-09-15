var ChatComponent = function(socket) {
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

  return ChatBox;
};

module.exports = ChatComponent;

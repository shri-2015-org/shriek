var ChannelComponent = function (socket) {

var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор
var ChannelsActions = require('./../../actions/ChannelsActions'); // подключаем экшены

  var ChannelsList = React.createClass({
    getInitialState: function () {
      return ChannelsStore.getState(); // теперь мы возвращаем стор, внутри которого хранятся значения стейтов по умолчанию
    },

    componentDidMount: function () {
      var showModalButton = React.findDOMNode(this.refs.showModalButton);
      ChannelsStore.listen(this.onChange); // подписываемся на изменения store
      ChannelsActions.initChannels(socket); // вызываем функцию, которая внутри экшена подпишется на событие сокета
      ChannelsActions.getChannels(socket); // вызываем первый экшен, который пулучит список каналов. на самом деле, его нужно делать не здесь, а сразу после успешного логина
      ChannelsActions.modalHadlers(showModalButton);
    },

    componentWillUnmount: function () {
      ChannelsStore.unlisten(this.onChange); // отписываемся от изменений store
    },

    // эта функция выполняется когда store триггерит изменения внутри себя
    onChange: function (state) {
      this.setState(state);
    },

    changeChannel: function (event) {
      socket.activeChannel = event.target.dataset.slug;
      socket.emit('channel get', {
        channel: event.target.dataset.slug,
        date: new Date()
      });
      socket.emit('channel join', {
        channel: event.target.dataset.slug
      });
      socket.emit('channel info', {
        channel: event.target.dataset.slug
      });
    },

    hideModal: function (e) {
      e.preventDefault();
      this.setState({show_modal: false});
    },

    addChannel: function (e) {
      e.preventDefault();

      var name = $(e.target).find('#channel').val().trim();
      if (name) {
        socket.emit('channel create', {name: name, userslist: this.state.newChannel.userList});
      }
    },

    render: function () {
      var Channels = (<div>Loading channels...</div>);
      var _this = this;
      var len_channels = 0;
      if (this.state.channels) {
        Channels = this.state.channels.map(function (channel) {
          return (
            <Channel
              channel={channel}
              changeChannel={_this.changeChannel}
              key={channel._id} />
          );
        });

        len_channels = Channels.length;
      }

      return (
        <div className="group">
          <div className="heading heading_group">
            <h3 className="heading__header">Каналы</h3>
            <ButtonAddChannel ref="showModalButton"/>
          </div>
          <input type="checkbox" id="showAllChannels" className="show_all_checkbox" />
          <ul className="list list_channels">
            {Channels}
          </ul>
          <MoreChannels len = {len_channels}/>
          {this.state.show_modal == true && (
            <AddChannelModal handleSubmit={this.addChannel} handleClose={this.hideModal}/>
          )}
        </div>
      );
    }
  });

  var Channel = React.createClass({
    clickHandler: function (event) {
      this.props.changeChannel(event);
    },

    render: function () {

      var className = 'list__item ' +
        (this.props.channel.isActive ? ' active' : '') +
        (this.props.channel.isUnread ? ' unread' : '');

      return (
        <li className={className}>
          <a
            className="name"
            onClick={this.clickHandler}
            data-slug={this.props.channel.slug}
          >{this.props.channel.name}</a>
        </li>
      );
    }
  });

  var MoreChannels = React.createClass({
    render: function () {
      var channelsDisplaying = 3;
      var hiddenChannelsCount = this.props.len - channelsDisplaying;

      // Отображаем «Показать» только в случае избыточного количества каналов
      return hiddenChannelsCount > 0 && (
        <label className="more show_all_label" htmlFor="showAllChannels">
          <span>Показать +{hiddenChannelsCount}</span>
        </label>
      );
    }
  });

  var ButtonAddChannel = React.createClass({
    render: function () {
      return (
        <span className="heading__plus" onClick={this.props.handleClick}>
          <i className="fa fa-plus-square-o fa-lg"></i>
        </span>
      );
    }
  });

  var UserList = React.createClass({
    render: function() {
      var List = [];
      List = Users.map(function (user) {
        return ( <User key = {user._id} user = {user} />);
      });

      return (
        <ul className="userlist" id="userlistadd">
          <li className="userlist__item">Выберите пользователя</li>
          {List}
        </ ul>
      );
    }
  });

  var User = React.createClass({
    clickCheckboxHandler: function(e) {


      if (e.target.checked) {
        ChannelsActions.addUserToNewChannel(this.props.user.username);
      } else {
        ChannelsActions.deleteUserFromNewChannel(this.props.user.username);
      }
    },
    render: function() {
      return (
        <li className="userlist__item">
          <label>
            <input type="checkbox" onClick={this.clickCheckboxHandler} />
            <span>{this.props.user.username}</span>
          </label>
        </li>
      );
    }
  });

  var AddChannelModal = React.createClass({
    render: function () {
      return (
        <div className="modal">
          <form className="form modal__body" onSubmit={this.props.handleSubmit}>
            <h2 className="modal__heading">Назовите канал</h2>
            <div className="form__row">
              <label className="form__label" htmlFor="channel"><i className="fa fa-users"></i></label>
              <input className="form__text" type="text" id="channel" ref="inputNameChannel" placeholder="Канал" />
            </div>
            <button className="btn" type="submit">Добавить</button>
            <span> </span>
            <button className="btn" onClick={this.props.handleClose} type="button">Close</button>
          </form>
        </div>
      );
    }
  });

  return ChannelsList
};

module.exports = ChannelComponent;

var ChannelComponent = function (socket) {
var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор
var ChannelsActions = require('./../../actions/ChannelsActions'); // подключаем экшены

  var ChannelsList = React.createClass({
    getInitialState: function () {
      return ChannelsStore.getState(); // теперь мы возвращаем стор, внутри которого хранятся значения стейтов по умолчанию
    },

    componentDidMount: function () {
      ChannelsStore.listen(this.onChange); // подписываемся на изменения store
      ChannelsActions.initChannels(socket); // вызываем функцию, которая внутри экшена подпишется на событие сокета
      ChannelsActions.getChannels(socket); // вызываем первый экшен, который пулучит список каналов. на самом деле, его нужно делать не здесь, а сразу после успешного логина
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
        slug: socket.activeChannel
      });
      this.refs.show_all_checkbox.getDOMNode().checked = false;
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
          <input type="checkbox" id="showAllChannels" ref='show_all_checkbox' className="show_all_checkbox" />
          <ul className="list list_channels">
            {Channels}
          </ul>
          <MoreChannels len = {len_channels}/>
          {this.state.show_modal === true && (
            <AddChannelModal userlist = {this.state.userList}/>
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
      var channelsDisplaying = 5;
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
    handleShowModal: function() {
        ChannelsActions.updateShowModal(true);
    },

    render: function () {
      return (
        <span className="heading__plus" onClick={this.handleShowModal}>
          <i className="fa fa-plus-square-o fa-lg"></i>
        </span>
      );
    }
  });

  var UserList = React.createClass({
    render: function () {
      var UsersList = [];
      UsersList = this.props.userlist.map(function (user) {
        return (<User key={user._id} user={user} />);
      });

      return (
        <div className="userlist__wrap">
          <h3 className="userlist__heading">Выберите пользователей</h3>
          <ul className="userlist__list">
            {UsersList}
          </ul>
        </div>
      );
    }
  });

  var User = React.createClass({
    clickCheckboxHandler: function (e) {
      if (e.target.checked) {
        ChannelsActions.addUserToNewChannel(this.props.user.username);
      } else {
        ChannelsActions.deleteUserFromNewChannel(this.props.user.username);
      }
    },

    render: function () {
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
    handleSubmit: function (e) {
      e.preventDefault();
      var name = React.findDOMNode(this.refs.сhannelName).value.trim();
      var description = React.findDOMNode(this.refs.channelDesc).value.trim();
      ChannelsActions.addNewChannel({name: name, description: description});
    },

    handleCloseModal: function () {
      ChannelsActions.updateShowModal(false);
    },

    handleSetPrivate: function (e) {
      var statePrivate = false;
      if (e.target.checked) statePrivate = true;
      ChannelsActions.setPrivateMoreUsersChannel(statePrivate);
    },

    render: function () {
      return (
        <div className="modal">
          <form className="form modal__body" onSubmit={this.handleSubmit}>
            <h2 className="modal__heading heading">Добавьте канал</h2>
            <div className="form__row">
                  {ChannelsStore.getState().hasError &&(
                    <div>{ChannelsStore.getState().hasError}</div>
                  )}
                </div>
            <div className="form__row">
              <label className="form__label" htmlFor="channelName"><i className="fa fa-users"></i></label>
              <input className="form__text" type="text" id="channelName" ref="сhannelName" placeholder="Назовите" />
            </div>
            <div className="form__row">
              <label className="form__label" htmlFor="channelDesc"><i className="fa fa-edit"></i></label>
              <textarea className="form__textarea" type="text" id="channelDesc" ref="channelDesc" placeholder="Кратко опишите"></textarea>
            </div>
            <div className="form__row userlist">
              {this.props.userlist.length > 0 &&(<div>
                <input type="checkbox" className="userlist__checkbox" id="privateChannel" onClick={this.handleSetPrivate}/>
                <label htmlFor="privateChannel">Приватный канал</label>
                <UserList userlist={this.props.userlist}/>
              </div>)}
            </div>
            <button className="btn" type="submit">Добавить</button>
            <span> </span>
            <button className="btn" onClick={this.handleCloseModal} type="button">Закрыть</button>
          </form>
        </div>
      );
    }
  });

  return ChannelsList
};

module.exports = ChannelComponent;

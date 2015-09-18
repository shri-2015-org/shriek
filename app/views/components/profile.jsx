var ProfileComponent = function(socket) {

  var ProfileBlock = React.createClass({

    getInitialState: function () {
      return {
        image: 'http://cs540109.vk.me/c7005/v7005764/55da/NuoVVyzCGGs.jpg'
      };
    },

    componentDidMount: function () {
      var that = this;

      socket.on('user info', function (data) {
        if (data.status === 'ok') {
          that.setState({image: data.user.setting.image});
        }
      });
    },

    handleSettingOpen: function (e) {
      window.dispatchEvent(new Event('openSetting'));
    },

    render: function() {
      return (
        <div className='profile'>
          <div className="profile__out"><i className="fa fa-power-off fa-lg"></i></div>
          <div className="profile__tools" onClick={this.handleSettingOpen}><i className="fa fa-cog fa-lg"></i></div>
          <div className="profile__img">
            <img src={this.state.image}/>
          </div>
        </div>
      );
    }

  });

  return ProfileBlock;

};

module.exports = ProfileComponent;

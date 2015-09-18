var SettingComponent = function(socket) {

  var SettingBlock = React.createClass({

    componentDidMount: function() {
      var that = this;
      var username;
      var overlaySetting = React.findDOMNode(this.refs.overlaySetting);

      window.addEventListener('openSetting', function () {
        $(overlaySetting).css('visibility', 'visible');
      });

      socket.on('user info', function (data) {
        if (data.status === 'ok') {
          that.setState({
            image: data.user.setting.image,
            email: data.user.setting.email
          })
        }
      });

      socket.on('user update', function (data) {
        if (data.status == 'ok') {
          socket.emit('user info', {username: data.user.username});
        }
      });
    },

    handleEmailChange: function(e) {
      this.setState({email: e.target.value});
    },

    handleImageChange: function(e) {
      this.setState({image: e.target.value});
    },

    handleSave: function(e) {
      if (this.state != null && (this.state.email || this.state.image)) {
        socket.emit('user update', {
          username: socket.username,
          setting: {
            email: this.state.email,
            image: this.state.image
          }
        });
      }

      return false;
    },

    handleClose: function(e) {
      var overlaySetting = React.findDOMNode(this.refs.overlaySetting);

      $(overlaySetting).attr('style', '');
    },

    render: function() {
      var formSetting;

      formSetting = (
        <form className="auth" onSubmit={this.handleSave}>
          <div className="auth__row">
            <label className="auth__label" htmlFor="inputEmail"><i className="fa fa-envelope-o"></i></label>
            <input className="auth__text" onChange={this.handleEmailChange} type="email" id="inputEmail" placeholder="Email" value={this.state.email} />
          </div>
          <div className="auth__row">
            <label className="auth__label" htmlFor="inputImage"><i className="fa fa-picture-o"></i></label>
            <input className="auth__text" onChange={this.handleImageChange} type="url" id="inputImage" placeholder="Url of Image" value={this.state.image} />
          </div>
          <button className="auth__sbmt" onClick={this.handleSave} type="submit">Update</button>
          <span> </span>
          <button className="auth__sbmt" onClick={this.handleClose} type="button">Close</button>
        </form>
      );

      return (
        <div className="overflow" ref="overlaySetting">
          {formSetting}
        </div>
      );
    }

  });

  return SettingBlock;

};

module.exports = SettingComponent;

var SettingComponent = function(socket) {

  var SettingBlock = React.createClass({

    getInitialState: function() {
      return {
        email: '',
        image: '',
        opened: false
      };
    },

    componentDidMount: function() {
      var that = this;
      var username;

      window.addEventListener('openSetting', function () {
        that.setState({opened: true});
      });

      socket.on('user info', function (data) {
        if (data.status === 'ok') {
          that.setState({
            email: data.user.setting.email,
            image: data.user.setting.image
          });
        }
      });

      socket.on('user update', function (data) {
        if (data.status == 'ok') {
          socket.emit('user info', {username: data.user.username});
          that.handleClose();
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
      e.preventDefault();

      if (this.state != null) {
        console.log(this.state);

        socket.emit('user update', {
          username: socket.username,
          setting: {
            email: this.state.email,
            image: this.state.image
          }
        });
      }
    },

    handleClose: function(e) {
      this.setState({opened: false});
    },

    render: function() {
      var formSetting;

      formSetting = (
        <form className="form modal__body" onSubmit={this.handleSave}>
          <div className="form__row">
            <label className="form__label" htmlFor="inputEmail"><i className="fa fa-envelope-o"></i></label>
            <input className="form__text" onChange={this.handleEmailChange} type="email" id="inputEmail" placeholder="Email" value={this.state.email} />
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="inputImage"><i className="fa fa-picture-o"></i></label>
            <input className="form__text" onChange={this.handleImageChange} type="url" id="inputImage" placeholder="Url of Image" value={this.state.image} />
          </div>
          <button className="btn" onClick={this.handleSave} type="submit">Update</button>
          <span> </span>
          <button className="btn" onClick={this.handleClose} type="button">Close</button>
        </form>
      );

      return (
        <div>
          {this.state.opened == true && (
            <div className="overflow" ref="overlaySetting">
                {formSetting}
            </div>
          )}
        </div>
      );
    }

  });

  return SettingBlock;
};

module.exports = SettingComponent;

var SettingComponent = function (socket) {

  var SettingBlock = React.createClass({

    getInitialState: function () {
      return {
        email: '',
        image: '',
        first_name: '',
        last_name: '',
        sex: '',
        description: '',
        opened: false
      };
    },

    componentDidMount: function () {
      var _this = this;
      var username;

      window.addEventListener('openSetting', function () {
        _this.setState({opened: true});
      });

      socket.on('user info', function (data) {
        if (data.status === 'ok') {
          _this.setState({
            email: data.user.setting.email,
            image: data.user.setting.image,
            first_name: data.user.setting.first_name,
            last_name: data.user.setting.last_name,
            description: data.user.setting.description,
            sex: data.user.setting.sex
          });
        }
      });

      socket.on('user update', function (data) {
        if (data.status == 'ok') {
          socket.emit('user info', {username: data.user.username});
          _this.handleClose();
        }
      });
    },

    handleEmailChange: function (e) {
      this.setState({email: e.target.value});
    },

    handleImageChange: function (e) {
      this.setState({image: e.target.value});
    },

    handleFirstNameChange: function (e) {
      this.setState({first_name: e.target.value});
    },

    handleLastNameChange: function (e) {
      this.setState({last_name: e.target.value});
    },

    handleSexChange: function (e) {
      this.setState({sex: e.target.value});
    },

    handleDescriptionChange: function (e) {
      this.setState({description: e.target.value});
    },

    handleSave: function (e) {
      e.preventDefault();

      if (this.state != null) {
        console.log(this.state);
        socket.emit('user update', {
          username: socket.username,
          setting: {
            email: this.state.email,
            image: this.state.image,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            description: this.state.description,
            sex: this.state.sex
          }
        });
      }
    },

    handleClose: function (e) {
      this.setState({opened: false});
    },

    render: function () {
      var formSetting;

      formSetting = (
        <form className="form modal__body setting" onSubmit={this.handleSave}>
          <div className="form__row">
            <label className="form__label" htmlFor="inputFirstName"><i className="fa fa-edit"></i></label>
            <input className="form__text" onChange={this.handleFirstNameChange} type="text" id="inputFirstName" placeholder="First name" value={this.state.first_name} />
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="inputLastName"><i className="fa fa-edit"></i></label>
            <input className="form__text" onChange={this.handleLastNameChange} type="text" id="inputLastName" placeholder="Last name" value={this.state.last_name} />
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="inputEmail"><i className="fa fa-envelope-o"></i></label>
            <input className="form__text" onChange={this.handleEmailChange} type="email" id="inputEmail" placeholder="Email" value={this.state.email} />
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="inputImage"><i className="fa fa-picture-o"></i></label>
            <input className="form__text" onChange={this.handleImageChange} type="url" id="inputImage" placeholder="Url of Image" value={this.state.image} />
          </div>
          <div className="form__row form__row-radio">
            <span className="form__label"><i className="fa fa-venus-mars"></i></span>
            <input className="form__radio" name="sex" onChange={this.handleSexChange} type="radio" id="inputSexMale" value="male" defaultChecked={this.state.sex === 'male'} />
            <label htmlFor="inputSexMale" className="btn">
              <i className="fa fa-mars"></i>
            </label>
            <input className="form__radio" name="sex" onChange={this.handleSexChange} type="radio" id="inputSexFemale" value="female" defaultChecked={this.state.sex === 'female'} />
            <label htmlFor="inputSexFemale" className="btn">
              <i className="fa fa-venus"></i>
            </label>
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="inputDescription"><i className="fa fa-edit"></i></label>
            <textarea className="form__textarea" onChange={this.handleDescriptionChange} id="inputDescription" placeholder="Description" value={this.state.description} />
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

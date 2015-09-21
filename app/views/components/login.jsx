var LoginComponent = function(socket) {

// LOGIN ERROR MODULE
var LoginError = require('../../views/components/login-error.jsx')(socket);


// askLogin component
  var AskLogin = React.createClass({

    getInitialState: function() {
      var state = Boolean(sessionStorage.key(0));

      return {
        logged: state,
        userInit: true,
        passInit: true,
        userInvalid: false,
        passInvalid: false,
        error: false
      };
    },

    componentDidMount: function() {
      var username;
      var storage = sessionStorage.key(0);
      var _this = this;

      if (storage != null) {
        socket.emit('user enter', {
          username: storage,
          password: sessionStorage.getItem(storage)
        });
      }

      window.addEventListener('userLeave', function () {
        _this.setState({logged: false});
      });

      socket.on('user enter', function(data) {
        if (data.status == 'ok') {
          _this.setState({
            logged: true
          });

          socket.username = username;

          socket.emit('user list');
          socket.emit('channel list');

          // Load info about current user
          socket.emit('user info', {username: socket.username});
          sessionStorage.setItem(data.user.username,data.user.hashedPassword);
        } else {
          console.log(data);
          _this.setState({error: data.error_message});
        }
      });
    },

    handleNameChange: function(e) {
      this.setState({name: e.target.value});
      this.setState({userInit: false});
      if (!e.target.value.length) {
        this.setState({userInvalid: true})
      } else {
        this.setState({userInvalid: false});
      }
    },

    handlePasswordChange: function(e) {
      this.setState({password: e.target.value});
      this.setState({passInit: false});
      if (!e.target.value.length) {
        this.setState({passInvalid: true})
      } else {
        this.setState({passInvalid: false});
      }
    },

    handleLogin: function(e) {
      e.preventDefault();
      if (this.state != null ) {
        if (!this.state.userInit && !this.state.passInit) {
          if (!this.state.passInvalid && !this.state.userInvalid) {
            socket.emit('user enter', {username: this.state.name, password: this.state.password})
          }
        } else if(this.state.userInit && this.state.passInit) {
          this.setState({userInvalid: true});
          this.setState({passInvalid: true});
        } else if(this.state.passInit) {
          this.setState({passInvalid: true});
        } else {
          this.setState({userInvalid: true});
        }
      }
    },

    render: function() {
      var cx = require('classnames');
      var classesUser = cx({
        'form__text': true,
        'invalid': this.state.userInvalid
      });
      var classesPassword = cx({
        'form__text': true,
        'invalid': this.state.passInvalid
      });
      return (
        <div>
          {this.state.logged == false && (
            <div className="modal login__box">
              <form className="form modal__body" onSubmit={this.handleLogin}>
                <h2>Sign in</h2>
                <div className="form__row">
                  {this.state.error && (
                    <LoginError error={this.state.error} />
                  )}
                </div>
                <div className="form__row">
                  <label className="form__label" htmlFor="inputUsername"><i className="fa fa-user"></i></label>
                  <input className={classesUser} onChange={this.handleNameChange} type="username" id="inputUsername" placeholder="Username"/>
                </div>
                <div className="form__row">
                  <label className="form__label" htmlFor="inputPassword"><i className="fa fa-asterisk"></i></label>
                  <input className={classesPassword} onChange={this.handlePasswordChange} type="password"id="inputPassword" placeholder="Password"/>
                </div>
                <button className="btn" type="submit">Sign in</button>
              </form>
            </div>
          )}
        </div>
      );
    }
  });

  return AskLogin;
};

module.exports = LoginComponent;

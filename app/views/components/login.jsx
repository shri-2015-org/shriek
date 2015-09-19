var LoginComponent = function(socket) {

// askLogin component
  var AskLogin = React.createClass({

    getInitialState: function() {
      var state;
      sessionStorage.key(0) ? state = true : state = false

      return {
        logged: state
      };
    },

    componentDidMount: function() {
      var username;
      var storage = sessionStorage.key(0);
      var component = this;

      if (storage != null) {
        socket.emit('user enter', {
          username: storage,
          password: sessionStorage.getItem(storage)
        }, this.state);
      }

      socket.on('user enter', function(data) {
        if (data.status == 'ok') {
          socket.emit('user list');

          component.setState({
            logged: true
          });

          // Load info about current user
          socket.emit('user info', {username: socket.username});

          sessionStorage.setItem(data.user.username,data.user.hashedPassword);
        }
      });
    },

    handleNameChange: function(e) {
      this.setState({name: e.target.value});
    },

    handlePasswordChange: function(e) {
      this.setState({password: e.target.value});
    },

    handleLogin: function(e) {
      e.preventDefault();

      if (this.state != null && this.state.name && this.state.password) {
        socket.emit('user enter', {username: this.state.name, password: this.state.password});
      }
    },

    render: function() {
      return (
        <div>
          {this.state.logged == false && (
            <div className="modal">
              <form className="form modal__body" onSubmit={this.handleLogin}>
                <div className="form__row">
                  <label className="form__label" htmlFor="inputUsername"><i className="fa fa-user"></i></label>
                  <input className="form__text" onChange={this.handleNameChange} type="username" id="inputUsername" placeholder="Username"/>
                </div>
                <div className="form__row">
                  <label className="form__label" htmlFor="inputPassword"><i className="fa fa-asterisk"></i></label>
                  <input className="form__text" onChange={this.handlePasswordChange} type="password"id="inputPassword" placeholder="Password"/>
                </div>
                <button className="btn" onClick={this.handleLogin} type="submit">Sign in</button>
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

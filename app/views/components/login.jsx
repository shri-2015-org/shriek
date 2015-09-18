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
        socket.emit('user enter', {username: storage, password: sessionStorage.getItem(storage)},this.state);
      }

      socket.on('user enter', function(data) {
        if (data.status == 'ok') {
          socket.username = username;
          socket.emit('user list');

          component.setState({
            logged: true
          });

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
            <div className="overflow">
              <form className="auth" onSubmit={this.handleLogin}>
                <div className="auth__row">
                  <label className="auth__label" htmlFor="inputUsername"><i className="fa fa-user"></i></label>
                  <input className="auth__text" onChange={this.handleNameChange} type="username" id="inputUsername" placeholder="Username"/>
                </div>
                <div className="auth__row">
                  <label className="auth__label" htmlFor="inputPassword"><i className="fa fa-asterisk"></i></label>
                  <input className="auth__text" onChange={this.handlePasswordChange} type="password"id="inputPassword" placeholder="Password"/>
                </div>
                <button className="auth__sbmt" onClick={this.handleLogin} type="submit">Sign in</button>
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

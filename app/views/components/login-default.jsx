var LoginDefault = function (socket) {

// askLogin component
  var LoginDefault = React.createClass({

    render: function () {
      return (
        <div>
          <h2>Sign in</h2>
          <div className="form__row">
            <label className="form__label" htmlFor="inputUsername"><i className="fa fa-user"></i></label>
            <input className={this.props.classUser} onChange={this.props.handleName} type="username" id="inputUsername" placeholder="Username"/>
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="inputPassword"><i className="fa fa-asterisk"></i></label>
            <input className={this.props.classPass} onChange={this.props.handlePassword} type="password"id="inputPassword" placeholder="Password"/>
          </div>
          <button className="btn" type="submit">Sign in</button>
          <div className="form__row">
            or login through these:
          </div>
          <div className="form__row">
            <a href="/auth/twitter"><i className="fa fa-twitter-square"></i></a>
            <a href="/auth/google"><i className="fa fa-google-plus-square"></i></a>
            <a href="/auth/github"><i className="fa fa-github-square"></i></a>
          </div>
        </div>
      );

    }
  });

  return LoginDefault;
};

module.exports = LoginDefault;

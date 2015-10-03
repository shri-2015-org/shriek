var LoginPassport = function (socket) {

// askLogin component
  var LoginPassport = React.createClass({

    render: function () {
      return (
        <div>
          <h2>Please, specify your password</h2>
          <div className="form__row">
            <label className="form__label" htmlFor="inputPassword"><i className="fa fa-asterisk"></i></label>
            <input className={this.props.classPass} onChange={this.props.handlePassword} type="password"id="inputPassword" placeholder="Password"/>
          </div>
          <button className="btn" type="submit">Sign in</button>
        </div>
      );

    }
  });

  return LoginPassport;
};

module.exports = LoginPassport;

var LoginError = function(socket) {

// askLogin component
  var LoginError = React.createClass({

    componentDidMount: function() {
    },


    render: function() {
      return (
        <div className="login__error">
          {this.props.error}
        </div>
      );
    }
  });

  return LoginError;
};

module.exports = LoginError;

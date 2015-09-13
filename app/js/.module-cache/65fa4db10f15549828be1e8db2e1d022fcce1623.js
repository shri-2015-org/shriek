var app = app || {};

(function () {
  'use strict';

  var TodoApp = React.createClass({displayName: "TodoApp",

      render: function () {
      var footer;
      var main;

        main = (
          React.createElement("section", {className: "main"}
          )
        );

      return (
        React.createElement("div", null, 
          main
        )
      );
    }
  });



  function render() {
    React.render(
      React.createElement(TodoApp, null),
      document.getElementsByClassName('todoapp')[0]
    );
  }

  render();

})();

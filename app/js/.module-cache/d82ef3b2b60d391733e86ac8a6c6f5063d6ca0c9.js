var app = app || {};

(function () {
  'use strict';

  var TodoApp = React.createClass({displayName: "TodoApp",

      render: function () {
      var footer;
      var main;

        main = (
          React.createElement("section", {className: "main"}, 
            React.createElement("div", {className: "left_part"}, 
              left_panel
            ), 
            React.createElement("div", {className: "right_part"}, 
              chat_div, 
              sendform
            )
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

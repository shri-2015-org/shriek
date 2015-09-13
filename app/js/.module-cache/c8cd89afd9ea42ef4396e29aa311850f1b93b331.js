var app = app || {};

(function () {
  'use strict';

  var TodoApp = React.createClass({displayName: "TodoApp",

      render: function () {
      var footer;
      var main;
      var left_panel;
      var chat_div;
      var sendform;

        left_panel = (
          React.createElement("div", {className: "left_panel"})
        );
        chat_div = (
          React.createElement("div", {className: "chat_div"})
        );
        send_form = (
          React.createElement("div", {className: "send_form"})
        );

        main = (
          React.createElement("section", {className: "main"}, 
            React.createElement("div", {className: "left_part"}, 
              left_panel
            ), 
            React.createElement("div", {className: "right_part"}, 
              chat_div, 
              send_form
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

var app = app || {};

(function () {
  'use strict';

  var TodoApp = React.createClass({

      render: function () {
      var footer;
      var main;
      // var todos = this.props.model.todos;

      // var shownTodos = todos.filter(function (todo) {
      //   switch (this.state.nowShowing) {
      //   case app.ACTIVE_TODOS:
      //     return !todo.completed;
      //   case app.COMPLETED_TODOS:
      //     return todo.completed;
      //   default:
      //     return true;
      //   }
      // }, this);

      // var todoItems = shownTodos.map(function (todo) {
      //   return (
      //     <TodoItem
      //       key={todo.id}
      //       todo={todo}
      //       onToggle={this.toggle.bind(this, todo)}
      //       onDestroy={this.destroy.bind(this, todo)}
      //       onEdit={this.edit.bind(this, todo)}
      //       editing={this.state.editing === todo.id}
      //       onSave={this.save.bind(this, todo)}
      //       onCancel={this.cancel}
      //     />
      //   );
      // }, this);

      // var activeTodoCount = todos.reduce(function (accum, todo) {
      //   return todo.completed ? accum : accum + 1;
      // }, 0);

      // var completedCount = todos.length - activeTodoCount;

      // if (activeTodoCount || completedCount) {
        // footer =
          // <TodoFooter
      //       count={activeTodoCount}
      //       completedCount={completedCount}
      //       nowShowing={this.state.nowShowing}
      //       onClearCompleted={this.clearCompleted}
          // />;
      // }

      // if (todos.length) {
        main = (
          <section className="main">
      //       <input
      //         className="toggle-all"
      //         type="checkbox"
      //         onChange={this.toggleAll}
      //         checked={activeTodoCount === 0}
      //       />
      //       <ul className="todo-list">
      //         {todoItems}
      //       </ul>
          </section>
        );
      // }

      return (
        <div>
          <header className="header">
            <h1>todos</h1>
            <input
              ref="newField"
              className="new-todo"
              placeholder="What needs to be done?"
              onKeyDown={this.handleNewTodoKeyDown}
              autoFocus={true}
            />
          </header>
          {main}
          // {footer}
        </div>
      );
    }
  });

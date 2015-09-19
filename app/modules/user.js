var UserModel = require('../models/user');

var userModule = function(socket) {

  /**
   * Регистрация или вход пользователя
   * @param  data
   * @param  data.username никнейм пользователя
   * @param  data.password пароль пользователя
   */
  socket.on('user enter', function (data) {
    if (socket.username !== undefined) {
      return socket.emit('user enter', {
        status: 'error',
        error_message: 'Пользователь уже вошел.'
      });
    } else if (!data.username || !data.password) {
      return socket.emit('user enter', {
        status: 'error',
        error_message: 'Empty fields'
      });
    }

    var username = data.username;
    var password = data.password;
    var out = {};

    UserModel.findOne({username: username}, function (err, doc) {
      if (!err && doc) {
        if (doc.checkPassword(password)) {
          out.status = 'ok';
          out.user = doc;
        } else if (doc.checkHashedPassword(password)) {
          out.status = 'ok';
          out.user = doc;
        } else {
          out.status = 'error';
          out.error_message = 'Неверный пароль';
        }
        callbackUserEnter(out);
      } else {
        var newUser = new UserModel({
            username: username
        });
        newUser.set('password', password);

        newUser.save(function (err, saved_data) {
          var message = err;
          if (!err) {
            out.status = 'ok';
            out.user = saved_data;
          } else {
            out.status = 'error';
            if (err.errors.user && err.errors.password) {
              // Validation failed
              out.error_message = 'not enough symbols';
            } else if (err.errors.user) {
              out.error_message = err.errors.user.message;
            } else if (err.errors.password) {
              out.error_message = err.errors.password.message;
            } else {
              out.error_message = 'Пользователь не найден';
            }
          }
          callbackUserEnter(out);
        });
      }
    });

    function callbackUserEnter(out) {
      if (out.status == 'ok') {
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user connected', out);
        // we store the username in the socket session for this client
        socket.username = username;
      }
      socket.emit('user enter', out);
    }
  });

  /**
   * Выход пользователя
   * @param  data
   */
  socket.on('user leave', function (data) {
    var out = {};
    if (socket.username === undefined) {
      out.status = 'error';
      out.error_message = 'Пользователь еще не вошел';
    } else {
      var username = socket.username;

      socket.username = undefined;
      socket.typing = undefined;

      out.status = 'ok';
      out.user = {
        username: username
      };
    }

    if (out.status == 'ok') {
      socket.broadcast.emit('user disconnected', out);
    }
    socket.emit('user leave', out);
  });

  /**
   * Получение информации о пользователе
   * @param data
   * @param data.username Никнейм пользователя
   */
  socket.on('user info', function (data) {
    var out = {};

    if (socket.username === undefined) {
      out.status = 'error';
      out.error_message = 'Пользователь должен войти';
      return socket.emit('user info', out);
    }

    var username = data.username || socket.username;
    UserModel.findOne({username: username}, function (err, doc) {
      if (!err && doc) {
        out.status = 'ok';
        out.user = doc;
      } else {
        out.status = 'error';
        out.error_message = 'Пользователь не найден';
      }
      socket.emit('user info', out);
    });
  });

  /**
   * Список пользователей
   * @param  data
   */
  socket.on('user list', function (data) {
    var out = {};

    if (socket.username === undefined) {
      return socket.emit('user list', {
        status: 'error',
        error_message: 'Пользователь должен войти'
      });
    }

    UserModel.find({}, function (err, docs) {
      if (!err && docs) {
        out.status = 'ok';
        out.users= docs;
      } else {
        out.status= 'error';
        out.error_message = 'Пользователей не найдено';
      }
      socket.emit('user list', out);
    });
  });

  /**
   * Update user information
   * @param data
   * @param data.username Username
   * @param data.setting Object:
   *        email
   *        image
   */
  socket.on('user update', function (data) {
    var out = {};

    if (socket.username === undefined) {
      return socket.emit('user update', {
        status: 'error',
        error_message: 'Пользователь должен войти'
      });
    }

    UserModel.findOneAndUpdate(
      {username: socket.username},
      {setting: data.setting},
      function (err, user) {
        if (!err && user) {
          out.status = 'ok';
          out.user = user;
        } else {
          out.status = 'error';
          out.error_message = 'Пользователь не найден';
        }
        socket.emit('user update', out);
      }
    );

  });

  /**
   * when the client emits 'typing', we broadcast it to others
   * @param  data
   */
  socket.on('user start typing', function (data) {
    var out = {};

    if (socket.username === undefined) {
      out.status = 'error';
      out.error_message = 'Пользователь должен войти';
    } else if (socket.typing) {
      out.status = 'error';
      out.error_message = 'Пользователь уже печатает';
    } else {
      socket.typing = true;
      out.status = 'ok';
      out.user = {
        username: socket.username
      };
    }

    if (out.status == 'ok') {
      socket.broadcast.emit('user start typing', out);
    } else {
      socket.emit('user start typing', out);
    }
  });

  /**
   * when the client emits 'stop typing', we broadcast it to others
   * @param  data
   */
  socket.on('user stop typing', function (data) {
    var out = {};

    if (socket.typing === undefined && !socket.typing) {
      out.status = 'error';
      out.error_message = 'Пользователь должен начать печатать';
    } else {
      out.status = 'ok';
      out.user = {
        username: socket.username
      };
      socket.typing = false;
    }

    if (out.status == 'ok') {
      socket.broadcast.emit('user stop typing', out);
    } else {
      socket.emit('user stop typing', out);
    }
  });

}

module.exports = userModule;

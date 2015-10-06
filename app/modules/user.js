var UserModel = require('../models/user');

var UserModule = function (socket, io) {

  var getOnline = function (namespace) {
    var _namespace = io.of(namespace);

    if (!_namespace) {
      return [];
    }

    var connected = _namespace.connected;
    var online = [];

    for (var id in connected) {
      var userName = connected[id].username;

      if (userName !== undefined) {
        online.push(userName);
      }
    }

    return online;
  };

  /**
   * Регистрация или вход пользователя
   * @param  data
   * @param  data.username никнейм пользователя
   * @param  data.password пароль пользователя
   */
  socket.on('user enter', function (data) {
    var passportLogin = false;

    if (socket.username !== undefined) {
      return socket.emit('user enter', {
        status: 'error',
        error_message: 'Пользователь уже вошел.'
      });
    } else if (data.oAuth) {
      passportLogin = true;
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
        if (data.passposrtInit) {
          if (doc.checkPassport(password)) {
            out.status = 'ok';
            out.user = doc;
          }
        }

        // TODO: Это эпик. Необходим рефакторинг.
        if (passportLogin === true) {
          out.status = 'ok';
          out.user = doc;
        } else if (doc.checkPassword(password)) {
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
          if (err) {
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
          } else {
            out.status = 'ok';
            out.user = saved_data;
          }

          callbackUserEnter(out);
        });
      }
    });

    function callbackUserEnter(out) {
      delete out.user.salt;

      socket.emit('user enter', out);

      if (out.status === 'ok') {
        // echo globally (all clients) that a person has connected
        delete out.user.hashedPassword;
        socket.broadcast.emit('user connected', out);

        // we store the username in the socket session for this client
        socket.username = username;
      }
    }
  });

  /**
   * Выход пользователя
   */
  socket.on('user leave', function () {
    var out = {};

    if (socket.username === undefined) {
      console.log('user not logged yet');

      out = {
        status: 'error',
        error_message: 'Пользователь еще не вошел'
      };
    } else {
      console.log('loggin out');
      var username = socket.username;

      socket.username = undefined;
      socket.typing = undefined;

      out = {
        status: 'ok',
        user: {
          username: username
        }
      };

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
      out = {
        status: 'error',
        error_message: 'Пользователь должен войти'
      };

      return socket.emit('user info', out);
    }

    var username = data.username || socket.username;

    UserModel.findOne({
      username: username
    }, {salt: 0, hashedPassword: 0}, function (err, doc) {
      if (!err && doc) {
        out = {
          status: 'ok',
          user: doc
        };
      } else {
        out = {
          status: 'error',
          error_message: 'Пользователь не найден'
        };
      }

      socket.emit('user info', out);
    });
  });

  /**
   * Список пользователей
   */
  socket.on('user list', function () {
    if (socket.username === undefined) {
      return socket.emit('user list', {
        status: 'error',
        error_message: 'Пользователь должен войти'
      });
    }

    UserModel.find({
      username: {$ne: socket.username}
    }, {salt: 0, hashedPassword: 0}, function (err, docs) {
      var out = {};

      if (!err && docs) {
        var online = getOnline('/');

        docs = docs.map(function (user) {
          // Ловкое условие определения статуса пользователя
          var isOnline = online.indexOf(user.username) > -1;

          // Приводим user к нормальному объекту
          user = user.toObject();
          user.online = isOnline;

          return user;
        });

        out = {
          status: 'ok',
          users: docs
        };
      } else {
        out = {
          status: 'error',
          error_message: 'Пользователей не найдено'
        };
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
      {setting: data.setting})
      .select('-salt -hashedPassword')
      .exec(function (err, user) {
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
   */
  socket.on('user start typing', function () {
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

    if (out.status === 'ok') {
      socket.broadcast.emit('user start typing', out);
    } else {
      socket.emit('user start typing', out);
    }
  });

  /**
   * when the client emits 'stop typing', we broadcast it to others
   */
  socket.on('user stop typing', function () {
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

    if (out.status === 'ok') {
      socket.broadcast.emit('user stop typing', out);
    } else {
      socket.emit('user stop typing', out);
    }
  });
};

module.exports = UserModule;

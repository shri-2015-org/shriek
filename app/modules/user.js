var mongoose = require('../models/mongoose');
var UserModel = mongoose.UserModel;

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
    }

    var username = data.username;
    var password = data.password;

    // we store the username in the socket session for this client
    socket.username = username;

    var newUser = new UserModel({
        username: username
    });
    newUser.set('password', password);

    newUser.save({runValidators: true}, function (err, data) {
      var out = {};

      if (!err) {
        out.status = 'ok';
        out.user = data;

        // echo globally (all clients) that a person has connected
        if (out.status == 'ok') {
          socket.broadcast.emit('user enter', out);
        }
        socket.emit('user enter', out);
      } else {
        UserModel.findOne({username: socket.username}, function (err, doc) {
          if (!err) {
            if (doc.checkPassword(password)) {
              out.status = 'ok';
              out.user = doc;
            } else {
              out.status = 'error';
              out.error_message = 'Неверный пароль';
            }
          } else {
            out.status = 'error';
            out.error_message = 'Ошибка поиска пользователя'
          }

          // echo globally (all clients) that a person has connected
          if (out.status == 'ok') {
            socket.broadcast.emit('user connected', out);
          }
          socket.emit('user enter', out);
        });
      }
    });
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

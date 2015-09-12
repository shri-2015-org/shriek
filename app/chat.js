// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var config = require('./configs/config');
var port = config.get('port') || 3000;

var mongoose = require('./models/mongoose');
var UserModel = mongoose.UserModel;
var ChannelModel = mongoose.ChannelModel;
var MessageModel = mongoose.MessageModel;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;




  /** Слушаем сообщение с фронта
  * @param data
  * @param data.user string логин юзера
  * @param data.channel string канал в который пишем (не обязательное)
  * @param data.text string текст сообщения
  * @param data.type string не обязательное, по умолчанию text
  */

  socket.on('message send', function (data) {

    var newMessage = MessageModel({
      user: data.username,
      channel: ( data.channel !== undefined ? data.channel : 'general' ), // если канал не пришёл, пишем в general
      text: data.text,
      type: ( data.type !== undefined ? data.type : 'text' ) // если не пришёл тип, то думаем, что это текст
    });

    newMessage.save({runValidators: true}, function (err, data) {

      var out = {};
      if (!err) {
        out.status = 'ok';
        out.message = data; // здесь будет запись из БД со всеми полями (см схему)
      } else {
        out.status = 'error';
        out.error_message = 'Ошибка создания файла';
      }

      socket.broadcast.emit('message send', out);

    });

  });

  // when the client emits 'add user', this listens and executes
  // TODO:: check find or create
  socket.on('user create', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;

    var user = new UserModel({
        username: username
    });

    user.save({runValidators: true}, function (err, data) {
      if (!err) {
        console.info('user created');
      } else {
        console.error('User not saved', err, err.message, data);
      }
    });

    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

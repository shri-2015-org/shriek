// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var config = require('../configs/config');
var port = config.get('port') || 3000;

var mongoose = require('../models/mongoose');
var UserModel = mongoose.UserModel;
var ChannelModel = mongoose.ChannelModel;
var MessageModel = mongoose.MessageModel;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));
app.use('/components', express.static('app/components'));

// Chatroom

io.on('connection', function (socket) {

  require('../modules/user')(socket);
  require('../modules/message')(socket);
  require('../modules/channel')(socket);

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    socket.broadcast.emit('user leave', {
      status: 'ok',
      user: {
        username: socket.username
      }
    });
  });
});

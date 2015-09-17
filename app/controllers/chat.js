// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var config = require('../configs/config');
var port = config.get('port') || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);

  mongoose.connect(config.get('mongoose:uri'));
  var db = mongoose.connection;

  db.on('error', function (err) {
    console.error('Connection error:', err.message);
  });
  db.once('open', function callback () {
    console.info('Connected to DB!');
  });
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

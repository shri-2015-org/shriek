  var socket = io();

  function sendMessage() {
    var data = {
      username: 'testuser',
      channel: 'general',
      text: 'somext',
      type: 'text'
    };
    socket.emit('message send', data);
  }
  socket.on('message send', function(data){
    console.log(data);
  });

  function chatCreate() {
    var data = {
      name: 'Название чата',
    };
    socket.emit('chat create', message);
  }
  socket.on('chat create', function(data){
    console.log(data);
  });

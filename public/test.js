  var socket = io();

  function sendMessage(username, channel, text) {
    if (username == undefined) username = 'testuser';
    if (channel == undefined) channel = 'nazvanie_chata';
    if (text == undefined) text = 'sometext';
    var data = {
      username: username,
      channel: channel,
      text: text,
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
    socket.emit('chat create', data);
  }
  socket.on('chat create', function(data){
    console.log(data);
  });

  function chatInfo() {
    var data = {
      slug: 'nazvanie_chata',
    };
    socket.emit('chat info', data);
  }
  socket.on('chat info', function(data){
    console.log(data);
  });

  function chatList() {
    socket.emit('chat list');
  }
  socket.on('chat list', function(data){
    console.log(data);
  });

  function chatGet(channel) {
    if (channel == undefined) channel = 'nazvanie_chata';
    requestdate = new Date();
    // min5ago = new Date();
    // requestdate.setMinutes(min5ago.getMinutes()-5);
    var data = {
      channel: channel,
      date: requestdate,
      limit: 5,
      skip: 0
    };
    socket.emit('chat get', data);
  }
  socket.on('chat get', function(data){
    console.log(data);
  });

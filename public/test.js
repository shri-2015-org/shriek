  var socket = io();

  function sendMessage(username, channel, text) {
    if (username == undefined) username = 'testuser';
    if (channel == undefined) channel = 'nazvanie_channela';
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

  function channelCreate() {
    var data = {
      name: 'Название чата',
    };
    socket.emit('channel create', data);
  }
  socket.on('channel create', function(data){
    console.log(data);
  });

  function channelInfo() {
    var data = {
      slug: 'nazvanie_channela',
    };
    socket.emit('channel info', data);
  }
  socket.on('channel info', function(data){
    console.log(data);
  });

  function channelList() {
    socket.emit('channel list');
  }
  socket.on('channel list', function(data){
    console.log(data);
  });

  function channelGet(channel) {
    if (channel == undefined) channel = 'nazvanie_channela';
    requestdate = new Date();
    // min5ago = new Date();
    // requestdate.setMinutes(min5ago.getMinutes()-5);
    var data = {
      channel: channel,
      date: requestdate,
      limit: 5,
      skip: 0
    };
    socket.emit('channel get', data);
  }
  socket.on('channel get', function(data){
    console.log(data);
  });

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

function channelCreate(name) {
  if (name == undefined) name = 'Название чата';
  var data = {
    name: name
  };
  socket.emit('channel create', data);
}
socket.on('channel create', function(data){
  console.log(data);
});

function channelInfo() {
  var data = {
    slug: 'nazvanie_channela'
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

////////////////
// User tests //
////////////////

function userEnter(username, password) {
  username = username || 'testuser';
  password = password || 'testpass';
  var data = {
    username: username,
    password: password
  };
  socket.emit('user enter', data);
}
socket.on('user enter', function (data) {
  console.log('user enter', data);
});

function userLeave() {
  socket.emit('user leave');
}
socket.on('user leave', function (data) {
  console.log('user leave', data);
});

function userInfo(username) {
  username = username || 'testuser';
  var data = {
    username: username
  };
  socket.emit('user info', data);
}
socket.on('user info', function (data) {
  console.log('user info', data);
});

function userList() {
  socket.emit('user list');
}
socket.on('user list', function (data) {
  console.log('user list', data);
});

function userStartTyping() {
  socket.emit('user start typing');
}
socket.on('user start typing', function (data) {
  console.log('user start typing', data);
});

function userStopTyping() {
  socket.emit('user stop typing');
}
socket.on('user stop typing', function (data) {
  console.log('user stop typing', data);
});

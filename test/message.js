var config = require('../app/configs/config');
var port = config.get('port') || 3000;
var chai = require('chai');
var mocha = require('mocha');
var should = chai.should();
var io = require('socket.io-client');

describe('Message test', function () {

  var socket;
  var options = {
    transports: ['websocket'],
    'force new connection': true
  };

  var testuser = {
    username: 'testuser',
    password: 'testpass'
  };
  var testmsg = 'Echo';

  beforeEach(function (done) {
    socket = io.connect('http://localhost:' + port, options);

    socket.on('connect', function () {
      // console.log('Worked...');
      done();
    });

    socket.on('disconnect', function () {
      // console.log('Disconnected...');
    });
  });

  afterEach(function (done) {
    // Cleanup
    if (socket.connected) {
      // console.log('Disconnecting...');
      socket.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      // console.log('No connection to break...');
    }
    done();
  });

  it('Message sending', function (done) {

    socket.once('message send', function (data) {
      data.status.should.equal('ok');
      data.message.username.should.equal(testuser.username);
      data.message.text.should.equal(testmsg);

      socket.disconnect();
      done();
    });

    socket.once('user enter', function (data) {
      data.status.should.equal('ok');

      socket.emit('message send', {
        user: testuser.username,
        text: testmsg
      });
    });

    socket.emit('user enter', testuser);

  });

  it('Message sending without login', function (done) {

    socket.once('message send', function (data) {
      data.status.should.equal('error');

      socket.disconnect();
      done();
    });

    socket.emit('message send', {
      user: testuser.username,
      text: testmsg
    });

  });

});

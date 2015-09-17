var config = require('../app/configs/config');
var port = config.get('port') || 3000;
var chai = require('chai');
var mocha = require('mocha');
var should = chai.should();
var io = require('socket.io-client');

describe('Connection test', function () {

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

  it('Connection', function (done) {

    socket.connected.should.equal(true);

    socket.disconnect();
    done();

  });

  it('User entering', function (done) {

    socket.once('user enter', function (data) {
      data.status.should.equal('ok');
      data.user.username.should.equal(testuser.username);

      socket.disconnect();
      done();
    });

    socket.emit('user enter', testuser);

  });

  it('User not entering', function (done) {

    socket.once('user enter', function (data) {
      data.status.should.equal('error');

      socket.disconnect();
      done();
    });

    socket.emit('user enter', {
      username: '1',
      password: '1'
    });

  });

});

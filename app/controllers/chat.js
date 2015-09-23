// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var config = require('../configs/config');
var session = require('express-session')
var port = config.get('port') || 3000;

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;


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

//
var UserModel = require('../models/user');

// Routing
app.use(express.static('public'));
app.use('/components', express.static('app/components'));

app.use(session({
  genid: function(req) {
    // new Date getTime()
    return 'asda' // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new TwitterStrategy({
    consumerKey: 'HEt5IuGQPv4bj75wNTqyLux8x',
    consumerSecret: 'h3FVM0GryVVdIGx7qMU4WxBzOudreASS3MPJvEH1DBYkXBiETC',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function (token, tokenSecret, profile, done) {
    UserModel.findOne({
        'twitterId': profile.id
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            user = new UserModel({
                username: profile.username
                //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            return done(err, user);
        }
    });
}));

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

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

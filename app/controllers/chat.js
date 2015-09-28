// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var config = require('../configs/config');
var session = require('express-session');
var port = config.get('port') || 3000;

//passport
var configPs = require('./passport_configs.json');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github2').Strategy;


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
var psUser, psId;

// Routing
app.use(express.static('public'));
app.use('/components', express.static('app/components'));

app.use(session({
  genid: function(req) {
    var date = new Date(),
        uid = date.getTime();
    return ''+uid+'' // use UUIDs for session IDs
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


// passport: twitter
passport.use(new TwitterStrategy({
    consumerKey: configPs.twitter.key,
    consumerSecret: configPs.twitter.secret,
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function (token, tokenSecret, profile, done) {
    UserModel.findOne({
        'twitterId': profile.id
    }, function(err, user) {
        psId = profile.id;
        psUser = profile.username;
        if (err) {
            return done(err);
        }
        if (!user) {
            user = new UserModel({
                username: profile.username,
                twitterId: profile.id,
                setting: {
                  image: profile.photos[0].value
                }
            })
            user.set('password', profile.id);;
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            return done(err, user);
        }
    });
}));

// passport: google
passport.use(new GoogleStrategy({
    clientID: configPs.google.key,
    clientSecret: configPs.google.secret,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
    UserModel.findOne({
        'googleId': profile.id
    }, function(err, user) {
        psId = profile.id;
        psUser = profile.name.givenName;
        if (err) {
            return done(err);
        }
        if (!user) {
            user = new UserModel({
                username: profile.name.givenName,
                googleId: profile.id,
                setting: {
                  image: profile.photos[0].value
                }
            })
            user.set('password', profile.id);;
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            return done(err, user);
        }
    });
}));

// passport: github
passport.use(new GitHubStrategy({
    clientID: configPs.github.key,
    clientSecret: configPs.github.secret,
    callbackURL: 'http://localhost:3000/auth/github/callback'
}, function (accessToken, refreshToken, profile, done) {
    UserModel.findOne({
        'githubId': profile.id
    }, function(err, user) {
        psId = profile.id;
        psUser = profile.username;
        if (err) {
            return done(err);
        }
        if (!user) {
            user = new UserModel({
                username: profile.username,
                githubId: profile.id,
                setting: {
                  image: profile._json.avatar_url
                }
            })
            user.set('password', profile.id);;
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            return done(err, user);
        }
    });
}));


app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/failure'
}), function(req, res) {
    res.cookie('psUser', psUser, { maxAge: 10000, httpOnly: false});
    res.cookie('psId', psId, { maxAge: 10000, httpOnly: false});
    res.redirect('/');
  }
);

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failure'
}), function(req, res) {
    res.cookie('psUser', psUser, { maxAge: 10000, httpOnly: false});
    res.cookie('psId', psId, { maxAge: 10000, httpOnly: false});
    res.redirect('/');
  }
);

app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/failure'
}), function(req, res) {
    res.cookie('psUser', psUser, { maxAge: 10000, httpOnly: false});
    res.cookie('psId', psId, { maxAge: 10000, httpOnly: false});
    res.redirect('/');
  }
);

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

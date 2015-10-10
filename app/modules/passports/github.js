var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var configPs = require('../../configs/passport_configs.json');
var UserModel = require('../../models/user');

module.exports = function (app, domain) {
  var psUser;
  var firstTime = false;

  passport.use(new GitHubStrategy({
    clientID: configPs.github.key,
    clientSecret: configPs.github.secret,
    callbackURL: 'http://' + domain + '/auth/github/callback'
  }, function (accessToken, refreshToken, profile, done) {
    UserModel.findOne({
      username: profile.username
    }, function (err, user) {
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
        });
        firstTime = true;
        user.save(function (err) {
          if (err) {
          }
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }));

  app.get('/auth/github', passport.authenticate(
    'github',
    {scope: ['user:email']}
  ));

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/failure'
  }), function (req, res) {
    res.cookie('psUser', psUser, {maxAge: 10000, httpOnly: false});
    if (firstTime) {
      res.cookie('psInit', 'yes', {maxAge: 10000, httpOnly: false});
      firstTime = false;
    }
    res.redirect('/');
  });
};

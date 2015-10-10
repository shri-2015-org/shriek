var slugify = require('transliteration').slugify;
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configPs = require('../../configs/passport_configs.json');
var UserModel = require('../../models/user');

module.exports = function (app, domain) {
  var psUser;
  var firstTime = false;

  passport.use(new GoogleStrategy({
    clientID: configPs.google.key,
    clientSecret: configPs.google.secret,
    callbackURL: 'http://' + domain + '/auth/google/callback'
  }, function (accessToken, refreshToken, profile, done) {
    var slugName = slugify(profile.displayName, {lowercase: true, separator: '_'});
    UserModel.findOne({
      username: slugName
    }, function (err, user) {
      psUser = slugName;
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new UserModel({
          username: slugName,
          googleId: profile.id,
          setting: {
            image: profile.photos[0].value
          }
        });
        firstTime = true;
        user.save(function (err) {
          if (err) {
            console.log(err);
          }
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }));

  app.get('/auth/google', passport.authenticate(
    'google',
    {scope: 'https://www.googleapis.com/auth/plus.login'}
  ));

  app.get('/auth/google/callback', passport.authenticate('google', {
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

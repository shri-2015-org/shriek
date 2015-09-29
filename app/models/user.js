var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: false
  },
  salt: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  setting: {
    email: {
      type: String
    },
    image: {
      type: String,
      default: "http://media.steampowered.com/steamcommunity/public/images/avatars/78/78acf20c6efa57fcadad137ff7ababb6f8210305_full.jpg"
    }
  }
});

User.methods.encryptPassword = function(password) {
  return crypto.Hmac('sha1', this.salt).update(password).digest('hex');
};

User
  .virtual('userId')
  .get(function () {
    return this.id;
  });

User
  .virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.salt = crypto.randomBytes(32).toString('hex');
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._plainPassword;
  });

User.methods.checkPassport = function (password) {
  if(!this.hashedPassword) {
    this.set('password', password);
    this.save();
  };
};

User.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

User.methods.checkHashedPassword = function (hashedPassword) {
  return hashedPassword === this.hashedPassword;
};

User.path('username').validate(function (v) {
  return v.length > 4 && v.length < 30 && !/[^a-z_\w]+/i.test(v)
}, 'Никнейм не прошел валидацию');

User.path('hashedPassword').validate(function(v) {
  if (this._plainPassword) {
    if (this._plainPassword.length < 6) {
      this.invalidate('password', 'password must be at least 6 characters.');
    }
  }

  // if (this.isNew && !this._plainPassword) {
  //   this.invalidate('password', 'required');
  // }
}, null);

module.exports = mongoose.model('User', User);

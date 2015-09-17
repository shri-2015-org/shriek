var mongoose = require('mongoose');
var crypto =require('crypto');
var config = require('../configs/config');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
  console.error('Connection error:', err.message);
});
db.once('open', function callback () {
  console.info('Connected to DB!');
});

var Schema = mongoose.Schema;

var User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
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

User.methods.checkPassword = function(password) {
 return this.encryptPassword(password) === this.hashedPassword;
};

User.methods.checkHashedPassword = function(password) {
 return password === this.hashedPassword;
};

User.path('username').validate(function (v) {
  return v.length > 4 && v.length < 30 && !/[^a-z_\w]+/i.test(v)
}, 'Никнейм не прошел валидацию');

User.path('hashedPassword').validate(function(v) {
  if (this._plainPassword) {
    if (this._plainPassword.length < 6) {
      this.invalidate('password', 'must be at least 6 characters.');
    }
  }

  if (this.isNew && !this._plainPassword) {
    this.invalidate('password', 'required');
  }
}, null);

var Channel = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

var Message = new Schema({
  username: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  attachments: {}
});

var UserModel = mongoose.model('User', User);
var ChannelModel = mongoose.model('Channel', Channel);
var MessageModel = mongoose.model('Message', Message);

module.exports.UserModel = UserModel;
module.exports.ChannelModel = ChannelModel;
module.exports.MessageModel = MessageModel;

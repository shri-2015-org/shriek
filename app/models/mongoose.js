var mongoose = require('mongoose');
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
  password: {
    type: String
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
  user: {
    type: String
  },
  channel: {
    type: String
  },
  text: {
    type: String
  },
  type: {
    type: String
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

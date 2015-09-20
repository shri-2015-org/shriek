var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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

Channel.on('init', function (model) {
  var newChannel = model({
    name: 'General',
    slug: 'general'
  });

  newChannel.save(newChannel);
});

module.exports = mongoose.model('Channel', Channel);


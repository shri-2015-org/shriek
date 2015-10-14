var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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
  raw: {
    type: String
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

module.exports = mongoose.model('Message', Message);

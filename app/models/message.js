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

Message.set('toJSON', {
  virtuals: true
});

Message
  .virtual('date')
  .get(function () {
    var now = new Date();
    now.setHours(0, 0, 0, 0); // reset today to 00:00:00
    var date;

    if (this.created_at < now) {
      var day = this.created_at.getDate();
      var month = this.created_at.getMonth();
      date = ('0' + day).slice(-2) + '/' +
        ('0' + month).slice(-2) + '/' +
        this.created_at.getFullYear();
    } else {
      var hour = this.created_at.getHours();
      var minutes = this.created_at.getMinutes();
      date = ('0' + hour).slice(-2) + ':' + ('0' + minutes).slice(-2);
    }

    return date;
  });

module.exports = mongoose.model('Message', Message);

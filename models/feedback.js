'use strict';

const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  messageID: String,
  response: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Feedback', feedSchema);

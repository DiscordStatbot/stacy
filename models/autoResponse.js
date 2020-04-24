'use strict';

const mongoose = require('mongoose');

const autoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  question: String,
  response: String,
  autoStat: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('AutoResponse', autoSchema);

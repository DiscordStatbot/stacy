'use strict';

const mongoose = require('mongoose');

const timerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  userID: String,
  roleID: String,
  time: Number,
});

module.exports = mongoose.model('Timer', timerSchema);

'use strict';

const mongoose = require('mongoose');

const reactSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  emoji: String,
  roleID: String,
  messageID: String,
});

module.exports = mongoose.model('ReactRole', reactSchema);

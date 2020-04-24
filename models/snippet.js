'use strict';

const mongoose = require('mongoose');

const snipSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  trigger: String,
  response: String,
});

module.exports = mongoose.model('Snippet', snipSchema);

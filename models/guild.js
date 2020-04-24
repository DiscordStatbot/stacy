'use strict';

const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  ownerID: String,
  prefix: String,
  deskModule: {
    type: Boolean,
    default: true,
  },
  autoModule: {
    type: Boolean,
    default: true,
  },
  ticketModule: {
    type: Boolean,
    default: true,
  },
  roleModule: {
    type: Boolean,
    default: true,
  },
  loggingModule: {
    type: Boolean,
    default: true,
  },
  snipModule: {
    type: Boolean,
    default: true,
  },
  welcomeModule: {
    type: Boolean,
    default: true,
  },
  announceModule: {
    type: Boolean,
    default: true,
  },
  ticketCategory: String,
  ticketLog: String,
  modChannel: String,
  memberChannel: String,
  messageChannel: String,
  serverChannel: String,
  welcomeChannel: String,
  welcomeMessage: String,
  welcomeImage: String,
  welcomeColor: String,
  welcomeRole: String,
  welcomePing: Boolean,
  supportRole: String,
  adminRole: String,
  announceChannel: String,
  announceRole: String,
  announceToggle: Boolean,
  deskChan: {
    type: Number,
    default: 0,
  },
  autoNum: {
    type: Number,
    default: 0,
  },
  joinNum: {
    type: Number,
    default: 0,
  },
  snipNum: {
    type: Number,
    default: 0,
  },

});

module.exports = mongoose.model('Guild', guildSchema);

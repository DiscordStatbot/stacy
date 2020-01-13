const mongoose = require('mongoose');

const ignoreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  msgDelete: Array,
  msgUpdate: Array,
  responseExclude: Array,
  commandsDisable: Array,
  chanLog: {
    type: Boolean,
    default: true
  },
  roleLog: {
    type: Boolean,
    default: true
  },
  msgLog: {
    type: Boolean,
    default: true
  },
  modLog: {
    type: Boolean,
    default: true
  },
  memLog: {
    type: Boolean,
    default: true
  },

});

module.exports = mongoose.model('IgnoredSetting', ignoreSchema);
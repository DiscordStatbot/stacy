const mongoose = require('mongoose');

const deskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  deskChannel: String,
  deskMsgID: String,
  deskMsg: String,
  deskColor: String,
  defaultRole: String,
  supportChannel: String,
  roleMsg: String,
  deskNum: {
    type: Number,
    default: 0
  },
  qar:[{
    question: String,
    response: String,
    deskStat: {
      type: Number,
      default: 0
    }
  }]
});

module.exports = mongoose.model('HelpDesk', deskSchema);
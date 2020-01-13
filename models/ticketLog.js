const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  userID: String,
  createdAt: String,
  ticket: String,
  messages: String

});

module.exports = mongoose.model('TicketLog', ticketSchema);
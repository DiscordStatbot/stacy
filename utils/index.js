// Creates variables for DB models.

'use strict';

module.exports = {
  Guild: require('../models/guild'),
  HelpDesk: require('../models/helpDesk'),
  AutoResponse: require('../models/autoResponse'),
  ReactRole: require('../models/reactRole'),
  Snippet: require('../models/snippet'),
  Timer: require('../models/timer'),
  TicketLog: require('../models/ticketLog'),
  Ignore: require('../models/ignore'),
  Menu: require('./menu'),
  Feedback: require('../models/feedback'),
};

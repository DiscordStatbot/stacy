'use strict';

require('dotenv-flow').config();

module.exports = {
  errMsg: 'Uh oh! S-something went wrong?! If this persists please contact our support team. Type `s!support` to get the link.\n\n**Error Message:**',
  errPerm: 'You are not allowed to do that!\n\n**Error Message:**',
  token: process.env.TOKEN,
  owner: process.env.OWNER,
  guild: process.env.GUILD,
  prefix: 's!',
  red: '#fd9696',
  green: '#a4fd4b',
  yellow: '#fdfd64',
  blue: '#bae1ff',
  mongoURI: process.env.MONGO_URI,
  defaultSettings: {
    prefix: 's!',
    welcomePing: false,
  },
  perms: [
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'ATTACH_FILES',
    'EMBED_LINKS',
    'ADD_REACTIONS',
  ],
};

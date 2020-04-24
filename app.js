'use strict';

const { Client, Collection } = require('discord.js');
require('dotenv-flow').config();

const bot = new Client();
require('./utils/functions')(bot);
require('./utils/botsets')(bot);
bot.mongoose = require('./utils/mongoose');
bot.config = require('./config');

['aliases', 'commands'].forEach((x) => { bot[x] = new Collection(); });
/* eslint-disable-next-line import/no-dynamic-require */
['command', 'event'].forEach((x) => { require(`./handlers/${x}`)(bot); });

bot.mongoose.init();
process.on('unhandledRejection', (error) => console.error('Uncaught Promise Rejection', error));
bot.login(bot.config.token);

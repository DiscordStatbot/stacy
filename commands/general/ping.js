// Ping pong command.

'use strict';

module.exports = {
  config: {
    name: 'ping',
    usage: 'ping`',
    description: 'PONG! Displays the api & bot latency',
    accessableby: 'Members',
    category: 'general',
  },
  run: async (bot, message, args, settings) => {
    try {
      await message.channel.send('Pinging...').then(async (m) => {
        const ping = m.createdTimestamp - message.createdTimestamp;

        await m.edit(`My Latency: \`${ping}ms\`, Discord Latency: \`${Math.round(bot.ping)}ms\``);
      });
    } catch (error) {
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      } catch (error) {

      }
    }
  },
};

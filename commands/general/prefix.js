// Shows the bot prefix.

'use strict';

module.exports = {
  config: {
    name: 'prefix',
    usage: 'prefix`',
    description: 'Show the prefix for your server.',
    accessableby: 'Members',
    category: 'general',
  },
  run: async (bot, message, args, settings) => {
    try {
      await message.channel.send(`My prefix is \`${settings.prefix}\``);
    } catch (error) {
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      } catch (error) {

      }
    }
  },
};

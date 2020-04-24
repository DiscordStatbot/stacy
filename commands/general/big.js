// Makes emojis big.

'use strict';

const { RichEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'big',
    description: 'Make an emoji big! You can only use the emojis available to you.',
    usage: 'big <emoji>`',
    accessableby: 'Member',
    aliases: ['huge', 'emoji'],
    category: 'general',
  },
  run: async (bot, message, args, settings) => {
    try {
      const emj = args[0];
      const regex = /<(?<anim>a?):(?<name>[a-zA-Z0-9\W_]+?):(?<id>\d+?)>/g;
      const emojinfo = regex.exec(emj);

      if (!emojinfo) {
        return await message.reply('You can not use that emoji.');
      }

      const aembed = new RichEmbed()
        .setColor(bot.config.yellow)
        .setImage(`https://cdn.discordapp.com/emojis/${emojinfo.groups.id}.gif?v=1`);

      const nembed = new RichEmbed()
        .setColor(bot.config.yellow)
        .setImage(`https://cdn.discordapp.com/emojis/${emojinfo.groups.id}.png?v=1`);

      if (emj && args[1]) return await message.channel.send('Please use only one emoji.');
      if (emj && emojinfo.groups.anim) {
        await message.channel.send(aembed);
      } else if (emj && !emojinfo.groups.anim) {
        await message.channel.send(nembed);
      }
    } catch (error) {
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      } catch (error) {

      }
    }
  },
};

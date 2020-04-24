// Triggers the logging if it is setup.

'use strict';

const { RichEmbed, Attachment } = require('discord.js');

module.exports = async (bot, oldChannel, newChannel) => {
  try {
    if (oldChannel.name.startsWith('ticket-')) return;
    let settings;
    try {
      settings = await bot.getGuild(oldChannel.guild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!settings) return;
    if (!settings.loggingModule) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(oldChannel.guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!ignore) return;
    if (!ignore.chanLog) return;
    if (!settings.serverChannel) return;
    const slog = oldChannel.guild.channels.get(settings.serverChannel);

    const upvoice = new Attachment('./assets/upspeaker.png', 'upspeaker.png');
    const uptext = new Attachment('./assets/uptext.png', 'uptext.png');
    const upcategory = new Attachment('./assets/upcategory.png', 'upcategory.png');

    if (oldChannel.name !== newChannel.name && newChannel.type === 'text') {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.blue)
          .setTitle('Text channel Updated')
          .attachFile(uptext)
          .setThumbnail('attachment://uptext.png')
          .setDescription(`**Old Name:** \`${oldChannel.name}\`\n\n**New Name:** \`${newChannel.name}\``)
          .setFooter(`Channel logs of ${newChannel.guild.name}`, newChannel.guild.iconURL)
          .setTimestamp();

        await slog.send(embed);
      } catch (error) {
        return;
      }
    }
    if (oldChannel.name !== newChannel.name && newChannel.type === 'voice') {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.blue)
          .setTitle('Voice channel Updated')
          .attachFile(upvoice)
          .setThumbnail('attachment://upspeaker.png')
          .setDescription(`**Old Name:** \`${oldChannel.name}\`\n\n**New Name:** \`${newChannel.name}\``)
          .setFooter(`Channel logs of ${newChannel.guild.name}`, newChannel.guild.iconURL)
          .setTimestamp();

        await slog.send(embed);
      } catch (error) {
        return;
      }
    }
    if (oldChannel.name !== newChannel.name && newChannel.type === 'category') {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.blue)
          .setTitle('Category Updated')
          .attachFile(upcategory)
          .setThumbnail('attachment://upcategory.png')
          .setDescription(`**Old Name:** \`${oldChannel.name}\`\n\n**New Name:** \`${newChannel.name}\``)
          .setFooter(`Channel logs of ${newChannel.guild.name}`, newChannel.guild.iconURL)
          .setTimestamp();

        await slog.send(embed);
      } catch (error) {

      }
    }
  } catch (erro) {

  }
};

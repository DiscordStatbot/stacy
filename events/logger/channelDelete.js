// Triggers the logging if it is setup.

'use strict';

const { RichEmbed, Attachment } = require('discord.js');

module.exports = async (bot, channel) => {
  try {
    if (channel.name.startsWith('ticket-')) return;
    let settings;
    try {
      settings = await bot.getGuild(channel.guild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!settings) return;
    if (settings.loggingModule == false) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(channel.guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!ignore) return;
    if (ignore.chanLog == false) return;
    if (!settings.serverChannel) return;

    const slog = channel.guild.channels.get(settings.serverChannel);

    const delvoice = new Attachment('./assets/delspeaker.png', 'delspeaker.png');
    const deltext = new Attachment('./assets/deltext.png', 'deltext.png');
    const delcategory = new Attachment('./assets/delcategory.png', 'delcategory.png');

    if (channel.type == 'text') {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.red)
          .setTitle('Text channel Deleted')
          .attachFile(deltext)
          .setThumbnail('attachment://deltext.png')
          .setDescription(`**Name:** \`${channel.name}\`\n\n**ID:** \`${channel.id}\``)
          .setFooter(`Channel logs for ${channel.guild.name}`, channel.guild.iconURL)
          .setTimestamp();

        await slog.send(embed);
      } catch (error) {
        return;
      }
    }
    if (channel.type == 'voice') {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.red)
          .setTitle('Voice channel Deleted')
          .attachFile(delvoice)
          .setThumbnail('attachment://delspeaker.png')
          .setDescription(`**Name:** \`${channel.name}\`\n\n**ID:** \`${channel.id}\``)
          .setFooter(`Channel logs for ${channel.guild.name}`, channel.guild.iconURL)
          .setTimestamp();

        await slog.send(embed);
      } catch (error) {
        return;
      }
    }
    if (channel.type == 'category') {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.red)
          .setTitle('Category Deleted')
          .attachFile(delcategory)
          .setThumbnail('attachment://delcategory.png')
          .setDescription(`**Name:** \`${channel.name}\`\n\n**ID:** \`${channel.id}\``)
          .setFooter(`Channel logs for ${channel.guild.name}`, channel.guild.iconURL)
          .setTimestamp();

        await slog.send(embed);
      } catch (error) {

      }
    }
  } catch (erro) {

  }
};

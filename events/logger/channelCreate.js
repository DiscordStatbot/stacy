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

    const voice = new Attachment('./assets/speaker.png', 'speaker.png');
    const text = new Attachment('./assets/text.png', 'text.png');
    const category = new Attachment('./assets/category.png');

    if (channel.type == 'text') {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.green)
          .setTitle('Text channel Created')
          .attachFile(text)
          .setThumbnail('attachment://text.png')
          .setDescription(`**Name:** <#${channel.id}>\n\n**ID:** \`${channel.id}\``)
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
          .setColor(bot.config.green)
          .setTitle('Voice channel Created')
          .attachFile(voice)
          .setThumbnail('attachment://speaker.png')
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
          .setColor(bot.config.green)
          .setTitle('Category Created')
          .attachFile(category)
          .setThumbnail('attachment://category.png')
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

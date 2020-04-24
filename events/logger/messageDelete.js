// Triggers the logging if it is setup.

'use strict';

const { RichEmbed, Attachment } = require('discord.js');

module.exports = async (bot, message) => {
  try {
    let helpDoc;
    try {
      helpDoc = await bot.getDesk(message.channel);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (helpDoc) return;

    if (message.channel.name.startsWith('ticket-')) return;

    let settings;
    try {
      settings = await bot.getGuild(message.guild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!settings) return;
    if (!settings.loggingModule) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(message.guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!ignore) return;
    if (!ignore.msgLog || ignore.msgDelete.includes(message.channel.id)) return;

    if (!settings.messageChannel) return;
    if (message.author.bot || message.content.startsWith(settings.prefix)) return;

    const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then((audit) => audit.entries.first());

    let user = '';
    if (entry.extra.channel.id === message.channel.id
      && (entry.target.id === message.author.id)
      && (entry.createdTimestamp > (Date.now() - 5000))
      && (entry.extra.count >= 1)) {
      try {
        user = entry.executor.id;
      } catch (error) {
        return;
      }
    } else {
      try {
        user = message.author.id;
      } catch (error) {
        return;
      }
    }
    const mlog = message.guild.channels.get(settings.messageChannel);

    const msg = new Attachment('./assets/msg.png', 'msg.png');

    const embed = new RichEmbed()
      .setColor(bot.config.red)
      .setTitle('Message Deleted')
      .attachFile(msg)
      .setThumbnail('attachment://msg.png')
      .setDescription(`**Author:** <@${message.author.id}>\n\n**Deleted By:** <@${user}>\n\n**Channel:** <#${message.channel.id}>\n\n**Content:**\n${message.content || 'Attachment Deleted'}`)
      .setFooter(`Message logs for ${message.guild.name}`, message.guild.iconURL)
      .setTimestamp();

    await mlog.send(embed);
  } catch (erro) {

  }
};

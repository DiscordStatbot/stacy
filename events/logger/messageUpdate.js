// Triggers the logging if it is setup.

'use strict';

const { RichEmbed, Attachment } = require('discord.js');

module.exports = async (bot, oldMessage, newMessage) => {
  try {
    if (oldMessage.channel.name.startsWith('ticket-')) return;

    if (oldMessage.author.bot) return;
    let settings;
    try {
      settings = await bot.getGuild(oldMessage.guild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!settings) return;
    if (settings.loggingModule == false) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(oldMessage.guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!ignore) return;
    if (ignore.msgLog == false || ignore.msgDelete.includes(oldMessage.channel.id)) return;

    if (!settings.messageChannel) return;
    if (oldMessage.content.includes('http')) return;
    const mlog = oldMessage.guild.channels.get(settings.messageChannel);

    const upmsg = new Attachment('./assets/upmsg.png', 'upmsg.png');

    try {
      const embed = new RichEmbed()
        .setColor(bot.config.blue)
        .setTitle('Message Updated')
        .attachFile(upmsg)
        .setThumbnail('attachment://upmsg.png')
        .setDescription(`**Author:** <@${oldMessage.author.id}>\n\n**Channel:** <#${newMessage.channel.id}>\n\n**Old Content:** ${oldMessage.content}\n\n**New Content:** ${newMessage.content}`)
        .setFooter(`Message logs for ${newMessage.guild.name}`, newMessage.guild.iconURL)
        .setTimestamp();

      await mlog.send(embed);
    } catch (error) {

    }
  } catch (erro) {

  }
};

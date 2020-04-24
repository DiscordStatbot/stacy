// Triggers the welcomer if it is set up and the logging if it is setup.

'use strict';

const { RichEmbed } = require('discord.js');
const dateFormat = require('dateformat');
const ms = require('ms');

module.exports = async (bot, member) => {
  require('../../utils/responders/welcomer')(bot, member);

  try {
    let settings;
    try {
      settings = await bot.getGuild(member.guild);
    } catch (error) {
      return;
    }
    if (!settings.loggingModule) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(member.guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!ignore || !settings) return;
    if (!ignore.memLog) return;
    const mlogs = member.guild.channels.get(settings.memberChannel);

    if (member.user.bot) {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.green)
          .setTitle(`Member Count: ${member.guild.memberCount}`)
          .setThumbnail(member.user.displayAvatarURL)
          .setDescription(`Bot <@${member.user.id}> has joined the server.\n\n**User ID:** \`${member.user.id}\``)
          .setFooter(`Member logs of ${member.guild.name}`, member.guild.iconURL)
          .setTimestamp();

        await mlogs.send(embed);
      } catch (error) {

      }
    } else {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.green)
          .setTitle(`Member Count: ${member.guild.memberCount}`)
          .setThumbnail(member.user.displayAvatarURL)
          .setDescription(`<@${member.user.id}> has joined the server.\n\n**User ID:** \`${member.user.id}\``)
          .setFooter(`Member logs of ${member.guild.name}`, member.guild.iconURL)
          .setTimestamp();

        if (member.createdAt < ms('1d')) {
          embed.addField('Account Age', `${dateFormat(member.user.createdAt)}`);
          await mlogs.send(embed);
        } else {
          await mlogs.send(embed);
        }
      } catch (error) {

      }
    }
  } catch (error) {

  }
};

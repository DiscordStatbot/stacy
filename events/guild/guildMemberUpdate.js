// Triggers the logging if it is setup.

'use strict';

const { RichEmbed } = require('discord.js');

module.exports = async (bot, oldMember, newMember) => {
  try {
    if (oldMember.user.bot) return;
    let settings;
    try {
      settings = await bot.getGuild(oldMember.guild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!settings.loggingModule) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(oldMember.guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!ignore || !settings) return;
    if (!ignore.memLog) return;
    const mlog = oldMember.guild.channels.get(settings.memberChannel);

    const roles1 = oldMember._roles.filter((o) => newMember._roles.indexOf(o) === -1);
    const roles2 = newMember._roles.filter((o) => oldMember._roles.indexOf(o) === -1);

    const roles = roles1.concat(roles2);
    let rList;
    const rArr = [];
    for (let r = 0; r < roles.length; r++) {
      rArr.push(`<@&${roles[r]}>`);
      rList = rArr.join(' ');
    }
    if (oldMember._roles.length < newMember._roles.length) {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.green)
          .setTitle('Member updated')
          .setDescription(`<@${newMember.id}> was given ${rList} role.`)
          .setFooter(`Member logs of ${newMember.guild.name}`, newMember.guild.iconURL)
          .setTimestamp();

        await mlog.send(embed);
      } catch (error) {
        return;
      }
    }
    if (oldMember._roles.length > newMember._roles.length) {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.red)
          .setTitle('Member updated')
          .setThumbnail(newMember.user.displayAvatarURL)
          .setDescription(`<@${newMember.id}> left ${rList} role.`)
          .setFooter(`Member logs of ${newMember.guild.name}`, newMember.guild.iconURL)
          .setTimestamp();

        await mlog.send(embed);
      } catch (error) {

      }
    }
  } catch (error) {

  }
};

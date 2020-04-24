// Triggers the logging if it is setup.

'use strict';

const { RichEmbed, Attachment } = require('discord.js');

module.exports = async (bot, oldRole, newRole) => {
  try {
    let settings;
    try {
      settings = await bot.getGuild(oldRole.guild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!settings) return;
    if (!settings.loggingModule) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(oldRole.guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if (!ignore) return;
    if (!ignore.roleLog) return;

    if (!settings.serverChannel) return;

    const slog = oldRole.guild.channels.get(settings.serverChannel);

    const uprole = new Attachment('./assets/uprole.png', 'uprole.png');

    if (oldRole.name !== newRole.name) {
      try {
        const embed = new RichEmbed()
          .setColor(bot.config.blue)
          .setTitle('Role Updated')
          .attachFile(uprole)
          .setThumbnail('attachment://uprole.png')
          .setDescription(`**Old Name:** \`${oldRole.name}\`\n\n**New Name:** \`${newRole.name}\``)
          .setFooter(`Role logs of ${newRole.guild.name}`, newRole.guild.iconURL)
          .setTimestamp();

        await slog.send(embed);
      } catch (error) {
        return;
      }
    }

    let roleDoc;
    try {
      roleDoc = await bot.getJoin(oldRole);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }

    if (!roleDoc) return;

    if (roleDoc && roleDoc.roleName !== newRole.name && roleDoc.roleName === oldRole.name) {
      try {
        return await bot.updateJoin(oldRole, { roleName: newRole.name });
      } catch (error) {
        console.error(` [ERROR] ${error.stack}`);
      }
    }
  } catch (erro) {

  }
};

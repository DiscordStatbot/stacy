// Triggers when the Announcement Ping is set to on.

'use strict';

module.exports = async (bot, message, settings) => {
  if (!settings.announceModule) return;
  try {
    if (settings.announceChannel && settings.announceRole && settings.announceToggle) {
      if (message.channel.id === settings.announceChannel) {
        const role = message.guild.roles.get(settings.announceRole);
        const chan = message.guild.channels.get(settings.announceChannel);

        if (!role && !chan) return;

        if (!role.mentionable) {
          await role.edit({ mentionable: true }).then(async () => {
            await chan.send(`<@&${role.id}>`).then(async () => {
              await role.edit({ mentionable: false });
            });
          });
        } else {
          await chan.send(`<@&${role.id}>`);
        }
      }
    }
  } catch (error) {
    try {
      await message.author.send(`${bot.config.errMsg}\n${error.message}`);
    } catch (error) {

    }
  }
};

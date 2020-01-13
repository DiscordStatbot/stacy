// Triggers when the Announcement Ping is set to on.

module.exports = async (bot, message, settings) => {
  if(settings.announceModule == false) return;
  try{
    if(settings.announceChannel && settings.announceRole && settings.announceToggle == true) {
      if(message.channel.id == settings.announceChannel) {
        let role = message.guild.roles.get(settings.announceRole);
        let chan = message.guild.channels.get(settings.announceChannel);

        if(!role && !chan) return;

        if(role.mentionable == false) {
          await role.edit({mentionable: true}).then(async () => {
            await chan.send(`<@&${role.id}>`).then(async () => {
              await role.edit({mentionable: false});
            });
          });
        } else {
          await chan.send(`<@&${role.id}>`);
        }
      }
    }
  }catch(error){
    try {
      await message.author.send(`${bot.config.errMsg}\n${error.message}`);
    }catch(error) {
      return;
    }
  }
};
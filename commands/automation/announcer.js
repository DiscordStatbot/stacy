// Setup for the announcement ping system.

module.exports = { 
  config: {
    name: 'announcer',
    usage: 'announcer <option>`',
    options: '`channel` - The channel in which to announce ping.\n**Usage:** `announcer channel #channel`\n\n`role` - Set the role that will be pinged in the announcement channel.\n**Usage:** `announcer role @role`\n\n`toggle` - Toggle the announcement ping on and off.\n**Usage:** `announcer toggle`\n\n',
    description: 'Setup the Automated Announcement Ping system.',
    accessableby: 'Administrator',
    category: 'automation'
  },
  run: async (bot, message, args, settings) => {
    if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);
    try{
      let type = args[0];

      switch(type){
      case 'channel': {
        let chan = message.mentions.channels.first() || message.guild.channels.get(args[1]);

        if(chan) {
          await bot.updateGuild( message.guild, { announceChannel: chan.id, announceToggle: true } );
          return await message.channel.send(`Announcement channel has been set to: <#${chan.id}>`);
        }else {
          try {
            await bot.updateGuild( message.guild, { $unset: { announceChannel: ''} });
            return await message.channel.send('Announcement channel disabled.');
          }catch (error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'role': {
        let role = message.mentions.roles.first() || message.guild.roles.get(args[1]);

        if(role) {
          await bot.updateGuild( message.guild, { announceRole: role.id } );
          return await message.channel.send(`Announcement role has been set to: **${role.name}**`);
        }else {
          try {
            await bot.updateGuild( message.guild, { $unset: { announceRole: ''} });
            return await message.channel.send('Announcement role disabled.');
          }catch (error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'toggle': {
        if(settings.announceToggle == false) {
          await bot.updateGuild( message.guild, { announceToggle: true } );
          return await message.channel.send('Announcement ping set to: `on`');
        }else if(settings.announceToggle == true) {
          try {
            await bot.updateGuild( message.guild, { announceToggle: false } );
            return await message.channel.send('Announcement ping set to: `off`');
          }catch (error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else {
          return await message.channel.send(`Announcement ping is already set to: \`${settings.announceToggle}\``);
        }
        break;
      }
      }

    }catch(error){
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      }catch(error) {
        return;
      }
    }
  }
};
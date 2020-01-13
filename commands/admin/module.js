// Turning on and off parts of the bot, for example, completely disabling the help desk.

module.exports = { 
  config: {
    name: 'module',
    description: 'Turn modules on or off.',
    usage: 'module <option>`',
    options: '`announcer` - Disable or Enable Announcement system.\n`welcomer`- Disable or Enable the Welcomer.\n`desk` - Disable or Enable the Help Desk.\n`responder` - Disable or Enable the Auto Responder.\n`tickets` - Disable or Enable the Ticket system.\n`roles` - Disable or Enable the roles module.\n`logging` - Disable or Enable the logging system all together.\n`snippets` - Disable or Enable the snippets.',
    accessableby: 'Administrator',
    aliases: ['modules'],
    category: 'admin'
  },
  run: async (bot, message, args, settings, ignore) => {
    try{
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);
          
      let type = args[0];
      switch(type) {
      case 'desk': {
        if (settings.deskModule == true) {
          try {
            await bot.updateGuild(message.guild, { deskModule: false });
            return await message.channel.send('The Help Desk module is now disabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else if (settings.deskModule == false) {
          try {
            await bot.updateGuild(message.guild, { deskModule: true });
            return await message.channel.send('The Help Desk module is now enabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'responder': {
        if (settings.autoModule == true) {
          try {
            await bot.updateGuild(message.guild, { autoModule: false });
            return await message.channel.send('The Auto Responder module is now disabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else if (settings.autoModule == false) {
          try {
            await bot.updateGuild(message.guild, { autoModule: true });
            return await message.channel.send('The Auto Responder module is now enabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'tickets': {
        if (settings.ticketModule == true) {
          try {
            await bot.updateGuild(message.guild, { ticketModule: false });
            return await message.channel.send('The Ticket module is now disabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else if (settings.ticketModule == false) {
          try {
            await bot.updateGuild(message.guild, { ticketModule: true });
            return await message.channel.send('The Ticket module is now enabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'roles': {
        if (settings.roleModule == true) {
          try {
            await bot.updateGuild(message.guild, { roleModule: false });
            return await message.channel.send('The Role module is now disabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else if (settings.roleModule == false) {
          try {
            await bot.updateGuild(message.guild, { roleModule: true });
            return await message.channel.send('The Role module is now enabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'logging': {
        if (settings.loggingModule == true) {
          try {
            await bot.updateGuild(message.guild, { loggingModule: false });
            return await message.channel.send('The Logging module is now disabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else if (settings.loggingModule == false) {
          try {
            await bot.updateGuild(message.guild, { loggingModule: true });
            return await message.channel.send('The Logging module is now enabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'snippets': {
        if (settings.snipModule == true) {
          try {
            await bot.updateGuild(message.guild, { snipModule: false });
            return await message.channel.send('The Snippets module is now disabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else if (settings.snipModule == false) {
          try {
            await bot.updateGuild(message.guild, { snipModule: true });
            return await message.channel.send('The Snippets module is now enabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'welcomer': {
        if (settings.welcomeModule == true) {
          try {
            await bot.updateGuild(message.guild, { welcomeModule: false });
            return await message.channel.send('The Welcome module is now disabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else if (settings.welcomeModule == false) {
          try {
            await bot.updateGuild(message.guild, { welcomeModule: true });
            return await message.channel.send('The Welcome module is now enabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      case 'announcer': {
        if (settings.announceModule == true) {
          try {
            await bot.updateGuild(message.guild, { announceModule: false });
            return await message.channel.send('The Announce module is now disabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else if (settings.announceModule == false) {
          try {
            await bot.updateGuild(message.guild, { announceModule: true });
            return await message.channel.send('The Announce module is now enabled.');
          } catch(error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }
        break;
      }
      default:{
        await message.channel.send('Please provide a valid option.');
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
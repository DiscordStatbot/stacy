// The opposite of the disable function. This enables what was previously disabled.

module.exports = { 
  config: {
    name: 'enable',
    description: 'Enable message logging for specific channel or parts of the logging system. [Has Options]',
    usage: 'enable <option>`',
    options: '`commands` - Disable commands for the mentioned channel.\n**Usage:** `enable commands #channel`\n\n`message` - Disable message logging for the mentioned channel.\n*Sub-Options: delete, update, all*\n**Usage:** `enable message <sub-option> #channel`\n\n`log` - Disable a specific log for your server.,\n*Sub-Options: mod, member, message, channel, role*\n**Usage:** `enable log <sub-option>`',
    accessableby: 'Administrator',
    aliases: ['allow'],
    category: 'admin'
  },
  run: async (bot, message, args, settings, ignore) => {
    try{
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);
        
      let setting = args[0];
      let type = args[1];

      let chan = message.mentions.channels.first() || message.guild.channels.get(args[1]) || message.guild.channels.get(args[2]);

      switch (setting) {
      case 'message': {

        switch(type) {
        case 'delete': {
          if(ignore.msgDelete.includes(chan.id)) {
            try {
              await bot.updateIgnore( message.guild.id, {$pull: { msgDelete: chan.id }});
              await message.channel.send(`Now logging message deletes for: <#${chan.id}>`);
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            await message.channel.send('Already logging this channel.');
          }
          break;
        }
        case 'update': {
          if(ignore.msgUpdate.includes(chan.id)) {
            try {
              await bot.updateIgnore( message.guild.id, {$pull: { msgUpdate: chan.id }});
              await message.channel.send(`Now logging message updates for: <#${chan.id}>`);
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            await message.channel.send('Already logging this channel.');
          }
          break;
        }
        case 'all': {
          if(ignore.msgUpdate.includes(chan.id) && ignore.msgDelete.includes(chan.id)){
            try {
              await bot.updateIgnore( message.guild.id, {$pull: { msgDelete: chan.id }});
              await bot.updateIgnore( message.guild.id, {$pull: { msgUpdate: chan.id }});
              await message.channel.send(`Now logging message updates and deletes for: <#${chan.id}>`);
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            await message.channel.send('Already logging this channel.');
          }
          break;
        }      
        default:{
          await message.channel.send('Please specify a message enable option.');
        }
        }
        break;
      }
      case 'commands': {
        if(ignore.commandsDisable.includes(chan.id) && chan) {
          await bot.updateIgnore( message.guild.id, {$pull: { commandsDisable: chan.id }});
          await message.channel.send(`Command usage has been enabled for: **${chan.name}**`);
        }else {
          await message.channel.send('Channel already included.');
        }

        break;
      }
      case 'log': {
        switch(type) {
        case 'mod': {
          if(ignore.modLog == false) {
            try {
              await bot.updateIgnore( message.guild.id, { modLog: true } );
              await message.channel.send('Now logging Moderation.');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            await message.channel.send('This logging is already enabled.');
          }
          break;
        }
        case 'message': {
          if(ignore.msgLog == false) {
            try {
              await bot.updateIgnore( message.guild.id, { msgLog: true } );
              await message.channel.send('Now logging Messages');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            await message.channel.send('This logging is already enabled.');
          }
          break;
        }
        case 'member': {
          if(ignore.memLog == false) {
            try {
              await bot.updateIgnore( message.guild.id, { memLog: true } );
              await message.channel.send('Now logging Members');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            await message.channel.send('This logging is already enabled.');
          }
          break;
        }
        case 'channel': {
          if(ignore.chanLog == false) {
            try {
              await bot.updateIgnore( message.guild.id, { chanLog: true } );
              await message.channel.send('Now logging Channels');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            await message.channel.send('This logging is already enabled.');
          }
          break;
        }
        case 'role': {
          if(ignore.roleLog == false) {
            try {
              await bot.updateIgnore( message.guild.id, { roleLog: true } );
              await message.channel.send('Now logging Role');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            await message.channel.send('This logging is already enabled.');
          }
          break;
        }
        default:{
          await message.channel.send('Please specify a log enable option.');
        }
        }
        break;
      }
      default: {
        await message.channel.send(`Please specify an option. You can check the options with \`${settings.prefix}help enable\` `);
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
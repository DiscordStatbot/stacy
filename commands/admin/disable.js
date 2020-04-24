'use strict';

// To disable message logging, for example, message deletes will not be sent to the set message log.
// To disable parts of logging, for example, disable logging of channel creates, deletes and updates alltogether.

module.exports = {
  config: {
    name: 'disable',
    description: 'Disable message logging for specific channel or parts of the logging system. [Has Options]',
    usage: 'disable <option>`',
    options: '`commands` - Disable commands for the mentioned channel.\n**Usage:** `disable commands #channel`\n\n`message` - Disable message logging for the mentioned channel.\n*Sub-Options: delete, update, all*\n**Usage:** `disable message <sub-option> #channel`\n\n`log` - Disable a specific log for your server.,\n*Sub-Options: mod, member, message, channel, role*\n**Usage:** `disable log <sub-option>`',
    accessableby: 'Administrator',
    aliases: ['disallow'],
    category: 'admin',
  },
  run: async (bot, message, args, settings, ignore) => {
    try {
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);

      const setting = args[0];
      const type = args[1];

      const chan = message.mentions.channels.first() || message.guild.channels.get(args[1]) || message.guild.channels.get(args[2]);

      switch (setting) {
        case 'message': {
          switch (type) {
            case 'delete': {
              if (!ignore.msgDelete.includes(chan.id)) {
                try {
                  await bot.updateIgnore(message.guild.id, { $addToSet: { msgDelete: chan.id } });
                  await message.channel.send(`Now ignoring message deletes in: <#${chan.id}>`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                await message.channel.send('Already ignoring this channel.');
              }
              break;
            }
            case 'update': {
              if (!ignore.msgUpdate.includes(chan.id)) {
                try {
                  await bot.updateIgnore(message.guild.id, { $addToSet: { msgUpdate: chan.id } });
                  await message.channel.send(`Now ignoring message updates in: <#${chan.id}>`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                await message.channel.send('Already ignoring this channel.');
              }
              break;
            }
            case 'all': {
              if (!ignore.msgUpdate.includes(chan.id) && !ignore.msgDelete.includes(chan.id)) {
                try {
                  await bot.updateIgnore(message.guild.id, { $addToSet: { msgDelete: chan.id } });
                  await bot.updateIgnore(message.guild.id, { $addToSet: { msgUpdate: chan.id } });
                  await message.channel.send(`Now ignoring message updates and deletes in: <#${chan.id}>`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                await message.channel.send('Already ignoring this channel.');
              }
              break;
            }
            default: {
              await message.channel.send('Please specify a message disable option.');
            }
          }
          break;
        }
        case 'commands': {
          if (!ignore.responseExclude.includes(chan.id) && chan) {
            try {
              await bot.updateIgnore(message.guild.id, { $addToSet: { commandsDisable: chan.id } });
              await message.channel.send(`Command usage has been disabled for: **${chan.name}**`);
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          } else {
            await message.channel.send('Channel already excluded.');
          }

          break;
        }
        case 'log': {
          switch (type) {
            case 'mod': {
              if (ignore.modLog == true) {
                try {
                  await bot.updateIgnore(message.guild.id, { modLog: false });
                  await message.channel.send('Now ignoring Moderation Logging');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                await message.channel.send('This logging is already disabled.');
              }
              break;
            }
            case 'message': {
              if (ignore.msgLog == true) {
                try {
                  await bot.updateIgnore(message.guild.id, { msgLog: false });
                  await message.channel.send('Now ignoring Message Logging');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                await message.channel.send('This logging is already disabled.');
              }
              break;
            }
            case 'member': {
              if (ignore.memLog == true) {
                try {
                  await bot.updateIgnore(message.guild.id, { memLog: false });
                  await message.channel.send('Now ignoring Member Logging');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                await message.channel.send('This logging is already disabled.');
              }
              break;
            }
            case 'channel': {
              if (ignore.chanLog == true) {
                try {
                  await bot.updateIgnore(message.guild.id, { chanLog: false });
                  await message.channel.send('Now ignoring Channel Logging');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                await message.channel.send('This logging is already disabled.');
              }
              break;
            }
            case 'role': {
              if (ignore.roleLog == true) {
                try {
                  await bot.updateIgnore(message.guild.id, { roleLog: false });
                  await message.channel.send('Now ignoring Role Logging');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                await message.channel.send('This logging is already disabled.');
              }
              break;
            }
            default: {
              await message.channel.send('Please specify a log disable option.');
            }
          }
          break;
        }
        default: {
          await message.channel.send(`Please specify an option. You can check the options with \`${settings.prefix}help disable\` `);
        }
      }
    } catch (error) {
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      } catch (error) {

      }
    }
  },
};

// All basic settings is from this file. Most important settings are here.

'use strict';

module.exports = {
  config: {
    name: 'settings',
    description: 'Setup your server to use Stacy. She has many different parts to her and we recommand use the `help <command>` method to get exact information. [Has options]',
    usage: 'settings <option>`',
    options: '`prefix` - Set the prefix of your server or reset it to default.\n**Usage:** `setttings prefix [newprefix]`\n\n`role` - Setup the roles needed to use Stacy\n*Sub-Options: admin, support*\n**Usage:** `settings role <sub-option> <@role or role ID>`\n\n`log` - Setup the channels needed to use Stacy\'s logging system.\n*Sub-Options: all, mod, server, message, member*\n**Usage:** `settings log <sub-option> <#channel or channel ID>`',
    accessableby: 'Administrator',
    aliases: ['set'],
    category: 'admin',
  },
  run: async (bot, message, args, settings, ignore) => {
    try {
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);

      const setting = args[0];
      const type = args[1];
      const updated = args.slice(2).join(' ');

      switch (setting) {
        case 'prefix': {
          if (args[1]) {
            try {
              await bot.updateGuild(message.guild, { prefix: args[1] });
              return await message.channel.send(`Prefix has been updated to: \`${args[1]}\``);
            } catch (error) {
              await message.channel.send(`An error occurred: **${error.message}**`);
            }
          }
          try {
            await bot.updateGuild(message.guild, { prefix: bot.config.defaultSettings.prefix });
            return await message.channel.send('Prefix has been reset to default');
          } catch (error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
          break;
        }
        case 'log': {
          const chan = message.mentions.channels.first() || message.guild.channels.get(updated);

          switch (type) {
            case 'all': {
              if (chan) {
                try {
                  await bot.updateGuild(message.guild, { modChannel: chan.id });
                  await bot.updateGuild(message.guild, { memberChannel: chan.id });
                  await bot.updateGuild(message.guild, { messageChannel: chan.id });
                  await bot.updateGuild(message.guild, { serverChannel: chan.id });
                  return await message.channel.send(`Logging channel has been set to: <#${chan.id}>`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                try {
                  await bot.updateGuild(message.guild, { $unset: { modChannel: '' } });
                  await bot.updateGuild(message.guild, { $unset: { memberChannel: '' } });
                  await bot.updateGuild(message.guild, { $unset: { messageChannel: '' } });
                  await bot.updateGuild(message.guild, { $unset: { serverChannel: '' } });
                  return await message.channel.send('Logging channel disabled.');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              }
              break;
            }
            case 'mod': {
              if (chan) {
                try {
                  await bot.updateGuild(message.guild, { modChannel: chan.id });
                  return await message.channel.send(`Moderation logging channel has been set to: <#${chan.id}>`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                try {
                  await bot.updateGuild(message.guild, { $unset: { modChannel: '' } });
                  return await message.channel.send('Moderation logging channel disabled.');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              }
              break;
            }
            case 'member': {
              if (chan) {
                try {
                  await bot.updateGuild(message.guild, { memberChannel: chan.id });
                  return await message.channel.send(`Member logging channel has been set to: <#${chan.id}>`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                try {
                  await bot.updateGuild(message.guild, { $unset: { memberChannel: '' } });
                  return await message.channel.send('Member logging channel disabled.');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              }
              break;
            }
            case 'message': {
              if (chan) {
                try {
                  await bot.updateGuild(message.guild, { messageChannel: chan.id });
                  return await message.channel.send(`Message logging channel has been set to: <#${chan.id}>`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                try {
                  await bot.updateGuild(message.guild, { $unset: { messageChannel: '' } });
                  return await message.channel.send('Message logging channel disabled.');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              }
              break;
            }
            case 'server': {
              if (chan) {
                try {
                  await bot.updateGuild(message.guild, { serverChannel: chan.id });
                  return await message.channel.send(`Server logging channel has been set to: <#${chan.id}>`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                try {
                  await bot.updateGuild(message.guild, { $unset: { serverChannel: '' } });
                  return await message.channel.send('Server logging channel disabled.');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              }
              break;
            }
            default: {
              await message.channel.send('Please provide a valid channel option.');
            }
          }
          break;
        }
        case 'role': {
          const role = message.mentions.roles.first() || message.guild.roles.get(updated);

          switch (type) {
            case 'admin': {
              if (role) {
                try {
                  await bot.updateGuild(message.guild, { adminRole: role.id });
                  return await message.channel.send(`Admin role has been set to: **${role.name}**`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                try {
                  await bot.updateGuild(message.guild, { $unset: { adminRole: '' } });
                  return await message.channel.send('Admin role disabled.');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              }
              break;
            }
            case 'support': {
              if (role) {
                try {
                  await bot.updateGuild(message.guild, { supportRole: role.id });
                  return await message.channel.send(`Support role has been set to: **${role.name}**`);
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              } else {
                try {
                  await bot.updateGuild(message.guild, { $unset: { supportRole: '' } });
                  return await message.channel.send('Support role disabled.');
                } catch (error) {
                  await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
                }
              }
              break;
            }
            default: {
              await message.channel.send('Please provide a valid role option.');
            }
          }
          break;
        }
        default: {
          await message.channel.send(`Please provide an option. Type \`${settings.prefix}help settings\` for more information.`);

          break;
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

// Show the different settings of the server.

'use strict';

const { RichEmbed, Attachment } = require('discord.js');

module.exports = {
  config: {
    name: 'show',
    description: 'Show different settings of your server. [Has options]',
    usage: 'show <option>`',
    options: '`settings` - Show the server settings.\n`tickets` - Show the ticket system settings.\n`welcomer` - Check the settings for your servers join message, role on join and channel join messages are sent in.\n`announcer`- Check the settings for the Automatic Announcement ping system.\n`modules` - Show which modules are enabled or disabled.\n`permissions` - Show which logs are enabled, which channels are ignored by logging, where commands are disabled and where auto responses are disabled.\n`react roles` - Show list self assignable roles.',
    accessableby: 'Administrator',
    category: 'admin',
  },
  run: async (bot, message, args, settings, ignore) => {
    try {
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);
      const update = args.join(' ');

      switch (update) {
        case 'permissions': {
          const d = [];
          let msgDStyle;
          for (let i = 0; i < ignore.msgDelete.length; i++) {
            d.push(`<#${ignore.msgDelete[i]}>`);
            msgDStyle = d.join('\n');
          }
          const u = [];
          let msgUStyle;
          for (let i = 0; i < ignore.msgUpdate.length; i++) {
            u.push(`<#${ignore.msgUpdate[i]}>`);
            msgUStyle = u.join('\n');
          }
          const r = [];
          let responseRStyle;
          for (let i = 0; i < ignore.responseExclude.length; i++) {
            r.push(`<#${ignore.responseExclude[i]}>`);
            responseRStyle = r.join('\n');
          }
          const c = [];
          let commandsCStyle;
          for (let i = 0; i < ignore.commandsDisable.length; i++) {
            c.push(`<#${ignore.commandsDisable[i]}>`);
            commandsCStyle = c.join('\n');
          }

          const embed = new RichEmbed()
            .setColor(bot.config.yellow)
            .setDescription(`For disabling or emabling help type \`${settings.prefix}help disable or emable\``)
            .setTitle(`Logging settings for ${message.guild.name}`, message.guild.iconURL)
            .addField('Ignored Channels', `__**Message Delete**__\n${msgDStyle || 'No channels ignored'}\n\n__**Message Update**__\n${msgUStyle || 'No channels ignored'}\n\n__**Auto Response Ignored**__\n${responseRStyle || 'No channels ignored'}\n\n__**Commands Ignore**__\n${commandsCStyle || 'No channels ignored'}`, true)
            .addField('Logging', `**Message:** ${checkBoolean(ignore.msgLog)}\n**Member:** ${checkBoolean(ignore.memLog)}\n**Mod:** ${checkBoolean(ignore.modLog)}\n**Channel:** ${checkBoolean(ignore.chanLog)}\n**Role:** ${checkBoolean(ignore.roleLog)}`, true)
            .setTimestamp()
            .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);

          await message.channel.send(embed);

          break;
        }
        case 'modules': {
          const embed = new RichEmbed()
            .setColor(bot.config.yellow)
            .setTitle(`Module settings for ${message.guild.name}`, message.guild.iconURL)
            .setDescription(`**Logging:** ${checkBoolean(settings.loggingModule)}\n**Welcomer:** ${checkBoolean(settings.welcomeModule)}\n**Announcements:** ${checkBoolean(settings.annnounceModule)}\n**Tickets:** ${checkBoolean(settings.ticketModule)}\n**Help Desk:** ${checkBoolean(settings.deskModule)}\n**Auto Responder:** ${checkBoolean(settings.autoModule)}\n**Roles:** ${checkBoolean(settings.roleModule)}\n**Snippets:** ${checkBoolean(settings.snipModule)}\n`)
            .setTimestamp()
            .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);

          await message.channel.send(embed);

          break;
        }
        case 'react roles': {
          const embed = new RichEmbed();

          let roles;

          try {
            roles = await bot.getAllReact(message.guild);
          } catch (error) {
            return await message.channel.send('There is no joinable roles in this server.');
          }

          const arr = [];
          let list;

          for (let j = 0; j < roles.length; j++) {
            arr.push(`**Role:** <@&${roles[j].roleID}>\n**Emoji:** ${roles[j].emoji}`);

            try {
              list = arr.join('\n• ');
            } catch (error) {
              list = `${bot.config.errMsg} \`${error.message}\``;
            }
          }

          embed.setColor(bot.config.yellow)
            .addField('------------------------------', `• ${list || 'None'}`)
            .addField('------------------------------', `To add a role type \`${settings.prefix}reactrole add <message ID> <@role or ID> <emoji>\`\nTo remove a role type \`${settings.prefix}reactrole remove <@role or role ID>\``)
            .setTitle(`${message.guild.name} Reaction roles [${roles.length}]`)
            .setTimestamp()
            .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);

          await message.channel.send(embed);

          break;
        }
        case 'welcomer': {
          let welcomeRStyle;
          if (!settings.welcomeRole) {
            welcomeRStyle = '`None`';
          } else {
            welcomeRStyle = `<@&${settings.welcomeRole}>`;
          }
          let welcomeCStyle;
          if (!settings.welcomeChannel) {
            welcomeCStyle = '`None`';
          } else {
            welcomeCStyle = `<#${settings.welcomeChannel}>`;
          }
          let welcomeMStyle;
          if (!settings.welcomeMessage) {
            welcomeMStyle = '`None`';
          } else {
            welcomeMStyle = `\`\`\`${settings.welcomeMessage}\`\`\``;
          }
          let welcomePStyle;
          if (settings.welcomePing) {
            welcomePStyle = '`on`';
          } else {
            welcomePStyle = '`off`';
          }
          let welcomeIStyle;
          if (!settings.welcomeImage) {
            welcomeIStyle = '`None`';
          } else {
            welcomeIStyle = new Attachment(`./welcomeImages/${settings.welcomeImage}`);
          }
          let welcomeCoStyle;
          if (!settings.welcomeColor) {
            welcomeCoStyle = '`None`';
          } else {
            welcomeCoStyle = `\`${settings.welcomeColor}\``;
          }

          if (settings.welcomeImage) {
            const wembed = new RichEmbed()
              .addField('__Welcomer Settings__', `**Role:** ${welcomeRStyle}\n**Channel:** ${welcomeCStyle}\n**Join Ping:** ${welcomePStyle}\n**Color:** ${welcomeCoStyle}\n**Message:** ${welcomeMStyle}\n**Image:**`)
              .attachFile(welcomeIStyle)
              .setColor(bot.config.yellow)
              .setImage(`attachment://${settings.welcomeImage}`);

            await message.channel.send(wembed);
          } else {
            const wembed = new RichEmbed()
              .setColor(bot.config.yellow)
              .addField('__Welcomer Settings__', `**Role:** ${welcomeRStyle}\n**Channel:** ${welcomeCStyle}\n**Join Ping:** ${welcomePStyle}\n**Color:** ${welcomeCoStyle}\n**Message:** ${welcomeMStyle}\n**Image:** ${welcomeIStyle}`);

            await message.channel.send(wembed);
          }
          break;
        }
        case 'announcer': {
          let announceCStyle;
          if (!settings.announceChannel) {
            announceCStyle = '`None`';
          } else {
            announceCStyle = `<#${settings.announceChannel}>`;
          }
          let announceRStyle;
          if (!settings.announceRole) {
            announceRStyle = '`None`';
          } else {
            announceRStyle = `<@&${settings.announceRole}>`;
          }
          let announceTStyle;
          if (settings.announceToggle) {
            announceTStyle = '`on`';
          } else {
            announceTStyle = '`off`';
          }
          const aembed = new RichEmbed()
            .setColor(bot.config.yellow)
            .addField('__Announcer Settings__', `**Channel:** ${announceCStyle}\n**Role:** ${announceRStyle}\n**Ping:** ${announceTStyle}`, true);

          await message.channel.send(aembed);
          break;
        }
        case 'tickets': {
          let ticketLStyle;
          if (!settings.ticketLog) {
            ticketLStyle = '`None`';
          } else {
            ticketLStyle = `<#${settings.ticketLog}>`;
          }
          let ticketCStyle;
          if (!settings.ticketCategory) {
            ticketCStyle = '`None`';
          } else {
            const cate = message.guild.channels.find((c) => c.id === settings.ticketCategory);
            ticketCStyle = `\`${cate.name}\``;
          }

          const tembed = new RichEmbed()
            .setColor(bot.config.yellow)
            .addField('__Ticket System__', `**Log:** ${ticketLStyle}\n**Category:** ${ticketCStyle}`);

          message.channel.send(tembed);
          break;
        }
        case 'settings': {
          let modlogCstyle;
          if (!settings.modChannel) {
            modlogCstyle = '`None`';
          } else {
            modlogCstyle = `<#${settings.modChannel}>`;
          }
          let memberlogCstyle;
          if (!settings.memberChannel) {
            memberlogCstyle = '`None`';
          } else {
            memberlogCstyle = `<#${settings.memberChannel}>`;
          }
          let messagelogCstyle;
          if (!settings.messageChannel) {
            messagelogCstyle = '`None`';
          } else {
            messagelogCstyle = `<#${settings.messageChannel}>`;
          }
          let serverlogCstyle;
          if (!settings.serverChannel) {
            serverlogCstyle = '`None`';
          } else {
            serverlogCstyle = `<#${settings.serverChannel}>`;
          }
          let adminRstyle;
          if (!settings.adminRole) {
            adminRstyle = '`None`';
          } else {
            adminRstyle = `<@&${settings.adminRole}>`;
          }
          let supportRstyle;
          if (!settings.supportRole) {
            supportRstyle = '`None`';
          } else {
            supportRstyle = `<@&${settings.supportRole}>`;
          }

          const gembed = new RichEmbed()
            .setColor(bot.config.yellow)
            .setAuthor(`${message.guild.name} settings`)
            .setDescription(`These are the settings for your server.\nTo change these settings use \`${settings.prefix}settings <option>\``)
            .addField('Preifx', `The prefix is set to \`${settings.prefix}\``)
            .addField('__Roles__', `**Admin:** ${adminRstyle}\n**Support:** ${supportRstyle}`)
            .addField('__Logging__', `**Mod:** ${modlogCstyle}\n**Message:** ${messagelogCstyle}\n**Member:** ${memberlogCstyle}\n**Server:** ${serverlogCstyle}`);

          await message.channel.send(gembed);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      } catch (error) {

      }
    }
    function checkBoolean(value) {
      if (!value) return value = 'disabled';
      return value = 'enabled';
    }
  },
};

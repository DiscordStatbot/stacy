// Reaction role system, needs a lot of work. Associated files are the raw.js , messageReactionAdd.js , messageReactionRemove.js and the model file for the DB.

'use strict';

const { RichEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'reactrole',
    description: 'Setup roles for users to join via emoji reactions. [Has options]',
    usage: 'reactrole <option>`',
    options: '`list` - Show the reaction roles for this server. If a role shows as <@&somenumbers> it means the role was deleted. You can remove the role with the numbers.\n\n`add` - Add a reaction role.\n**Usage:** `reactrole add <message ID> <@role or role ID> <emoji>`\n\n`remove` - Remove a reaction role. You will need to remove the emojis from the message yourself.\n**Usage:** `reactrole remove <@role or role ID>`\n',
    accessableby: 'Administrator',
    aliases: ['rr', 'rrole'],
    category: 'admin',
  },
  run: async (bot, message, args, settings) => {
    if (!settings.roleModule) return message.channel.send('Module disabled. Type `s!module roles` to enable.');
    try {
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);

      const update = args[0];
      switch (update) {
        case 'add': {
          const rMsg = await message.channel.fetchMessage(args[1]);
          const role = message.mentions.roles.first() || message.guild.roles.get(args[2]);

          let emj;
          if (args[3].startsWith('<')) {
            const regex = /<(?<anim>a?):(?<name>[a-zA-Z0-9\W_]+?):(?<id>\d+?)>/g;
            const emojinfo = regex.exec(args[3]);
            const emjID = emojinfo.groups.id;
            emj = message.guild.emojis.get(emjID);
          } else {
            emj = args[3];
          }
          let roleDoc;
          try {
            roleDoc = await bot.getReact(role.id);
          } catch (error) {
            return message.channel.send('Please provide a valid role as a mention or the ID.');
          }

          if (roleDoc) return await message.channel.send('Role has already been added.');

          if (role && !roleDoc) {
            const newReact = {
              guildID: message.guild.id,
              emoji: emj,
              roleID: role.id,
              messageID: rMsg.id,
            };
            rMsg.react(emj).then(async () => {
              try {
                await bot.createReact(newReact);
                await message.channel.send(`Added **${role.name}** with emoji ${emj} to reaction roles.`);
              } catch (error) {
                await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
              }
            });
          }
          break;
        }
        case 'remove': {
          const role = message.mentions.roles.first() || message.guild.roles.get(args[1]);

          let roleDoc;
          try {
            roleDoc = await bot.getReact(role.id);
          } catch (error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }

          if (!roleDoc) return message.channel.send('This role has already been deleted.');

          if (role && roleDoc) {
            try {
              await bot.deleteReact(role.id);
              await message.channel.send(`Removed **${role.name}** with emoji ${roleDoc.emoji} frome reaction roles.`);
            } catch (error) {
              await message.channel.send('Please provide a valid role.');
            }
          }
          break;
        }
        case 'list': {
          const embed = new RichEmbed();

          let roles;

          try {
            roles = await bot.getAllReact(message.guild);
          } catch (error) {
            return await message.channel.send('There is no joinable roles in this server.');
          }

          const arr = [];
          let list;

          for (let i = 0; i < roles.length; i++) {
            arr.push(`**Role:** <@&${roles[i].roleID}>\n**Emoji:** ${roles[i].emoji}`);

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
        default: {
          await message.channel.send(`Please provide an option. Type \`${settings.prefix}help reactrole\` for more information.`);
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

// Check different info about the server and roles and users.

'use strict';

const { RichEmbed } = require('discord.js');
const dateFormat = require('dateformat');

module.exports = {
  config: {
    name: 'check',
    usage: 'check <option>`',
    description: 'Check info about the server such as server basic information or a specified user or role.',
    options: '`user` - Check info about a user.\n`role` - Get info about a role.\n`server` - Display server information.',
    accessableby: 'Moderator',
    category: 'support',
  },
  run: async (bot, message, args, settings) => {
    try {
      if (!settings.supportRole) return message.channel.send(`Please setup the admin or mod role with the \`${settings.prefix}settings\` command`);
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.supportRole) && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need this servers \`Support\` or \`Admin\` role to perform this action.`);

      const option = args[0];

      switch (option) {
        case 'user': {
          const member = message.mentions.members.first() || message.guild.members.find(args[1]);
          const createdAt = dateFormat(member.user.createdAt, 'isoDateTime');

          const list = member.roles.map((r) => ` \`${r.name} \``).slice(1).join(' | ');
          const embed = new RichEmbed()
            .setColor(bot.config.yellow)
            .setThumbnail(member.user.displayAvatarURL)
            .setTitle(`${member.user.username}#${member.user.discriminator}`)
            .setDescription(`**User ID:** \`${member.user.id}\`\n**Nickname:** \`${member.user.nickname || 'None'}\`\n**Created On:** \`${createdAt}\`\n\n**Roles:**\n${list || '`None`'}\n\n**Last Message:**\n\`${member.user.lastMessage.content || 'None'}\``);

          await message.channel.send(embed);
          break;
        }
        case 'role': {
          const role = message.mentions.roles.first() || message.guild.roles.find(args[1]);
          const embed = new RichEmbed()
            .setColor(role.color || bot.config.yellow)
            .setTitle(`${role.name}`)
            .setDescription(`**Role ID:** \`${role.id}\`\n**Role Color Code:** \`${role.color || 'None'}\`\n**Hoisted:** \`${role.hoist}\`\n**Mentionable:** \`${role.mentionable}\`\n**Position:** \`${role.position}\``);

          await message.channel.send(embed);
          break;
        }
        case 'server': {
          const roles = message.guild.roles.map((r) => ` \`${r.name} \``).slice(1).join(' | ');
          const textChannels = message.guild.channels.filter((c) => c.type == 'text').map((c) => ` \`${c.name}\``).join(' | ');
          const voiceChannels = message.guild.channels.filter((c) => c.type == 'voice').map((c) => ` \`${c.name}\``).join(' | ');
          const createdAt = dateFormat(message.guild.createdAt);

          const embed = new RichEmbed()
            .setColor(bot.config.yellow)
            .setTitle(`${message.guild.name}`)
            .setThumbnail(message.guild.iconURL)
            .setDescription(`**Server ID:** \`${message.guild.id}\`\n**Server Owner:** ${message.guild.owner}\n**Member Count:**  \`${message.guild.memberCount}\`\n**Created At:** \`${createdAt}\`\n**Region:** \`${message.guild.region}\``)
            .addField('Roles', roles || '`None`')
            .addField('Text Channels', textChannels)
            .addField('Voice Channels', voiceChannels);

          await message.channel.send(embed);
          break;
        }
        default: {
          await message.channel.send(`Please provide an option. Check options with ${settings.prefix}help check`);
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

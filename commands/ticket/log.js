// Get a file containing a users previous ticket log.

'use strict';

const { Attachment } = require('discord.js');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'log',
    description: 'Get the ticket logs for a single user.',
    usage: 'log <@user or ID>`',
    accessableby: 'Support',
    category: 'ticket',
  },
  run: async (bot, message, args, settings) => {
    if (!settings.ticketModule) return message.channel.send('Module disabled. Type `s!module tickets` to enable. Requires Admin');
    try {
      if (!settings.ticketLog || !settings.ticketCategory) return await message.channel.send(`Please setup the ticket system with the \`${settings.prefix}settings\` command`);
      if (!settings.supportRole) return await message.channel.send(`Please setup the admin or support or mod role with the \`${settings.prefix}settings\` command`);
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.supportRole) && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need this servers \`Support\` or \`Admin\` role to perform this action.`);

      const dir = './logs/';

      dirCheck(dir);

      const member = message.mentions.members.first() || message.guild.members.get(args[0]);
      if (!member) return await message.channel.send('Please specify a user');

      let userTickets;
      try {
        userTickets = await bot.getAllTicket(member.id, message.guild);
      } catch (error) {
        console.error(` [ERROR] ${error.stack}`);
      }

      const writeInfo = [];
      for (let i = 0; i < userTickets.length; i++) {
        writeInfo.push(`Ticket Info: ${userTickets[i].ticket}\n==================\n${userTickets[i].messages}`);
      }
      fs.writeFile(
        `./logs/${message.guild.id}_${member.id}_${message.id}.txt`,
        writeInfo.join('\n\n=======================\n'),
        async (error) => {
          if (error) return console.error(` [ERROR] ${error.stack}`);

          const attachment = new Attachment(`./logs/${message.guild.id}_${member.id}_${message.id}.txt`, `${message.guild.id}_${member.id}_${message.id}.txt`);
          await message.channel.send(`Ticket logs for **${member.user.username}**\n\n**Total Logs:** ${userTickets.length}`, attachment).then(async () => {
            fs.unlink(`./logs/${message.guild.id}_${member.id}_${message.id}.txt`, (error) => {
              if (error) return console.error(` [ERROR] ${error.stack}`);
            });
          });
        },
      );
    } catch (error) {
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      } catch (error) {

      }
    }
    async function dirCheck(directory) {
      try {
        await fs.ensureDir(directory);
      } catch (error) {
        console.error(` [ERROR] ${error.stack}`);
      }
    }
  },
};

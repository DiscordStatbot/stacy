// Gets the logs for the entire server. This one can sometimes take a few moments if there is a lot of logs to write to the file.

'use strict';

const { Attachment } = require('discord.js');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'logs',
    description: 'Get the ticket log for the server. Note: If there is a lot of tickets this will take a while to upload.',
    usage: 'logs`',
    accessableby: 'Support',
    category: 'ticket',
  },
  run: async (bot, message, args, settings) => {
    if (settings.ticketModule == false) return message.channel.send('Module disabled. Type `s!module tickets` to enable. Requires Admin');
    try {
      if (!settings.ticketCategory) return await message.channel.send(`Please setup the ticket system with the \`${settings.prefix}settings\` command`);
      if (!settings.supportRole) return await message.channel.send(`Please setup the admin or support or mod role with the \`${settings.prefix}settings\` command`);
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.supportRole) && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need this servers \`Support\` or \`Admin\` role to perform this action.`);

      const dir = './logs/';

      dirCheck(dir);

      let guildTickets;
      try {
        guildTickets = await bot.getGuildTicket(message.guild);
      } catch (error) {
        console.error(` [ERROR] ${error.stack}`);
      }

      const writeInfo = [];
      for (let i = 0; i < guildTickets.length; i++) {
        writeInfo.push(`Ticket Info: ${guildTickets[i].ticket}\n=======================\n${guildTickets[i].messages}`);
      }
      fs.writeFile(
        `./logs/${message.guild.id}_${message.id}.txt`,
        writeInfo.join('\n\n=======================\n'),
        async (error) => {
          if (error) return console.error(` [ERROR] ${error.stack}`);

          const attachment = new Attachment(`./logs/${message.guild.id}_${message.id}.txt`, `${message.guild.id}_${message.id}.txt`);
          await message.channel.send(`Ticket logs for **${message.guild.name}**\n\n**Total Logs:** ${guildTickets.length}`, attachment).then(async () => {
            fs.unlink(`./logs/${message.guild.id}_${message.id}.txt`, (error) => {
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

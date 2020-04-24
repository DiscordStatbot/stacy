// Close a ticket. Used inside the ticket channel.

'use strict';

const { RichEmbed, Attachment } = require('discord.js');
const dateFormat = require('dateformat');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'close',
    description: 'Close a ticket',
    usage: 'new <message>`',
    accessableby: 'Member',
    category: 'ticket',
  },
  run: async (bot, message, args, settings) => {
    try {
      if (!message.channel.name.startsWith('ticket-')) return await message.channel.send('Please use the command in a ticket channel');
      if (!settings.ticketLog) return await message.channel.send(`Please setup the ticket log with the \`${settings.prefix}settings\` command`);
      if (!settings.supportRole) return await message.channel.send(`Please setup the admin or support or mod role with the \`${settings.prefix}settings\` command`);
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.supportRole) && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need this servers \`Support\` or \`Admin\` role to perform this action.`);

      const closer = message.author;
      const userID = message.channel.name.slice(7);
      const test = 'none';

      const ticketed = message.guild.members.get(userID);

      const logChan = message.guild.channels.get(settings.ticketLog);

      message.channel.send('Ticket is being closed!').then(async () => {
        await message.channel.fetchMessages().then(async (messages) => {
          const content = messages.filter((u) => u.author != bot.user && !u.content.startsWith(settings.prefix)).map((m) => `[ ${dateFormat(m.createdTimestamp, 'isoDateTime')} ] ${m.author.username} (${m.author.id}) - ${m.content}`).join('\n');

          try {
            await bot.updateTicket(userID, message.guild, test, { $set: { messages: `${content}\n\n Ticket closed by ${closer.username} (${closer.id})` } });
          } catch (error) {
            return await message.channel.send(`${bot.config.errMsg} \`${error.stack}\``);
          }

          let ticketDoc;
          try {
            ticketDoc = await bot.getTicket(userID, message.guild, `${content}\n\n Ticket closed by ${closer.username} (${closer.id})`);
          } catch (error) {
            console.log(error.stack);
          }

          const dir = './logs/';

          async function dirCheck(directory) {
            try {
              await fs.ensureDir(directory);
            } catch (error) {
              console.error(` [ERROR] ${error.stack}`);
            }
          }
          dirCheck(dir);

          fs.writeFile(
            `./logs/${message.guild.id}_${userID}_${message.createdTimestamp}.txt`,
            `\nTicket Info: ${ticketDoc.ticket}\n=======================\n${ticketDoc.messages}`,
            async (error) => {
              if (error) return console.error(` [ERROR] ${error.stack}`);

              const attachment = new Attachment(`./logs/${message.guild.id}_${userID}_${message.createdTimestamp}.txt`, `${message.guild.id}_${userID}_${message.createdTimestamp}.txt`);
              await logChan.send(`Thread closed for ${ticketed.user.username}`, attachment);
            },
          );
        }).then(async () => {
          await message.channel.delete().then(async () => {
            fs.unlink(`./logs/${message.guild.id}_${userID}_${message.createdTimestamp}.txt`, (error) => {
              if (error) return console.error(` [ERROR] ${error.stack}`);
            });
          });
        });
      });
      if (ticketed) {
        try {
          await ticketed.send('Your ticket has been closed');
        } catch (error) {
          return;
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

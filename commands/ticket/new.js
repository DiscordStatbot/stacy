// This is used to create a new ticket. A user uses this when they need to contact the staff of a server.

'use strict';

const { RichEmbed } = require('discord.js');
const dateFormat = require('dateformat');

module.exports = {
  config: {
    name: 'new',
    description: 'Create a new ticket',
    usage: 'new <message>`',
    accessableby: 'Member',
    category: 'ticket',
  },
  run: async (bot, message, args, settings) => {
    if (!settings.ticketModule) return message.channel.send('Module disabled. Type `s!module tickets` to enable. Requires Admin');
    try {
      if (!settings.ticketCategory || !settings.supportRole || !settings.ticketLog) return;
      const active = message.guild.channels.find((c) => c.name === `ticket-${message.author.id}`);
      const reason = args.join(' ');
      const user = message.author;
      const ticketMsg = `User Name: ${user.username}\nUser ID: ${user.id}\n--------------------------------\nTicket Created at: ${dateFormat(message.createdTimestamp, 'isoDateTime')}\nTicket Message: ${reason}`;

      if (active) {
        return await message.channel.send(`You already have an active ticket <#${active.id}>`);
      }

      if (!reason) return await message.channel.send('Please specificy a reason');
      if (reason.length < 3) return await message.channel.send('Your message is to short. Minimum 3 words.');

      const newEmbed = new RichEmbed()
        .setColor(bot.config.green)
        .setTitle(`New Ticket - ${user.username}`)
        .setDescription(`Please wait for the staff to assist you.\n\n**User ID:** ${user.id}\n\n**User Created At:** ${dateFormat(user.createdAt)}\n\n**Ticket Message:** ${reason}`)
        .setFooter(`Ticket Thread for ${message.guild.name}`, message.guild.iconURL)
        .setTimestamp();

      const newTicket = {
        guildID: message.guild.id,
        userID: user.id,
        ticket: ticketMsg,
        messages: 'none',
      };
      try {
        await bot.createTicket(newTicket);
      } catch (error) {
        return await message.channel.send(`${bot.config.errMsg} \`${error.stack}\``);
      }

      await message.guild.createChannel(`ticket-${user.id}`, {
        type: 'text',
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: user.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
          {
            id: settings.supportRole,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
          {
            id: settings.adminRole,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
          },
        ],
      }).then(async (m) => {
        await m.setParent(settings.ticketCategory);
        await m.send('@here');
        await m.send(newEmbed).catch(console.error);
      });
      await message.channel.send(`Your ticket has been sent to the staff of **${message.guild.name}**.`);

      try {
        await message.delete(10000);
      } catch (error) {
        return;
      }
    } catch (error) {
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      } catch (error) {

      }
    }
  },
};

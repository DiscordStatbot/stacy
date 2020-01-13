// This is for staff to open a support ticket with a user.

const { RichEmbed } = require('discord.js');
const dateFormat = require('dateformat');

module.exports = {
  config: {
    name: 'open',
    description: 'Create a new ticket with a specified user.',
    usage: 'open <@user or user ID>`',
    accessableby: 'Support',
    category: 'ticket'
  },
  run: async (bot, message, args, settings) => {
    if(settings.ticketModule == false) return message.channel.send('Module disabled. Type `s!module tickets` to enable. Requires Admin');
    try{
      if(!settings.ticketCategory || !settings.supportRole || !settings.ticketLog) return;
      if(!settings.supportRole) return await message.channel.send(`Please setup the admin or support or mod role with the \`${settings.prefix}settings\` command`);
      if(!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.supportRole) && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need this servers \`Support\` or \`Admin\` role to perform this action.`);

      let user = message.mentions.members.first() || message.guild.members.get(args[0]);
      let active = message.guild.channels.find(c => c.name === `ticket-${user.id}`);
      let ticketMsg = `User Name: ${user.user.username}\nUser ID: ${user.id}\n=======================\nTicket Created at: ${dateFormat(message.createdTimestamp, 'isoDateTime')}\nTicket Message: 'New Staff created Ticket'`;
      if(!user) return message.channel.send('Specify user please.');
      if(active) {
        return await message.channel.send(`This user has an active ticket <#${active.id}>`);
      }else {
  
        let newEmbed = new RichEmbed()
          .setColor(bot.config.green)
          .setTitle(`New Ticket - ${user.user.username}`)
          .setDescription(`Ticket created by the staff.\n\n**User ID:** ${user.id}\n\n**User Created At:** ${dateFormat(user.createdAt)}`)
          .setFooter(`Ticket Thread for ${message.guild.name}`, message.guild.iconURL)
          .setTimestamp();
    
        const newTicket = {
          guildID: message.guild.id,
          userID: user.id,
          createdAt: message.createdTimestamp,
          ticket: ticketMsg,
          messages: 'none'
        };
        try {
          await bot.createTicket(newTicket);
        }catch (error) {
          return await message.channel.send(`${bot.config.errMsg} \`${error.stack}\``);
        }
    
        await message.guild.createChannel(`ticket-${user.id}`, {
          type: 'text',
          permissionOverwrites: [
            {
              id: message.guild.id,
              deny: ['VIEW_CHANNEL']
            },
            {
              id: user.id,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
              id: settings.supportRole,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            },
            {
              id: settings.adminRole,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
            },
          ]
        }).then(async m => {
          await m.setParent(settings.ticketCategory);
          await m.send(`<@${user.id}>`);
          await m.send(newEmbed).catch(console.error);
          await message.channel.send(`Ticket opened <#${m.id}>.`);
        });
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
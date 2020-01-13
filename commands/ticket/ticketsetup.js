// This is the setup file for the ticket system. From this command the category and logging channel is set up.

const { RichEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'ticketsetup',
    description: 'Setup the ticket system on your server.',
    usage: 'ticketsetup <option>`',
    options: '`category` - Set the category for the ticket system. All new tickets will be made in this category.\n**Usage:** `ticketsetup category <category ID>\n\n`log` - Set the logging channel for when tickets are closed.\n**Usage:** `ticketsetup log <#channel or ID>`\n\n`commands` - List the commands for the Ticket system. This is handy to easily show your mods or support team what the commands are.',
    accessableby: 'Administrator',
    category: 'ticket'
  },
  run: async (bot, message, args, settings) => {
    if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);

    let type = args[0];
    let updated = args.slice(1).join(' ');
    let chan = message.mentions.channels.first() || message.guild.channels.get(updated);

    switch(type) {
    case 'category': {
      if(chan) {
        try {
          await bot.updateGuild( message.guild, { ticketCategory: chan.id} );
          return await message.channel.send(`Ticket category has been set to: **${chan.name}**`);
        } catch (error) {
          await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
      }else {
        try {
          await bot.updateGuild( message.guild, { $unset: { ticketCategory: ''} });
          return await message.channel.send('Ticket category disabled.');
        }catch (error) {
          await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
      }
      break;
    }
    case 'log': {
      if(chan) {
        try {
          await bot.updateGuild( message.guild, { ticketLog: chan.id} );
          return await message.channel.send(`Ticket channel has been set to: <#${chan.id}>`);
        } catch (error) {
          await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
      }else {
        try {
          await bot.updateGuild( message.guild, { $unset: { ticketLog: ''} });
          return await message.channel.send('Ticket channel disabled.');
        }catch (error) {
          await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
      }
      break;
    }
    case 'commands': {
      const ticket = new RichEmbed()
        .setColor(bot.config.yellow)
        .setDescription(`The bot prefix is: \`${settings.prefix}\`\n**------------------------------**\n${bot.commands.filter(c => c.config.category == 'ticket').map(c => `**${c.config.name}** | ${c.config.description}`).join('\n')}\n**------------------------------**\n`)
        .setFooter('< > is requiredand [ ] is optional');

      await message.channel.send(ticket);
      break;
    }
    default: {
      await message.channel.send('Please specify a ticket option.');
      break;
    }
    }
  }
};
// Help commmand with interactive menu.

const { RichEmbed } = require('discord.js');
const { Menu } = require('./../../utils/index');

module.exports = {
  config: {
    name: 'help',
    usage: 'help [command]`',
    description: 'This command but you knew that!',
    accessableby: 'Members',
    aliases: ['h', 'commands'],
    category: 'general'
  },
  run: async (bot, message, args, settings) => {

    try{
      if(!args[0]) {
        const howto = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\`\n\nUse the reactions below to navigate the menu. Click the ❔ to get a full explanation of how to use the help menu.`)
          .addField('How to use the Help Menu', `The reactions below allow you to navigate the help menu to each page. The following will explain what each reaction does.\n\n◀ - Go one page back\n▶ - Go one page forward\n❔ - Go to this page for help on using the menu\n⏹ - Stop the help on the current page. Reactions will no longer work.\n❌ - Stop the help and delete the message.\n1⃣ 2⃣ 3⃣ 4⃣ 5⃣ - Select a specific page according to the "Help Menu".\n\nKeep in mind that many commands have options and will not work on their own. Please run \`${settings.prefix}help command\` to get command specific help. For example \`${settings.prefix}help settings\``)
          .addField('__Help Menu__', '**1 ◇** General\n**2 ◇** Support\n**3 ◇** Admin\n**4 ◇** Tickets\n**5 ◇** Automation')
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');
  
        const general = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\`\n\nUse the reactions below to navigate the menu. Click the ❔ to get a full explanation of how to use the help menu.`)
          .addField('❯ General commands', `${bot.commands.filter(c => c.config.category == 'general').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n')}`)
          .addField('__Help Menu__', '**1 ◆** General\n**2 ◇** Support\n**3 ◇** Admin\n**4 ◇** Tickets\n**5 ◇** Automation')
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');
  
        const support = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\`\n\nUse the reactions below to navigate the menu. Click the ❔ to get a full explanation of how to use the help menu.`)
          .addField('❯ Support commands', bot.commands.filter(c => c.config.category == 'support').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n'))
          .addField('__Help Menu__', '**1 ◇** General\n**2 ◆** Support\n**3 ◇** Admin\n**4 ◇** Tickets\n**5 ◇** Automation')
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');
  
        const admin = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\`\n\nUse the reactions below to navigate the menu. Click the ❔ to get a full explanation of how to use the help menu.`)
          .addField('❯ Admin commands', bot.commands.filter(c => c.config.category == 'admin').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n'))
          .addField('__Help Menu__', '**1 ◇** General\n**2 ◇** Support\n**3 ◆** Admin\n**4 ◇** Tickets\n**5 ◇** Automation')
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');
  
        const ticket = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\`\n\nUse the reactions below to navigate the menu. Click the ❔ to get a full explanation of how to use the help menu.`)
          .addField('❯ Tickets commands', bot.commands.filter(c => c.config.category == 'ticket').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n'))
          .addField('__Help Menu__', '**1 ◇** General\n**2 ◇** Support\n**3 ◇** Admin\n**4 ◆** Tickets\n**5 ◇** Automation')
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');
  
        const automation = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\`\n\nUse the reactions below to navigate the menu. Click the ❔ to get a full explanation of how to use the help menu.`)
          .addField('❯ Automation Commands', bot.commands.filter(c => c.config.category == 'automation').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n'))
          .addField('__Help Desk Note__', 'The help desk responses will work without requiring the role, support channel or any custom messages.\nTo use the role correctly add a support channel.')
          .addField('__Help Menu__', '**1 ◇** General\n**2 ◇** Support\n**3 ◇** Admin\n**4 ◇** Tickets\n**5 ◆** Automation')
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');
  
        new Menu(message.channel, message.author.id, [howto, general, support, admin, ticket, automation]);
      }else if(args[0] == 'general') {
        const general = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\``)
          .addField('❯ General commands', `${bot.commands.filter(c => c.config.category == 'general').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n')}`)
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');

        await message.channel.send(general);
      }else if(args[0] == 'support') {
        const support = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\``)
          .addField('❯ Support commands', bot.commands.filter(c => c.config.category == 'support').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n'))
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');

        await message.channel.send(support);
      }else if(args[0] == 'admin'){
        const admin = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\``)
          .addField('❯ Admin commands', bot.commands.filter(c => c.config.category == 'admin').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n'))
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');

        await message.channel.send(admin);
      }else if(args[0] == 'ticket'){
        const ticket = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\``)
          .addField('❯ Tickets commands', bot.commands.filter(c => c.config.category == 'ticket').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n'))
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');

        await message.channel.send(ticket);
      }else if(args[0] == 'automation'){
        const automation = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\`\n\nFor command specific help type \`${settings.prefix}help <command>\` and to see only a specific category type \`${settings.prefix}help <category>\``)
          .addField('❯ Automation Commands', bot.commands.filter(c => c.config.category == 'automation').map(c => `**${c.config.name}** - ${c.config.description}\n-------------------`).join('\n'))
          .addField('__Help Desk Note__', 'The help desk responses will work without requiring the role, support channel or any custom messages.\nTo use the role correctly add a support channel.')
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');

        await message.channel.send(automation);
      }else {
        let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase());
        if(!command) return message.channel.send(`Invalid Command. Do \`${settings.prefix}help\` for the list of the commands.`);
        command = command.config;
        let embed = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`My prefix is: \`${settings.prefix}\``)
          .addField('Command', command.name)
          .addField('Description', `${command.description || 'No description'}`)
          .addField('Usage', `\`${settings.prefix}${command.usage || 'No usage'}`)
          .addField('Options', `${command.options || 'No options'}`)
          .addField('Accessible By', `${command.accessableby || 'Member'}`)
          .addField('Aliases', `${command.aliases || 'No aliases'}`)
          .setAuthor(`${bot.user.username}'s Help`, bot.user.displayAvatarURL)
          .setFooter('Anything in < > is required | Anything in [ ] is optional');
      
        return await message.channel.send(embed);
      }
    }catch(error){
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.stack}`);
      }catch(error) {
        return;
      }
    }
  }
};
// Used to pull up any snippets made

const { RichEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'snip',
    usage: 'snip <trigger>`',
    options: '`list` - List all the server snippets.',
    description: 'Use one of the server snippets.',
    accessableby: 'Member',
    aliases: ['s'],
    category: 'support'
  },
  run: async (bot, message, args, settings) => {
    if(settings.snipModule == false) return message.channel.send('Module disabled. Type `s!module snippets` to enable.');
    try{
      if(args[0] === 'list') {
        let snipDoc;

        try{
          snipDoc = await bot.getAllSnip(message.guild);
        } catch (error) {
          return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
    
        let embed = new RichEmbed();
        let arr = [];
        let list;

        for(var i = 0; i < snipDoc.length; i++) {
          arr.push(snipDoc[i].trigger.split(' '));

          try {
            list = arr.join('\n• ');
          } catch(error){
            list = `${bot.config.errMsg} \`${error.message}\``;
          }
        }
    
        embed.setColor(bot.config.yellow)
          .setTitle(`${message.guild.name} Snippet Responses`)
          .addField('------------------------------', `• ${list || 'None'}`)
          .addField('------------------------------', `To use a snippet \`${settings.prefix}snip trigger\``)
          .setTimestamp()
          .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);
    
        await message.channel.send(embed);    
      }

      let trigger = args[0];
      let snipDoc;

      try{
        snipDoc = await bot.getSnip(message.guild, trigger);
      } catch (error) {
        return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
      }

      if(!snipDoc) return;

      let embed = new RichEmbed()
        .setColor(bot.config.yellow)
        .setDescription(snipDoc.response)
        .setTimestamp()
        .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);

      if(snipDoc.trigger == trigger) {
        await message.channel.send(embed);
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
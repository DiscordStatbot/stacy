// A form of snippet system. Could be removed if not needed.

const { RichEmbed } = require('discord.js');

module.exports = { 
  config: {
    name: 'snippet',
    description: 'Setup snippet commands for quick access to info. [Has options]',
    usage: 'snippet <option>`',
    options: '`list` - List all Snippet triggers and responses\n`add` - Add a new snippet. Trigger must be a single word.\n**Usage:** `snippet add <trigger> <response>`\n\n`remove` - Remove a Snippet response\n**Usage:** `snippet remove <trigger>`',
    accessableby: 'Administrator',
    category: 'admin'
  },
  run: async (bot, message, args, settings) => {
    if(settings.snipModule == false) return message.channel.send('Module disabled. Type `s!module snippets` to enable.');
    try{
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);
      let update = args[0];
      let trigger = args[1];
      let check = message.content.split(' ').splice(3);

      let response = check.join(' ');

      switch (update) {
      case 'add': {
        let snipDoc;

        try{
          snipDoc = await bot.getAllSnip(message.guild);
        } catch (error) {
          return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
      
        let arr= [];

        for(let i = 0; i < snipDoc.length; i++){
          arr.push(snipDoc[i].trigger);

          if(arr[i] === trigger) {
            return await message.channel.send('This Snippet already exists.');
          }
        }


        if(!trigger && !response ) {
          await message.channel.send('Please provide a trigger and response.');
        }

        if(trigger && response) {

          const newSnip = {
            guildID: message.guild.id,
            trigger: trigger,
            response: response
          };
            
          try {
            await bot.createSnip(newSnip);
            await bot.updateGuild(message.guild, { $inc: {snipNum: 1} } );

            let aembed = new RichEmbed()
              .setColor(bot.config.green)
              .setDescription(`New Snippet Response created.\n\n**Trigger:** ${trigger}\n\n**Response:** ${response}`)
              .setTimestamp()
              .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);
            await message.channel.send(aembed);
          } catch (error) {
            return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }

        }
        break;
      }
      case 'remove': {
        if(!trigger){
          await message.channel.send('Please provide a trigger.');
        }

        if(trigger) {
          try{
            await bot.deleteSnip(message.guild, trigger);
            await bot.updateGuild(message.guild, { $inc: {snipNum: -1} } );
            await message.channel.send(`Snippet **${trigger}** has been deleted.`);
          } catch (error) {
            return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }

        break;
      }
      case 'list': {
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
          .addField('------------------------------', `To add a respone type \`${settings.prefix}snippet add trigger reasponse\`\nTo remove a response type \`${settings.prefix}snippet remove trigger\`\nTo check a specific responses reply type \`${settings.prefix}snip <trigger>\``)
          .setTimestamp()
          .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);
    
        await message.channel.send(embed);    
        break;
      }
      default: {
        await message.channel.send(`Please provide an option. You can check all options with \`${settings.prefix}snippet\` `);
      }
            
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
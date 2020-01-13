// Setup for the Auto Responder.

const { RichEmbed } = require('discord.js');

module.exports = { 
  config: {
    name: 'responder',
    description: 'Setup the auto responder. Stacy\'s auto responder is unique in the sense that it takes the entire question and breaks it into it\'s parts then matches all these words with in a sentence. [Has options]',
    usage: 'responder <option>`',
    options: '`list` - List all auto responses. Can take question as argument to check responses.\n**Usage:** `responder list | [question]`\n\n`exclude` and `include` - Exclude channels from having auto responses in. Use include to enable for the channel again.\n**Usage:** `responder exclude or include #channel`\n\n`add` - Add a auto response.\n**Usage:** `responder add | question | response`\n\n`remove` - Remove a auto response. We suggest checking the exact wording with the list command.\n**Usage:** `responder remove | question`\n',
    accessableby: 'Administrator',
    category: 'automation'
  },
  run: async (bot, message, args, settings, ignore) => {
    if(settings.autoModule == false) return message.channel.send('Module disabled. Type `s!module responder` to enable. Requires Admin');
    try{
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);
    
      let update = args[0];
      let check = message.content.split(' | ').slice(1);

      let question = check[0];
      let response = check[1];

      switch (update) {
      case 'stats': {
        let responderDoc;

        try{
          responderDoc = await bot.getAllResponse(message.guild);
        } catch (error) {
          return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }

        let embed = new RichEmbed()
          .setColor(bot.config.yellow)
          .setAuthor(`${message.guild.name} Auto Response Stats`, message.guild.iconURL)
          .setDescription(`${responderDoc.map(q => `**• Question** - \`${q.question}\`\n**• Usages** - \`${q.autoStat}\``).join('\n--------------\n') || 'No responses'}`)
          .setTimestamp()
          .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);
    
        await message.channel.send(embed);
        break;
      }
      case 'add': {
        if(!question || !response ) {
          await message.channel.send('Oopsie! You did not provide a question and response for me to add.');
        }

        let responderDoc;

        try{
          responderDoc = await bot.getAllResponse(message.guild);
        } catch (error) {
          return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
    
        let arr = [];

        for(let i = 0; i < responderDoc.length; i++){
          arr.push(responderDoc[i].question);

          if(arr[i] === question) {
            return await message.channel.send('It looks like I already have this response saved.');
          }
        }

        if(question.length > 125) return await message.channel.send('That\'s to long! Please only use 125 letters, numbers, symbols or spaces in your question');
        if(response.length > 1000) return await message.channel.send('That\'s to long! Please only use 1000 letters, numbers, symbols or spaces in your response');
        if(question && response) {

          const newResponder = {
            guildID: message.guild.id,
            question: question.toLowerCase(),
            response: response,
            autoStat: 0

          };
            
          try {
            await bot.createResponse(newResponder).then( async () => {
              await bot.updateGuild(message.guild, { $inc: {autoNum: 1} } );
            });

            let aembed = new RichEmbed()
              .setColor(bot.config.green)
              .setDescription(`I have saved your auto response!\n\n**Question:** ${question}\n\n**Response:** ${response}`)
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
        if(!question){
          await message.channel.send('You didn\'t provide a question.');
        }

        if(question) {
          try{
            await bot.deleteResponse(message.guild, question).then( async () => {
              await bot.updateGuild(message.guild, { $inc: {autoNum: -1} } );
            });

            let aembed = new RichEmbed()
              .setColor(bot.config.green)
              .setDescription(`I have removed your auto response!\n\n**Question:** ${question}`)
              .setTimestamp()
              .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);
            await message.channel.send(aembed);
          } catch (error) {
            return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }

        break;
      }
      case 'exclude': {
        let chan = message.mentions.channels.first() || message.guild.channels.get(args[1]);
        if(!ignore.responseExclude.includes(chan.id) && chan) {
          try {
            await bot.updateIgnore( message.guild.id, {$addToSet: { responseExclude: chan.id }});
            await message.channel.send(`Auto responder has been disabled for: **${chan.name}**`);
          } catch (error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }else {
          await message.channel.send('Channel already excluded.');
        }

        break;
      }
      case 'include': {
        let chan = message.mentions.channels.first() || message.guild.channels.get(args[1]);
        if(ignore.responseExclude.includes(chan.id) && chan) {
          await bot.updateIgnore( message.guild.id, {$pull: { responseExclude: chan.id }});
          await message.channel.send(`Auto responder has been enabled for: **${chan.name}**`);
        }else {
          await message.channel.send('Channel already included.');
        }

        break;
      }
      case 'list': {
        let responderDoc;

        try{
          responderDoc = await bot.getAllResponse(message.guild);
        } catch (error) {
          return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
    
        let arr = [];
        let embed = new RichEmbed()
          .setColor(bot.config.yellow)
          .setTimestamp()
          .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);

        let list;
        if(!args[1]){
          for(var i = 0; i < responderDoc.length; i++) {
            arr.push(responderDoc[i].question);
            try {
              list = arr.join('\n• ');
            } catch(error){
              list = `${bot.config.errMsg} \`${error.message}\``;
            }
          }
    
          embed.setTitle(`${message.guild.name} Help responder Questions`)
            .addField('------------------------------', `• ${list || 'None'}`)
            .addField('------------------------------', `To check a Question's response type \`${settings.prefix}responder list | question\`\nTo add a respone type \`${settings.prefix}responder add | question | reasponse\`\nTo remove a response type \`${settings.prefix}responder remove | question\``);
    
          await message.channel.send(embed);  
        }else {
          let responderQuestion;

          try{
            responderQuestion = await bot.getResponse(message.guild, question);
          } catch (error) {
            return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }

          try{
            embed.setTitle(`${question}`)
              .setDescription(responderQuestion.response);

            await message.channel.send(embed);  
          }catch (error) {
            return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
        }  
        break;
      }
      default: {
        await message.channel.send(`Did you want me to do something?\n\nCheck all the options with \`${settings.prefix}help responder\``);
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
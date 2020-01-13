// Setup for the Help Desk system. There is a lot that is happening in this file and should be carefullyy studied.

const { RichEmbed } = require('discord.js');

module.exports = { 
  config: {
    name: 'desk',
    description: 'Setup a help desk. This serves as a self-help option for users in your server so that your staff can focus on more important stuff. [Has options.]',
    usage: 'desk <option> <#channel or ID> | [question] | [response]`\n*This command requires the mention of a channel to always be present except for the list command.*`',
    options: '`list` - Lists questions for mentioned channel\n\n`info` - Check the settings of the help desk\n\n`stats` - Shows the usage stats of the help desk\n\n`create` - Create a help desk\n\n`delete` - Delete a help desk\n\n`support` - Set your support channel for the help desk\n**Usage:** `desk support #helpdesk #support`\n\n`deskMessage` - Set a custom info message for the help desk\n**Usage:** `desk deskMessage #channel | message`\n\n`roleMessage` - Set a custom info message for the help desk default role\n**Usage:** `desk roleMessage #channel | message`\n\n`color` - Set a custom embed color for your help desk\n**Usage:** `desk color #channel #color`\n\n`role` - Set a custom help role for your help desk\n**Usage:** `desk role #channel @role`\n\n`add` - Add a question and response\n**Usage:** `desk add #channel | question | answer`\n\n`remove` - Remove a question\n**Usage:** `desk remove #channel | question`\n\n`setup` - Setup the help desk\n\n`update` - Update the help desk message`',
    accessableby: 'Administrator',
    category: 'automation'
  },
  run: async (bot, message, args, settings) => {
    if(settings.deskModule == false) return message.channel.send('Module disabled. Type `s!module desk` to enable. Requires Admin');
    try{
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);
      if(args[0] == 'list'){
        let allHelpDesk;
        try{
          allHelpDesk = await bot.getAllDesk(message.guild);
        }catch (error){
          return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
        if(!allHelpDesk) return message.channel.send('There is no help desks setup for this server');
      
        let desk = [];
        let dList;
        for(let n = 0; n < allHelpDesk.length; n++) {
          desk.push(`<#${allHelpDesk[n].deskChannel}>`);
          dList = desk.join('\n');
        }

        let embed = new RichEmbed()
          .setColor(bot.config.yellow)
          .setDescription(`Help Desk Channels for **${message.guild.name}**\n**---------------------------------**\n${dList}\n**---------------------------------**`);
     
        await message.channel.send(embed);
      }else {

        let hdChan = message.guild.channels.get(args[1]) || message.mentions.channels.first();
        let updated = args[0];
        if(!hdChan) return message.channel.send(`Incorrect command usage. Check command help with \`${settings.prefix}help desk\``);
      
        let check = message.content.split(' | ').slice(1);
        let question = check[0];
        let response = check[1];

        let helpDesk;
        try{
          helpDesk = await bot.getDesk(hdChan);
        }catch (error){
          console.error(` [ERROR] ${error.stack}`);
        }

        switch(updated){
        case 'stats': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);

          let embed = new RichEmbed()
            .setColor(bot.config.yellow)
            .setAuthor(`${hdChan.name} Stats`, message.guild.iconURL)
            .setDescription(`${helpDesk.qar.map(q => `**• Question** - \`${q.question}\`\n**• Usages** - \`${q.deskStat}\``).join('\n--------------\n') || 'No responses'}`)
            .setTimestamp()
            .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);
  
          await message.channel.send(embed);
  
          break;
        }
        case 'create': {
          if(!helpDesk){
            const newDesk = {
              guildID: message.guild.id,
              deskChannel: hdChan.id,
            };

            await bot.createDesk(newDesk);
            await bot.updateGuild(message.guild, { $inc: { deskChan: +1 } });
            await message.channel.send(`New Help Desk created <#${hdChan.id}>`);
          }else {
            return await message.channel.send('That Help Desk is already saved!');
          }
          break;
        }
        case 'delete': {
          if(helpDesk) {
            await bot.deleteDesk(hdChan);
            await bot.updateGuild(message.guild, { $inc: { deskChan: -1 } });
            await message.channel.send(`Help desk deleted <#${hdChan.id}>`);
          }else {
            return await message.channel.send('That Help Desk is already deleted!');
          }
          break;
        }
        case 'deskMessage': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);

          if(question) {
            try{
              await bot.updateDesk(hdChan, { deskMsg: question });
              await message.channel.send(`Saved Help Desk info message as:\n\n\`${question}\``);
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            try{
              await bot.updateDesk(hdChan, {$unset: { deskMsg: '' }});
              await message.channel.send('Removed custom help desk message. Please run the setup command again.');
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'roleMessage': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);

          if(question) {
            try{
              await bot.updateDesk(hdChan, { roleMsg: question });
              await message.channel.send(`Saved Help Desk role message as:\n\n\`${question}\``);
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            try{
              await bot.updateDesk(hdChan, {$unset: { roleMsg: '' }});
              await message.channel.send('Removed custom help desk role message.');
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'color': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);
          if(args[2]){
            if(!args[2].startsWith('#')) return message.channel.send('Please provide a color as a hex code.');

            try{
              await bot.updateDesk(hdChan, { deskColor: args[2] });
              await message.channel.send(`Saved Help Desk Color as: \`${args[2]}\``);
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            try{
              await bot.updateDesk(hdChan, {$unset: { deskColor: '' }});
              await message.channel.send('Help Desk Color has been set to default');
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'role': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);
          let role = message.mentions.roles.first() || message.guild.roles.get(args[2]);      
          if(role) {
            try{
              await bot.updateDesk(hdChan, { defaultRole: role.id });
              await message.channel.send(`Saved Default Help Desk Role as: \`${role.name}\``);
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            try{
              await bot.updateDesk(hdChan, {$unset: { defaultRole: '' }});
              await message.channel.send('Default help role disabled.');
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'support': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);
          let sChan = message.mentions.channels.last() || message.guild.roles.get(args[2]);      
          if(sChan) {
            try{
              await bot.updateDesk(hdChan, { supportChannel: sChan.id });
              await message.channel.send(`Saved Support channel for Help Desk as: <#${sChan.id}>`);
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }else {
            try{
              await bot.updateDesk(hdChan, {$unset: { supportChannel: '' }});
              await message.channel.send('Disabled Support channel.');
            }catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'setup': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);

          let helpDoc = helpDesk.qar;
          let q = [];
          let list;
          for(let i = 0; i < helpDoc.length; i++){
            q.push(`**${i+1}. ${helpDoc[i].question}**`);
            list = q.join('\n\n');
          }

          let defColor = bot.config.yellow;

          let embed = new RichEmbed()
            .setColor(helpDesk.deskColor || defColor);

          if(helpDesk.deskMsg){
            embed.setDescription(`${helpDesk.deskMsg}\n**---------------------------------**\n${list}\n**---------------------------------**`);
            hdChan.send(embed).then(async m => {
              await bot.updateDesk(hdChan, {deskMsgID: m.id} );
              if(helpDesk.defaultRole) {
                await m.react('❓');
              }
            });
          }else {
            let defMsg;
            if(helpDesk.defaultRole){
              defMsg = `Reply with the number that corresponds to your question.\nIf you need more help click the ❓ reaction to get further assistance.\n**---------------------------------**\n${list}\n**---------------------------------**`;
            }else{
              defMsg = `Reply with the number that corresponds to your question.\n**---------------------------------**\n${list}\n**---------------------------------**`;
            }
            embed.setDescription(defMsg);
            await message.react('✔');
            hdChan.send(embed).then(async m => {
              await bot.updateDesk(hdChan, {deskMsgID: m.id} );
              if(helpDesk.defaultRole) {
                await m.react('❓');
              }
            });
          }
          break;
        }
        case 'update': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);
          if(!helpDesk.deskMsgID) return message.channel.send('You must run the setup command first');

          let helpDoc = helpDesk.qar;
          let q = [];
          let list;
          for(let i = 0; i < helpDoc.length; i++){
            q.push(`**${i+1}. ${helpDoc[i].question}**`);
            list = q.join('\n\n');
          }

          let defColor = bot.config.yellow;

          let embed = new RichEmbed()
            .setColor(helpDesk.deskColor || defColor);

          if(helpDesk.deskMsg){
            let hdMsg = `${helpDesk.deskMsg}\n**---------------------------------**\n${list || 'None'}\n**---------------------------------**`;
            embed.setDescription(hdMsg);
            hdChan.fetchMessage(helpDesk.deskMsgID).then(async m =>{
              await m.edit(embed);
            });
          }else {
            let defMsg;
            if(helpDesk.defaultRole){
              defMsg = `Reply with the number that corresponds to your question.\nIf you need more help click the ❓ reaction to get further assistance.\n**---------------------------------**\n${list || 'None'}\n**---------------------------------**`;
            }else{
              defMsg = `Reply with the number that corresponds to your question.\n**---------------------------------**\n${list || 'None'}\n**---------------------------------**`;
            }
            embed.setDescription(defMsg);
            hdChan.fetchMessage(helpDesk.deskMsgID).then(async m =>{
              await m.edit(embed);
            });
          }
          await message.react('✔');
          break;
        }
        case 'info': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);
        
          let embed = new RichEmbed()
            .setColor(helpDesk.deskColor || bot.config.yellow)
            .setTitle(`Information for ${hdChan.name}`)
            .setDescription(`**Support Channel:** ${`<#${helpDesk.supportChannel}>` || 'None'}\n\n**Role:** ${`<@&${helpDesk.defaultRole}>` || 'None'}\n\n**Color:** ${helpDesk.deskColor || 'Default'}\n\n*Help Desk color is set as this embeds color.*\n**------------------------------**`)
            .addField('Help Desk Message', `${helpDesk.deskMsg || 'Default Message'}`)
            .addField('Help Role Message', `${helpDesk.roleMsg || 'Default Message'}\n**------------------------------**`);
        
          await message.channel.send(embed);
          break;
        }
        case 'list': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);
          let embed = new RichEmbed();
          let helpDoc = helpDesk.qar;

          if(question) {
            let qAr = helpDoc.filter(q => q.question == question).map(m => `**${m.question}**\n\n${m.response}`);

            embed.setDescription(qAr);
            return await message.channel.send(embed);
          }else {
            let q = [];
            let list;
  
            for(let i = 0; i < helpDoc.length; i++){
              q.push(helpDoc[i].question);
              list = q.join('\n• ');
  
            }
  
            embed.setDescription(`Help Desk Responses for <#${hdChan.id}>\n**---------------------------------**\n• ${list || 'None'}\n**---------------------------------**`);
            await message.channel.send(embed);
            break;
          }

        }
        case 'add': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);
          if(!question || !response ) {
            return await message.channel.send('Oopsie! You did not provide a question and response for me to add.');
          }

          for(let i = 0; i < helpDesk.qar.length; i++){
            if(helpDesk.qar[i].question == question) {
              return await message.channel.send('This response already exists!');
            }
          }
          if(helpDesk.deskNum == 10) return message.channel.send('You can only add 10 questions to a help desk.');
          try{
            await bot.updateDesk(hdChan, {$push: { qar:  [{ question: question, response: response }]} });
            await bot.updateDesk(hdChan, { $inc: {deskNum: +1} });
            let aembed = new RichEmbed()
              .setColor(bot.config.green)
              .setDescription(`I have saved your help desk response for <#${hdChan.id}>\n**If you have already setup the help desk message please run the edit command to update the current message.**\n\n**Question:** ${question}\n\n**Response:** ${response}`)
              .setTimestamp()
              .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);
            await message.channel.send(aembed);
          }catch (error) {
            return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
          break;
        }
        case 'remove': {
          if(!helpDesk) return message.channel.send(`There is no help desk setup for this channel. Please setup the help desk with \`${settings.prefix}desk <#channel or ID> create\``);
          if(!question) {
            return await message.channel.send('Oopsie! You did not provide a question to remove.');
          }

          for(let i = 0; i < helpDesk.qar.length; i++){
            if(!helpDesk.qar[i].question == question) {
              return await message.channel.send('This response is already deleted!');
            }
          }

          try{
            await bot.updateDesk(hdChan, {$pull: { qar:  { question: question}} }, { multi: true });
            await bot.updateDesk(hdChan, { $inc: {deskNum: -1} });
            let aembed = new RichEmbed()
              .setColor(bot.config.green)
              .setDescription(`I have removed your help desk response for <#${hdChan.id}>\n**If you have already setup the help desk message please run the edit command to update the current message.**\n\n**Question:** ${question}`)
              .setTimestamp()
              .setFooter('Brought to you by Stacy', bot.user.displayAvatarURL);
            await message.channel.send(aembed);
          }catch (error) {
            return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }
          break;
        }
        default: {
          await message.channel.send(`Incorrect command usage. Check command help with \`${settings.prefix}help desk\``);
        }
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
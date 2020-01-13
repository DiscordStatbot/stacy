const { RichEmbed, Attachment } = require('discord.js');
const ms = require('ms');

module.exports = async (bot, reaction, user) => {
  try{
    if(!user) return;
    if(user.bot) return;
    let member = await reaction.message.guild.members.get(user.id);
    if(!member) return;
    // Feature system for Statbot server. Have not implemented this into the DB. For open source this section needs to be deleted.
    if(reaction.message.channel.id == '590650996137525254'){
      let contentArray = reaction.message.content.split('\n');
      let userIdent = contentArray[1];

      if(reaction._emoji.name == '🚫'){
        reaction.message.delete(5000);
      }
      if(reaction._emoji.name == '🇫') {
        reaction.message.react('✔');

        let feedMsg = reaction.message.content;
        let featFeed = reaction.message.guild.channels.get('590652963622486037');
        featFeed.send(feedMsg).then(async () => {
          const feature = new Attachment('./assets/feature.png', 'feature.png');

          let embed = new RichEmbed()
            .setColor(bot.config.green)
            .attachFile(feature)
            .setThumbnail('attachment://feature.png')      
            .setTitle('Feature Request')
            .setDescription(feedMsg)
            .setTimestamp();

          let submitFeed = reaction.message.guild.channels.get('590651196981903365');
          submitFeed.send(embed).then(async m => {
            await m.react('591223779154460718');
            try{
              await bot.updateFeed(userIdent, { messageID: m.id });
            }catch(error) {
              console.log(error.stack);
            }
          });
        });
      }
      if(reaction._emoji.name == '🇧') {
        reaction.message.react('✔');
        let feedMsg = reaction.message.content;
        let botFeed = reaction.message.guild.channels.get('590651024587358209');
        botFeed.send(feedMsg).then(async () => {
          const robot = new Attachment('./assets/bot.png', 'bot.png');

          let embed = new RichEmbed()
            .setColor(bot.config.green)
            .attachFile(robot)
            .setThumbnail('attachment://bot.png')      
            .setTitle('Bot Feature Request')
            .setDescription(feedMsg)
            .setTimestamp();

          let submitFeed = reaction.message.guild.channels.get('590651196981903365');
          submitFeed.send(embed).then(async m => {
            await m.react('591223779154460718');
            try{
              await bot.updateFeed(userIdent, { messageID: m.id });
            }catch(error) {
              console.log(error.stack);
            }

          });
        });
      }
      if(reaction._emoji.name == '🇸') {
        reaction.message.react('✔');
        let feedMsg = reaction.message.content;
        let siteFeed = reaction.message.guild.channels.get('590651053926776832');
        siteFeed.send(feedMsg).then(async () => {
          const site = new Attachment('./assets/site.png', 'site.png');

          let embed = new RichEmbed()
            .setColor(bot.config.green)
            .attachFile(site)
            .setThumbnail('attachment://site.png')      
            .setTitle('Site Feature Request')
            .setDescription(feedMsg)
            .setTimestamp();

          let submitFeed = reaction.message.guild.channels.get('590651196981903365');
          submitFeed.send(embed).then(async m => {
            await m.react('591223779154460718');
            try{
              await bot.updateFeed(userIdent, { messageID: m.id });
            }catch(error) {
              console.log(error.stack);
            }
          });
        });
      }
    }

    if(reaction._emoji.name == '✅' && reaction.message.channel.id == '590651196981903365') {
      let feedDoc;
      try {
        feedDoc = await bot.getFeed(reaction.message.id);
      }catch(error){
        return console.log(error.stack);
      }

      let embed = new RichEmbed()
        .setColor(bot.config.green)
        .setTitle('Completed Feature')
        .setDescription(feedDoc.response);

      let compChan = reaction.message.guild.channels.get('624552601614024704');
      compChan.send(`<@${feedDoc.userID}>`,embed);
      try{
        await bot.completeFeed(feedDoc.messageID, { completed: true });
      }catch(error){
        console.log(error.stack);
      }
    }

    // Help desk role reaction.
    if(reaction._emoji.name == '❓'){
      let deskDoc;
      try{
        deskDoc = await bot.getDesk(reaction.message.channel);
      }catch (error) {
        console.error(` [ERROR] ${error.stack}`);
      }
      if(deskDoc && deskDoc.deskChannel == reaction.message.channel.id && deskDoc.defaultRole) {
        let helpRole = reaction.message.guild.roles.get(deskDoc.defaultRole);
        const newTimer = {
          guildID: reaction.message.guild.id,
          userID: member.id,
          roleID: deskDoc.defaultRole,
          time: Date.now() + ms('1d')
        };
        try{
          await bot.createTimer(newTimer);

          try{
            await member.addRole(helpRole.id);
          }catch(error){
            console.error(` [ERROR] ${error.stack}`);
          }
          if(deskDoc.supportChannel){
            let sChan = reaction.message.guild.channels.get(deskDoc.supportChannel);
            let rMsg = deskDoc.roleMsg || 'You have been given access to this servers support channel(s) to request further help.';
            sChan.send(`<@${member.id}> ${rMsg}`)
              .then(async m => {
                try{
                  m.delete(30000);
                }catch(error) {
                  return;
                }
              });
          }else{
            let rMsg = deskDoc.roleMsg || 'You have been given access to this servers support channel(s) to request further help.';
            reaction.message.channel.send(rMsg)
              .then(async m => {
                m.delete(15000);
              });
          }
        }catch(error) {
          console.error(` [ERROR] ${error.stack}`);
        }
      }
    }

    // Reaction Role system. Requires work.
    let emoji = await bot.emojis.get(reaction._emoji.id) || reaction._emoji.name;
    let reactRole;
    try {
      reactRole = await bot.roleReact(emoji);
    }catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if(!reactRole) return;
    let role = await reaction.message.guild.roles.get(reactRole.roleID);
    if(!role) return;

    if(reaction.message.id === reactRole.messageID) {
      if(member.roles.has(role.id)) return;
      await member.addRole(role.id);
    }
  }catch(error){
    return console.log(`[ERROR] ${error.stack}`);
  }
};
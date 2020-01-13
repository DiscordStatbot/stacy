// Controls the entire help desk response system.

const { RichEmbed } = require('discord.js');

module.exports = async (bot, message, settings) => {
  try{
    if(!settings) return;
    if(settings.deskModule == false) return;
    if(message.author.bot || !message.guild) return;

    let hdChan = message.channel;

    let deskDoc;
    try{
      deskDoc = await bot.getDesk(hdChan);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if(!deskDoc) return;
  
    if(hdChan.id == deskDoc.deskChannel) {
      message.delete(5000);
    }

    if(bot.cooldown.has(message.author.id) && hdChan.id == deskDoc.deskChannel) return;

    if(hdChan.id == deskDoc.deskChannel) {
      bot.cooldown.add(message.author.id);
      setTimeout(() => {
        bot.cooldown.delete(message.author.id);
      }, 5000);
    }

    let eColor = bot.config.yellow;

    let embed = new RichEmbed()
      .setTimestamp()
      .setColor(deskDoc.deskColor || eColor)
      .setThumbnail(message.guild.iconURL);
        
    if(message.content === '1' && deskDoc.qar[0] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.0.deskStat': +1  }});
      embed.setDescription(deskDoc.qar[0].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '2' && deskDoc.qar[1] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.1.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[1].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '3' && deskDoc.qar[2] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.2.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[2].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '4' && deskDoc.qar[3] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.3.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[3].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '5' && deskDoc.qar[4] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.4.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[4].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '6' && deskDoc.qar[5] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.5.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[5].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '7' && deskDoc.qar[6] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.6.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[6].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '8' && deskDoc.qar[7] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.7.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[7].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '9' && deskDoc.qar[8] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.8.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[8].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
    if(message.content === '10' && deskDoc.qar[9] && hdChan.id == deskDoc.deskChannel) {
      await bot.updateDesk(hdChan, { $inc: { 'qar.9.deskStat': +1 } });
      embed.setDescription(deskDoc.qar[9].response);
      message.channel.send(embed).then(r => r.delete(120 * 1000));
    }
  }catch(error){
    return;
  }
};
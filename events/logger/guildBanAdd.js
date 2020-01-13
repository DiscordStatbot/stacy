// Triggers the logging if it is setup.

const { RichEmbed, Attachment } = require('discord.js');

module.exports = async (bot, guild, user) => { 
  try{
    let settings;
    try {
      settings = await bot.getGuild(guild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if(!settings) return;
    if(settings.loggingModule == false) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if(!ignore) return;
    if(ignore.modLog == false) return;

    if(!settings.modChannel) return;

    let mlogs = guild.channels.get(settings.modChannel);

    const ban = new Attachment('./assets/ban.png', 'ban.png');

    try{

      let embed = new RichEmbed()
        .setColor(bot.config.red)
        .setTitle('User Banned')
        .attachFile(ban)
        .setThumbnail('attachment://ban.png')
        .setDescription(`**User Name:** \`${user.username}\`\n**User ID:** \`${user.id}\``)
        .setFooter(`Mod logs of ${guild.name}`, guild.iconURL)
        .setTimestamp();
        
      await mlogs.send(embed);
    }catch (error) {
      return;
    }
  }catch(erro){
    return;
  }
};
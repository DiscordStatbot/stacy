// Triggers the logging if it is setup.

const { RichEmbed, Attachment } = require('discord.js');

module.exports = async (bot, role) => {
  try{

    let settings;
    try {
      settings = await bot.getGuild(role.guild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if(!settings) return;
    if(settings.loggingModule == false) return;
    let ignore;
    try {
      ignore = await bot.getIgnore(role.guild.id);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
    if(!ignore) return;
    if(ignore.roleLog == false) return;

    if(!settings.serverChannel) return;

    let slog = role.guild.channels.get(settings.serverChannel);
  
    const delrole = new Attachment('./assets/delrole.png', 'delrole.png');
  
    try{
      let embed = new RichEmbed()
        .setColor(bot.config.red)
        .setTitle('Role Deleted')
        .attachFile(delrole)
        .setThumbnail('attachment://delrole.png')
        .setDescription(`**Name:** \`${role.name}\`\n\n**ID:** \`${role.id}\``)
        .setFooter(`Role logs for ${role.guild.name}`, role.guild.iconURL)
        .setTimestamp();

      await slog.send(embed);
    }catch (error) {
      return;
    }

    let roleDoc;
    try {
      roleDoc = await bot.getJoin(role);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }

    if(!roleDoc) return;

    if (roleDoc && roleDoc.roleID === role.id ) {
      try{
        await bot.deleteJoin(role);
      } catch(error){
        console.error(` [ERROR] ${error.stack}`);
      }
    }
  }catch(erro){
    return;
  }
};
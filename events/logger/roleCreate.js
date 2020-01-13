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
  
    const rols = new Attachment('./assets/role.png', 'role.png');
  
    try{
      let embed = new RichEmbed()
        .setColor(bot.config.green)
        .setTitle('Role Created')
        .attachFile(rols)
        .setThumbnail('attachment://role.png')
        .setDescription(`**Name:** \`${role.name}\`\n\n**ID:** \`${role.id}\``)
        .setFooter(`Role logs for ${role.guild.name}`, role.guild.iconURL)
        .setTimestamp();

      await slog.send(embed);
    }catch (error) {
      return;
    }
  }catch(erro){
    return;
  }
};
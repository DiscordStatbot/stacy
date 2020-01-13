// Triggers on user join and leave when setup.

const { RichEmbed, Attachment } = require('discord.js');

module.exports = async (bot, member) => {
  try{ 
    let settings;
    try {
      settings = await bot.getGuild(member.guild);
    } catch (error) {
      return;
    }
    if(!settings) return;
    if(settings.welcomeModule == false) return;
    if(settings.welcomeChannel && settings.welcomeMessage && !member.user.bot) {
      try {
        var msg = settings.welcomeMessage.replace('{user}', `<@${member.id}>`);
        var chan = member.guild.channels.get(settings.welcomeChannel);
        let color = settings.welcomeColor || bot.config.green;
        let attach;

        let embed = new RichEmbed()
          .setTitle(`User joined ${member.guild.name}`)
          .setColor(color)
          .setThumbnail(member.user.displayAvatarURL)
          .setDescription(msg)
          .setFooter(`Member Count: ${member.guild.memberCount}`, member.guild.iconURL)
          .setTimestamp();
      
        if(settings.welcomePing == true){
          if(settings.welcomeImage) {
            attach = new Attachment(`./welcomeImages/${settings.welcomeImage}`);
            embed.attachFile(attach)
              .setImage(`attachment://${settings.welcomeImage}`);

            chan.send(`<@${member.id}>`, embed);
          }else{
            chan.send(`<@${member.id}>`, embed);
          }
        }else {
          if(settings.welcomeImage) {
            attach = new Attachment(`./welcomeImages/${settings.welcomeImage}`);
            embed.attachFile(attach)
              .setImage(`attachment://${settings.welcomeImage}`);

            chan.send(embed);
          }else{
            chan.send(embed);
          }
        }
      } catch (error) {
        return;
      }
    }
    
    if(settings.welcomeRole && !member.user.bot) {
      try {
        member.addRole(settings.welcomeRole);
      } catch (error) {
        return;
      }
    }
  }catch(error){
    return;
  }
};
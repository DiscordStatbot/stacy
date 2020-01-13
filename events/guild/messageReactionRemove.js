module.exports = async (bot, reaction, user) => {
  try{
    if(!user) return;

    if(user.bot) return;
    let member = await reaction.message.guild.members.get(user.id);
    // Help desk role removal
    if(reaction._emoji.name == '❓'){
      let deskDoc;
      try{
        deskDoc = await bot.getDesk(reaction.message.channel);
      }catch (error) {
        console.error(` [ERROR] ${error.stack}`);
      }
      if(deskDoc && deskDoc.defaultRole && member.roles.has(deskDoc.defaultRole)) {
        let helpRole = reaction.message.guild.roles.get(deskDoc.defaultRole);
        try{
          await bot.deleteTimer(reaction.message.guild, member.id);
          await member.removeRole(helpRole.id);
        }catch(error) {
          console.error(` [ERROR] ${error.stack}`);
        }
      }
    }

    // Reaction role removal.
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
      if(!member.roles.has(role.id)) return;
      await member.removeRole(role.id);
    }
  }catch(error){
    return;
  }
};
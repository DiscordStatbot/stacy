// Triggered everytime a message is sent in a server. Checks the timers saved in the DB and if they have run out removes the associated role from the user and deletes the timer.

module.exports = async (bot, message) => {
  let timerDoc;
  try{
    timerDoc = await bot.getAllTimer(message.guild);
  }catch (error) {
    console.error(` [ERROR] ${error.stack}`);
  }
    
  let guild = message.guild;
  if(!timerDoc) return;
  for(let i = 0; i < timerDoc.length; i++) {
    if(timerDoc[i].time <= Date.now()){  
      let user = await guild.members.get(timerDoc[i].userID);
      let role = await guild.roles.get(timerDoc[i].roleID);
      if(!user || !user.roles.has(role.id)) {
        await bot.deleteNoTimer(guild, timerDoc[i].userID);
      }else if(user) {
        await bot.deleteTimer(guild, user.id);
        await user.removeRole(role.id);
      }
    }
  }
};
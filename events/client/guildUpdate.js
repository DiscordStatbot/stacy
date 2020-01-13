// This is to check if the owner changes of a guild and update it in the DB. In open source this is still used, but the owner has to be changed in the config file too.

module.exports = async (bot, oldGuild, newGuild) => {
  let settings;
  try {
    settings = await bot.getGuild(oldGuild);
  } catch (error) {
    console.error(` [ERROR] ${error.stack}`);
  }
  if(!settings) return;

  if(oldGuild.ownerID == newGuild.ownerID) return;

  try{
    await bot.uodateGuild(oldGuild, { ownerID: newGuild.ownerID});
  }catch(error){
    console.log(error.stack);
  }
};
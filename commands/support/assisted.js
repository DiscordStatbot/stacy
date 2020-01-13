// Used to remove the help desk role from a user and deletes the timer entry in the DB. Can take a time as argument to delay the removal of the role.

const ms = require('ms');

module.exports = {
  config: {
    name: 'assisted',
    usage: 'assisted <@user or user ID> [time in m h d format]`',
    description: 'Remove the help role from a user who has been assisted. Requires help desk role to be setup.',
    accessableby: 'Support',
    category: 'support'
  },
  run: async (bot, message, args, settings) => {
    try{

      if(!settings.supportRole) return await message.channel.send(`Please setup the admin or support or mod role with the \`${settings.prefix}settings\` command`);
      if(!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.supportRole) && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need this servers \`Support\` or \`Admin\` role to perform this action.`);
    
      let user = message.mentions.members.first() || message.guild.members.get(args[0]); 
      if(!user) return await message.channel.send('Please specify a user by mention or ID');
      let time = args[1];

      let timerDoc;
      try{
        timerDoc = await bot.getTimer(message.guild, user.id);
      } catch (error) {
        return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
      }

      let role = message.guild.roles.get(timerDoc.roleID);
      if(!role) return message.channel.send('No help desk role set up');
      if(time && time.match(/[0-9]+d?h?m?/g) && timerDoc.userID === user.id && user.roles.has(role.id)) {
        await bot.updateTimer(message.guild, user.id, { time: ms(time) });
        await message.channel.send(`Removing help role from **${user.user.username}** in \`${time}\``);
        setTimeout(async () => {
          try{
            await bot.deleteTimer(message.guild, user.id);
            return await user.removeRole(role.id);
          }catch(error){
            return;
          }
        }, ms(time));
      }else if(!time && timerDoc.userID === user.id && user.roles.has(role.id)) {
        await bot.deleteTimer(message.guild, user.id);
        await user.removeRole(role.id);
        return await message.channel.send(`**${user.user.username}** has been assisted.`);
      }else {
        return await message.channel.send(`**${user.user.username}** does not have the help role.`);
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
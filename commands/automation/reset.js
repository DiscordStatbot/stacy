// For resetting the stats of the help desk and auto responder.

module.exports = { 
  config: {
    name: 'reset',
    usage: 'reset <option>`',
    options: '`auto responder` - Resets all stats of the Auto Responder\n`help desk` - Resets all stats of the Help Desk responses. Mention a channel to reset.',
    description: 'Reset the stats of the auto responder or help desk responder',
    accessableby: 'Administrator',
    category: 'automation'
  },
  run: async (bot, message, args, settings) => {
    if(settings.deskModule == false && settings.autoModule == false) return message.channel.send('Module disabled. Type `s!module desk or responder` to enable. Requires Admin');
    try{
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);

      let i = 0;

      if(args.join(' ') == 'auto responder'){
        let responderDoc;

        try{
          responderDoc = await bot.getAllResponse(message.guild);
        } catch (error) {
          return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
        if(!responderDoc) return await message.channel.send('No stats to reset');

        for(i; i < responderDoc.length; i++) {
          await bot.updateResponse(message.guild, responderDoc[i].question, {$set: { autoStat: 0 }});
        }
        await message.channel.send('Auto response stats deleted. Can\'t go back now!');
      }
      if(args[0] == 'help' && args[1] == 'desk'){
        let chan = message.guild.channels.get(args[0]) || message.mentions.channels.first();
        if(!chan) return await message.channel.send('Please specify a channel');
        let deskDoc;
      
        try{
          deskDoc = await bot.getDesk(chan);
        } catch (error) {
          return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
        }
        if(!deskDoc) return message.channel.send('No stats to reset');
      
        for(i; i < deskDoc.qar.length; i++) {
          await bot.resetDeskStat(chan);
        }
        await message.channel.send('Help Desk response stats deleted. Can\'t go back now!');
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
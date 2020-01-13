// For creating embed messages. Needs work.

const { RichEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'embed',
    description: 'Send an embed message to the specified channel.',
    usage: 'embed <#channel or ID> <color> [body]`\nCan upload image with command to add image.',
    category: 'admin',
    accessableby: 'Administrator',
    aliases: ['say', 'announcement']
  },
  run: async (bot, message, args, settings) => {
    try{
      if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);

      let chan = message.mentions.channels.first() || message.guild.channels.get(args[0]);
      let color = args[1];
      let image = message.attachments.first();
      let body = args.slice(2).join(' ');

      let embed = new RichEmbed();
    
      if(!args) return message.channel.send('Please specify a channel, color, title and body. Image is optional.');
      if(!chan) return message.channel.send('Please specify a channel by mention or ID');
      if(!color || !color.startsWith('#')) return message.channel.send('Please specify a color in hex code.');
      
      embed.setColor(color);
      if(body){
        embed.setDescription(body);
      }
      if(image){
        embed.setImage(image.proxyURL);
      }
      try{
        chan.send(embed);
      }catch (error) {
        return message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
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
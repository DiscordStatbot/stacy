'use strict';

module.exports = async (bot, message, settings) => {
  // Feature Requests system. This has not been implemented into the Open source version and has to be removed for open source.
  if (message.channel.id == '407479769458933760') {
    if (!message.content.toLowerCase().startsWith('**suggestion:**') && !message.content.toLowerCase().startsWith('**suggestion**') && !message.content.toLowerCase().startsWith('suggestion') && !message.content.toLowerCase().startsWith('suggestion:')) return;
    if (!message.content.toLowerCase().includes('**explanation:**') && !message.content.toLowerCase().includes('**explanation**') && !message.content.toLowerCase().includes('explanation') && !message.content.toLowerCase().includes('explanation:')) return;
    const feedback = message.content || 'None';

    const fbChan = message.guild.channels.get('590650996137525254');
    message.channel.send('Thank you for your suggestion!');
    let msg;
    if (!message.attachments.first()) {
      msg = `**User ID:**\n${message.author.id}\n**User:**\n<@${message.author.id}>\n**Original Message:**\n${message.url}\n\n${feedback}`;
    } else {
      const attach = message.attachments.first().url;
      msg = `**User ID:**\n${message.author.id}\n**User:**\n<@${message.author.id}>\n**Original Message:**\n${message.url}\n\n${feedback} ${msg.content}\n\n**Attachment:**\n${attach}`;
    }
    fbChan.send(msg).then(async (msg) => {
      await msg.react('🇧');
      await msg.react('🇸');
      await msg.react('🇫');
      await msg.react('🚫');
    });
    try {
      const newFeed = {
        userID: message.author.id,
        response: msg,
      };

      await bot.createFeed(newFeed);
    } catch (error) {
      console.log(error.stack);
    }
  }
};

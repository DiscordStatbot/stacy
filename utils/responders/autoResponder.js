// Reads messages and matches them to the Auto Responder entries in the DB. Uses a wild card system to mostly accurately read non-exact messages.

'use strict';

module.exports = async (bot, message, settings, ignore) => {
  try {
    if (!settings) return;
    if (!ignore) return;
    if (settings.autoModule == false) return;
    if (message.content.startsWith(settings.prefix)) return;
    if (message.channel.name.startsWith('ticket-')) return;
    if (message.channel.id === settings.welcomeChannel) return;
    if (ignore.responseExclude.includes(message.channel.id)) return;
    if (ignore.responseExclude.includes(message.channel.parentID)) return;
    if (message.author.bot || !message.guild) return;
    const str = await message.content.toLowerCase();

    let responderDoc;
    try {
      responderDoc = await bot.getAllResponse(message.guild);
    } catch (error) {
      return message.channel.send(`${bot.config.errMsg} \`${error.stack}\``);
    }
    if (!responderDoc) return;
    if (!str) return;
    let arr;

    for (let i = 0; i < responderDoc.length; i++) {
      arr = responderDoc[i].question.split(' ');
      const isEvery = arr.every((item) => str.includes(item));
      if (isEvery == true) {
        return message.channel.send(responderDoc[i].response).then(async () => {
          await bot.updateResponse(message.guild, responderDoc[i].question, { $inc: { autoStat: +1 } });
        });
      }
    }
  } catch (error) {

  }
};

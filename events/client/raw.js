// Feeds the messageReactionAdd and messageReactionRemove raw event to the bot.

const events = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

const { Emoji, MessageReaction } = require('discord.js');

module.exports = async (bot, event) => {
  if (!events.hasOwnProperty(event.t)) return;
  const { d: data } = event;
  const user = await bot.users.get(data.user_id);
  const channel = await bot.channels.get(data.channel_id);

  if (channel.messages.has(data.message_id)) return;

  const message = await channel.fetchMessage(data.message_id);

  const emojiKey = data.emoji.id ? data.emoji.animated ? `a:${data.emoji.name}:${data.emoji.id}` : `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
  let reaction = await message.reactions.get(emojiKey);

  if (!reaction) {
    const emoji = new Emoji(bot.guilds.get(data.guild_id), data.emoji);
    reaction = new MessageReaction(message, emoji, 1, data.user_id === bot.user.id);
  }

  await bot.emit(events[event.t], reaction, user);
};
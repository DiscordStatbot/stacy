'use strict';

module.exports = async (bot, message) => {
  if (message.author.bot || message.guild.id !== bot.config.guild) return;

  // Checks permissions here.
  if (!message.guild.me.hasPermission(bot.config.perms)) {
    return message.author.send(`${bot.config.errMsg}\nPlease ensure that I have the correct permissions in **${message.guild.name}** to \`send messages\`, \`read messages\`, \`embed links\`, \`attach files\`, \`manage messages\`, and \`add reactions\`. Without these permissions I can not perform any actions.`)
      .catch((error) => console.log(` [ERROR] ${error.stack}`));
  }

  // Gets the settings from the DB and binds it to a variable. If settings do not exist it creates it.
  let settings;
  try {
    settings = await bot.getGuild(message.guild);
  } catch (error) {
    console.error(` [ERROR] ${error.stack}`);
  }
  if (!settings.guildID) {
    const newGuild = {
      guildID: message.guild.id,
      ownerID: message.guild.ownerID,
    };

    try {
      await bot.createGuild(newGuild);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
  }

  // Checks if the ignore settings exist (they are used for the disable and enable command) and binds it to a variable. If it doesn't creates it in the DB.
  let ignore;
  try {
    ignore = await bot.getIgnore(message.guild.id);
  } catch (error) {
    console.error(` [ERROR] ${error.stack}`);
  }
  if (!ignore) {
    const newIgnore = {
      guildID: message.guild.id,
    };

    try {
      await bot.createIgnore(newIgnore);
    } catch (error) {
      console.error(` [ERROR] ${error.stack}`);
    }
  }

  // All different required files for running specific systems. Read file comments for more information.
  require('../../utils/timerCheck')(bot, message);
  require('../../utils/feedback/submit')(bot, message, settings);
  require('../../utils/responders/announcer')(bot, message, settings);
  require('../../utils/responders/deskResponder')(bot, message, settings);
  require('../../utils/responders/autoResponder')(bot, message, settings, ignore);

  // Create prefix + command + arguments and applies any cooldown or ignore systems too it.
  const prefixMention = new RegExp(`^<@!?${bot.user.id}> `);
  const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : settings.prefix;
  if (!message.content.startsWith(prefix)) return;
  if (ignore.commandsDisable.includes(message.channel.id) || ignore.commandsDisable.includes(message.channel.parentID)) return;
  if (bot.cooldown.has(message.author.id) && message.content.startsWith(prefix)) return message.channel.send('**Not so fast!**\n\nPlease wait 3 seconds before using another command.');

  if (message.author.id !== bot.config.owner && message.content.startsWith(prefix)) {
    bot.cooldown.add(message.author.id);
    setTimeout(() => {
      bot.cooldown.delete(message.author.id);
    }, 3000);
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  // Binds commands to files for command handler.
  const commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
  if (commandfile) commandfile.run(bot, message, args, settings, ignore);
};

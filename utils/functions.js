'use strict';

const mongoose = require('mongoose');
const {
  Feedback, Guild, HelpDesk, AutoResponse, ReactRole, Snippet, Timer, TicketLog, Ignore,
} = require('./index');

module.exports = async (bot) => {
  // Statbot Feedback and Suggestions Function for saving information in the DB. Remove in Open Source version.

  bot.updateFeed = async (user, settings) => {
    let data = await Feedback.findOne({ userID: user });

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }

    return await data.updateOne(settings);
  };

  bot.completeFeed = async (message, settings) => {
    let data = await bot.getFeed(message);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }

    return await data.updateOne(settings);
  };

  bot.getFeed = async (message) => {
    const data = await Feedback.findOne({ messageID: message });

    if (data) return data;
  };

  bot.getUserFeed = async (user) => {
    const data = await Feedback.find({ userID: user });

    if (data) return data;
  };

  bot.createFeed = async (settings) => {
    const merged = { _id: mongoose.Types.ObjectId(), ...settings };

    const newFeed = await new Feedback(merged);
    return newFeed.save();
  };

  // Create, Get and Delete guild settings. All functions are for the DB.
  bot.getGuild = async (guild) => {
    const data = await Guild.findOne({ guildID: guild.id });

    if (data) return data;
    return bot.config.defaultSettings;
  };
  bot.getGuildOwner = async (user) => {
    const data = await Guild.find({ ownerID: user });

    if (data) return data;
  };

  bot.updateGuild = async (guild, settings) => {
    let data = await bot.getGuild(guild);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }

    return await data.updateOne(settings);
  };

  bot.createGuild = async (settings) => {
    const defaults = { _id: mongoose.Types.ObjectId(), ...bot.config.defaultSettings };
    const merged = Object.assign(defaults, settings);

    const newGuild = await new Guild(merged);
    return newGuild.save();
  };

  bot.getIgnore = async (guild) => {
    const data = await Ignore.findOne({ guildID: guild });

    if (data) return data;
  };

  bot.updateIgnore = async (guild, settings) => {
    let data = await bot.getIgnore(guild);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }

    return await data.updateOne(settings);
  };

  bot.createIgnore = async (settings) => {
    const merged = { _id: mongoose.Types.ObjectId(), ...settings };

    const newIgnore = await new Ignore(merged);
    return newIgnore.save();
  };

  bot.getTicket = async (user, guild, messages) => {
    const data = await TicketLog.findOne({ userID: user, guildID: guild.id, messages });
    if (data) return data;
  };
  bot.getAllTicket = async (user, guild) => {
    const data = await TicketLog.find({ userID: user, guildID: guild.id });
    if (data) return data;
  };
  bot.getGuildTicket = async (guild) => {
    const data = await TicketLog.find({ guildID: guild.id });
    if (data) return data;
  };

  bot.updateTicket = async (user, guild, messages, settings) => {
    let data = await bot.getTicket(user, guild, messages);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }

    return await data.updateOne(settings);
  };

  bot.createTicket = async (ticket) => {
    const merged = { _id: mongoose.Types.ObjectId(), ...ticket };

    const newTicket = await new TicketLog(merged);
    return newTicket.save();
  };

  bot.getReact = async (role) => {
    const data = await ReactRole.findOne({ roleID: role });
    if (data) return data;
  };

  bot.roleReact = async (emoji) => {
    const data = await ReactRole.findOne({ emoji });
    if (data) return data;
  };

  bot.getAllReact = async (guild) => {
    const data = await ReactRole.find({ guildID: guild.id }, { roleID: 1, emoji: 1, _id: 0 });
    if (data) return data;
  };

  bot.createReact = async (roles) => {
    const merged = { _id: mongoose.Types.ObjectId(), ...roles };

    const newReact = await new ReactRole(merged);
    return newReact.save();
  };

  bot.deleteReact = async (role) => {
    const data = await bot.getReact(role);

    return await data.deleteOne(data);
  };

  bot.getTimer = async (guild, user) => {
    const data = await Timer.findOne({ guildID: guild.id, userID: user });
    if (data) return data;
  };

  bot.getAllTimer = async (guild) => {
    const data = await Timer.find({ guildID: guild.id });
    if (data) return data;
  };

  bot.deleteNoTimer = async (guild, user) => {
    const data = await bot.getTimer(guild, user);

    return await data.deleteOne(data);
  };

  bot.createTimer = async (timers) => {
    const merged = { _id: mongoose.Types.ObjectId(), ...timers };

    const newTimer = await new Timer(merged);
    return newTimer.save();
  };

  bot.deleteTimer = async (guild, user) => {
    const data = await bot.getTimer(guild, user);

    return await data.deleteOne(data);
  };

  bot.updateTimer = async (guild, user, settings) => {
    let data = await bot.getTimer(guild, user);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }

    return await data.updateOne(settings);
  };

  bot.getSnip = async (guild, trigger) => {
    const data = await Snippet.findOne({ guildID: guild.id, trigger });
    if (data) return data;
  };

  bot.getAllSnip = async (guild) => {
    const data = await Snippet.find({ guildID: guild.id }, { trigger: 1, response: 1, _id: 0 });
    if (data) return data;
  };

  bot.createSnip = async (trigger) => {
    const merged = { _id: mongoose.Types.ObjectId(), ...trigger };

    const newSnip = await new Snippet(merged);
    return newSnip.save();
  };

  bot.deleteSnip = async (guild, trigger) => {
    const data = await bot.getSnip(guild, trigger);

    return await data.deleteOne(data);
  };

  bot.getResponse = async (guild, question) => {
    const data = await AutoResponse.findOne({ guildID: guild.id, question });
    if (data) return data;
  };

  bot.getResponseStat = async (guild, stat) => {
    const data = await AutoResponse.findOne({ guildID: guild.id, autoStat: stat });
    if (data) return data;
  };

  bot.getAllResponse = async (guild) => {
    const data = await AutoResponse.find({ guildID: guild.id }, {
      question: 1, response: 1, autoStat: 1, _id: 0,
    });
    if (data) return data;
  };

  bot.updateResponse = async (guild, question, settings) => {
    let data = await bot.getResponse(guild, question);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }

    return await data.updateOne(settings);
  };

  bot.createResponse = async (responses) => {
    const merged = { _id: mongoose.Types.ObjectId(), ...responses };

    const newResponder = await new AutoResponse(merged);
    return newResponder.save();
  };

  bot.deleteResponse = async (guild, question) => {
    const data = await bot.getResponse(guild, question);

    return await data.deleteOne(data);
  };

  bot.getDesk = async (channel) => {
    const data = await HelpDesk.findOne({ deskChannel: channel.id });
    if (data) return data;
  };

  bot.resetDeskStat = async (channel) => await HelpDesk.updateOne({ deskChannel: channel.id, qar: { $elemMatch: { deskStat: { $gt: 0 } } } }, { $set: { 'qar.$.deskStat': 0 } });

  bot.getAllDesk = async (guild) => {
    const data = await HelpDesk.find({ guildID: guild.id });
    if (data) return data;
  };

  bot.updateDesk = async (channel, settings) => {
    let data = await bot.getDesk(channel);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }

    return await data.updateOne(settings);
  };

  bot.deleteDesk = async (channel) => {
    const data = await bot.getDesk(channel);

    return await data.deleteOne(data);
  };

  bot.createDesk = async (desks) => {
    const merged = { _id: mongoose.Types.ObjectId(), ...desks };

    const newDesk = await new HelpDesk(merged);
    return newDesk.save();
  };

  bot.clean = (text) => {
    if (typeof (text) === 'string') {
      return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
    return text;
  };
};

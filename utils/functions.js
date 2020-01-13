const mongoose = require('mongoose');
const { Feedback, Guild, HelpDesk, AutoResponse, ReactRole, Snippet, Timer, TicketLog, Ignore } = require('./index');

module.exports = async bot => {
  //Statbot Feedback and Suggestions Function for saving information in the DB. Remove in Open Source version.

  bot.updateFeed = async (user, settings) => {
    let data = await Feedback.findOne({userID: user});

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

  bot.getFeed = async message => {
    const data = await Feedback.findOne({ messageID: message });

    if (data) return data;
    else return;
  };

  bot.getUserFeed = async user => {
    const data = await Feedback.find({ userID: user });

    if (data) return data;
    else return;
  };

  bot.createFeed = async settings => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() },settings);

    const newFeed = await new Feedback(merged);
    return newFeed.save();
  };

  // Create, Get and Delete guild settings. All functions are for the DB.
  bot.getGuild = async guild => {
    const data = await Guild.findOne({ guildID: guild.id });

    if (data) return data;
    else return bot.config.defaultSettings;
  };
  bot.getGuildOwner = async user => {
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

  bot.createGuild = async settings => {
    const defaults = Object.assign({ _id: mongoose.Types.ObjectId() }, bot.config.defaultSettings);
    const merged = Object.assign(defaults, settings);

    const newGuild = await new Guild(merged);
    return newGuild.save();
  };

  bot.getIgnore = async guild => {
    const data = await Ignore.findOne({ guildID: guild });

    if (data) return data;
    else return;
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

  bot.createIgnore = async settings => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() },settings);

    const newIgnore = await new Ignore(merged);
    return newIgnore.save();
  };

  bot.getTicket = async (user, guild, messages) => {
    let data = await TicketLog.findOne( { userID: user, guildID: guild.id, messages: messages } );
    if (data) return data;
    else return;
  };
  bot.getAllTicket = async (user, guild) => {
    let data = await TicketLog.find( { userID: user, guildID: guild.id} );
    if (data) return data;
    else return;
  };
  bot.getGuildTicket = async guild => {
    let data = await TicketLog.find( { guildID: guild.id} );
    if (data) return data;
    else return;
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

  bot.createTicket = async ticket => {
    let merged = Object.assign({ _id: mongoose.Types.ObjectId() }, ticket);

    const newTicket = await new TicketLog(merged);
    return newTicket.save();
  };

  bot.getReact = async role => {
    let data = await ReactRole.findOne( { roleID: role } );
    if (data) return data;
    else return;
  };

  bot.roleReact = async emoji => {
    let data = await ReactRole.findOne( { emoji: emoji } );
    if (data) return data;
    else return;
  };

  bot.getAllReact = async guild => {
    let data = await ReactRole.find( { guildID: guild.id }, { roleID: 1, emoji: 1, _id: 0 } );
    if (data) return data;
    else return;
  };

  bot.createReact = async roles => {
    let merged = Object.assign({ _id: mongoose.Types.ObjectId() }, roles);

    const newReact = await new ReactRole(merged);
    return newReact.save();
  };

  bot.deleteReact = async role => {
    let data = await bot.getReact(role);

    return await data.deleteOne(data);
  };

  bot.getTimer = async (guild, user) => {
    let data = await Timer.findOne({ guildID: guild.id, userID: user});
    if (data) return data;
    else return;
  };

  bot.getAllTimer = async guild => {
    let data = await Timer.find({guildID: guild.id});
    if (data) return data;
    else return;
  };

  bot.deleteNoTimer = async (guild, user)=> {
    let data = await bot.getTimer(guild, user);

    return await data.deleteOne(data);
  };

  bot.createTimer = async timers => {
    let merged = Object.assign({ _id: mongoose.Types.ObjectId() }, timers);

    const newTimer = await new Timer(merged);
    return newTimer.save();
  };

  bot.deleteTimer = async (guild, user) =>{
    let data = await bot.getTimer(guild, user);

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
    let data = await Snippet.findOne({ guildID: guild.id, trigger: trigger });
    if (data) return data;
    else return;
  };

  bot.getAllSnip = async guild => {
    let data = await Snippet.find( { guildID: guild.id }, { trigger: 1, response: 1, _id: 0 } );
    if (data) return data;
    else return;
  };

  bot.createSnip = async trigger => {
    let merged = Object.assign({ _id: mongoose.Types.ObjectId() }, trigger);

    const newSnip = await new Snippet(merged);
    return newSnip.save();
  };

  bot.deleteSnip = async (guild, trigger) =>{
    let data = await bot.getSnip(guild, trigger);

    return await data.deleteOne(data);
  };

  bot.getResponse = async (guild, question) => {
    let data = await AutoResponse.findOne({ guildID: guild.id, question: question });
    if (data) return data;
    else return;
  };

  bot.getResponseStat = async (guild, stat) => {
    let data = await AutoResponse.findOne({ guildID: guild.id, autoStat: stat });
    if (data) return data;
    else return;
  };

  bot.getAllResponse = async guild => {
    let data = await AutoResponse.find( { guildID: guild.id }, { question: 1, response: 1, autoStat: 1, _id: 0 } );
    if (data) return data;
    else return;
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

  bot.createResponse = async responses => {
    let merged = Object.assign({ _id: mongoose.Types.ObjectId() }, responses);

    const newResponder = await new AutoResponse(merged);
    return newResponder.save();
  };

  bot.deleteResponse = async (guild, question) =>{
    let data = await bot.getResponse(guild, question);

    return await data.deleteOne(data);
  };

  bot.getDesk = async channel => {
    let data = await HelpDesk.findOne({ deskChannel: channel.id });
    if (data) return data;
    else return;
  };

  bot.resetDeskStat = async channel => {
    return await HelpDesk.updateOne({ deskChannel: channel.id, qar: { $elemMatch: { deskStat: { $gt: 0 } } }}, { $set: { 'qar.$.deskStat' : 0 } });
  };

  bot.getAllDesk = async guild => {
    let data = await HelpDesk.find({ guildID: guild.id });
    if (data) return data;
    else return;
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

  bot.deleteDesk = async (channel) =>{
    let data = await bot.getDesk(channel);

    return await data.deleteOne(data);
  };

  bot.createDesk = async desks => {
    let merged = Object.assign({ _id: mongoose.Types.ObjectId() }, desks);

    const newDesk = await new HelpDesk(merged);
    return newDesk.save();
  };

  bot.clean = text => {
    if (typeof(text) === 'string') {
      return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
      return text;
    }
  };
};
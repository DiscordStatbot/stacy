// Simple ready event. Nothing much happens in it.

const dateFormat = require('dateformat');

module.exports = async bot => { 
  console.log(` [BOT] Username: ${bot.user.username}`);
  console.log(` [BOT] Servers: ${bot.guilds.size}`);
  console.log(` [BOT] Logged in at: ${dateFormat()}`);
  console.log(' [BOT] Ready to use!');

  bot.user.setActivity('Booting...', {type: 'WATCHING'});

  bot.setInterval(() => {
    bot.user.setActivity('the help desk', {type: 'WATCHING'});
  }, 60000);

};
// Handles event exacution.

'use strict';

const { readdirSync } = require('fs');

module.exports = async (bot) => {
  const load = (dirs) => {
    const events = readdirSync(`./events/${dirs}/`).filter((d) => d.endsWith('.js'));
    for (const file of events) {
      const evt = require(`./../events/${dirs}/${file}`);
      const eName = file.split('.')[0];
      bot.on(eName, evt.bind(null, bot));
    }
  };
  ['client', 'guild', 'logger'].forEach((x) => load(x));
};

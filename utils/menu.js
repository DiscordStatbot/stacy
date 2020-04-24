// Help menu. I am sure it can be improved upon.

'use strict';

const Discord = require('discord.js');

module.exports = class Menu {
  constructor(channel = new Discord.TextChannel(), uid, pages = [], time = 120000, reactions = {
    back: '◀', one: '❔', two: '1⃣', three: '2⃣', four: '3⃣', five: '4⃣', six: '5⃣', next: '▶', stop: '⏹', del: '❌',
  }) {
    this.channel = channel;
    this.pages = pages;
    this.time = time;
    this.reactions = reactions;
    this.page = 1;
    channel.send(pages[0]).then((msg) => {
      this.msg = msg;
      this.addReactions();
      this.createCollector(uid);
    });
  }

  select(pg = 1) {
    this.page = pg;
    this.msg.edit(this.pages[pg - 1]);
  }

  createCollector(uid) {
    const collector = this.msg.createReactionCollector((r, u) => u.id === uid, { time: this.time });
    this.collector = collector;
    collector.on('collect', (r) => {
      if (r.emoji.name === this.reactions.back) {
        if (this.page !== 1) this.select(this.page - 1);
      } else if (r.emoji.name === this.reactions.one) {
        if (this.page !== 1) this.select(1);
      } else if (r.emoji.name === this.reactions.two) {
        if (this.page !== 2) this.select(2);
      } else if (r.emoji.name === this.reactions.three) {
        if (this.page !== 3) this.select(3);
      } else if (r.emoji.name === this.reactions.four) {
        if (this.page !== 4) this.select(4);
      } else if (r.emoji.name === this.reactions.five) {
        if (this.page !== 5) this.select(5);
      } else if (r.emoji.name === this.reactions.six) {
        if (this.page !== 6) this.select(6);
      } else if (r.emoji.name === this.reactions.next) {
        if (this.page !== this.pages.length) this.select(this.page + 1);
      } else if (r.emoji.name === this.reactions.stop) {
        collector.stop();
      } else if (r.emoji.name === this.reactions.del) {
        this.msg.delete();
        collector.stop();
      }
    });
    collector.on('end', async () => {
      try {
        this.channel.send('Help Menu has been stopped due to time out or choosing the stop option.');
      } catch (error) {

      }
    });
  }

  async addReactions() {
    if (this.reactions.one) await this.msg.react(this.reactions.one);
    if (this.reactions.back) await this.msg.react(this.reactions.back);
    if (this.reactions.two) await this.msg.react(this.reactions.two);
    if (this.reactions.three) await this.msg.react(this.reactions.three);
    if (this.reactions.four) await this.msg.react(this.reactions.four);
    if (this.reactions.five) await this.msg.react(this.reactions.five);
    if (this.reactions.six) await this.msg.react(this.reactions.six);
    if (this.reactions.next) await this.msg.react(this.reactions.next);
    if (this.reactions.stop) await this.msg.react(this.reactions.stop);
    if (this.reactions.del) await this.msg.react(this.reactions.del);
  }
};

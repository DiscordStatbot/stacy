// Gives a user the announcement ping role.

'use strict';

module.exports = {
  config: {
    name: 'announceping',
    usage: 'announceping`',
    description: 'Join or leave the servers announcement ping role.',
    accessableby: 'Members',
    category: 'general',
  },
  run: async (bot, message, args, settings) => {
    if (!settings.announceRole) return message.channel.send('Announcement role is not set up for this server.');

    const aRole = message.guild.roles.get(settings.announceRole);
    const user = message.member;

    if (!message.member.roles.has(settings.announceRole)) {
      user.addRole(aRole.id);
      message.channel.send('You have joined the announcement ping role. To leave use the command again.');
    } else {
      user.removeRole(aRole.id);
      message.channel.send('You have left the announcement ping role.');
    }

    return undefined;
  },
};

// The welcomer system. Please make sure fs-extra is always used as normal fs does not work for this.

'use strict';

const fs = require('fs-extra');
const https = require('https');

module.exports = {
  config: {
    name: 'welcomer',
    usage: 'welcomer <option>`',
    options: '`message` - Setup the welcome message for your server.\n**Usage:** `welcomer message <your message>`\n\n`channel` - The channel in which welcome message is sent.\n**Usage:** `welcomer channel #channel`\n\n`role` - Set the join role that will be given to new users.\n**Usage:** `welcomer role @role`\n\n`ping` - Toggle pinging user when they join on and off.\n**Usage:** `welcomer ping <on or off>`\n\n',
    description: 'Setup the welcomer system to welcome users when they join your server..',
    accessableby: 'Administrator',
    category: 'automation',
  },
  run: async (bot, message, args, settings) => {
    if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has(settings.adminRole)) return await message.channel.send(`${bot.config.errPerm}\nYou need the \`ADMINISTRATOR\` permission or the \`Admin\` role to perform this action.`);
    try {
      const type = args[0];

      switch (type) {
        case 'role': {
          const role = message.mentions.roles.first() || message.guild.roles.get(args[1]);
          if (role) {
            try {
              await bot.updateGuild(message.guild, { welcomeRole: role.id });
              return await message.channel.send(`Join role has been set to: **${role.name}**`);
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          } else {
            try {
              await bot.updateGuild(message.guild, { $unset: { welcomeRole: '' } });
              return await message.channel.send('Join role disabled.');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'channel': {
          const chan = message.mentions.channels.first() || message.guild.channels.get(args[1]);
          const dMsg = 'Welcome {user}';
          if (chan) {
            try {
              await bot.updateGuild(message.guild, { welcomeChannel: chan.id, welcomeMessage: dMsg });
              return await message.channel.send(`Welcome channel has been set to: <#${chan.id}>`);
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          } else {
            try {
              await bot.updateGuild(message.guild, { $unset: { welcomeChannel: '' } });
              return await message.channel.send('Welcome channel disabled.');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'message': {
          const msg = message.content.split(' ').slice(2).join(' ');

          if (args[1]) {
            try {
              await bot.updateGuild(message.guild, { welcomeMessage: msg });
              return await message.channel.send(`Welcome message has been set to: \`${msg}\` `);
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          } else {
            try {
              await bot.updateGuild(message.guild, { $unset: { welcomeMessage: '' } });
              return await message.channel.send('Welcome message disabled.');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'image': {
          const img = message.attachments.first();

          if (img) {
            const dir = './welcomeImages/';

            dirCheck(dir);

            if (message.attachments.first().filename.includes('png')) {
              await bot.updateGuild(message.guild, { welcomeImage: `${message.guild.id}.png` });
              download(img.url, `${dir}${message.guild.id}.png`);
              return await message.channel.send(`Welcome image has been set to: ${img.proxyURL}`);
            } if (message.attachments.first().filename.includes('gif')) {
              await bot.updateGuild(message.guild, { welcomeImage: `${message.guild.id}.gif` });
              download(img.url, `${dir}${message.guild.id}.gif`);
              return await message.channel.send(`Welcome image has been set to: ${img.proxyURL}`);
            }
            return await message.channel.send('Not a valid file format. PNG or GIF only.');
          }
          try {
            await bot.updateGuild(message.guild, { $unset: { welcomeImage: '' } });
            return await message.channel.send('Welcome image disabled.');
          } catch (error) {
            await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
          }

          break;
        }
        case 'color': {
          if (args[1]) {
            try {
              await bot.updateGuild(message.guild, { welcomeColor: args[1] });
              return await message.channel.send(`Welcome color has been set to: \`${args[1]}\``);
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          } else {
            try {
              await bot.updateGuild(message.guild, { $unset: { welcomeColor: '' } });
              return await message.channel.send('Welcome color has been reset to default.');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        case 'ping': {
          if (args[1] === 'on') {
            try {
              await bot.updateGuild(message.guild, { welcomePing: true });
              return await message.channel.send('Pinging user on join is set to: `On`');
            } catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          } else if (args[1]`` === 'off') {
            try {
              await bot.updateGuild(message.guild, { welcomePing: false });
              return await message.channel.send('Pingong user on join is set to: `Off`.');
            } catch (error) {
              return await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          } else {
            try {
              await message.channel.send('Please specify `on` or `off` to set pinging when user joins to on or off.');
            } catch (error) {
              await message.channel.send(`${bot.config.errMsg} \`${error.message}\``);
            }
          }
          break;
        }
        default: {
          await message.channel.send('Please specify a welcome option.');
        }
      }
    } catch (error) {
      try {
        await message.author.send(`${bot.config.errMsg}\n${error.message}`);
      } catch (error) {

      }
    }
    async function dirCheck(directory) {
      try {
        await fs.ensureDir(directory);
      } catch (error) {
        console.error(` [ERROR] ${error.stack}`);
      }
    }
    async function download(url, dest) {
      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        const request = https.get(url, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
          } else {
            file.close();
            fs.unlink(dest, () => {}); // Delete temp file
            reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
          }
        });

        request.on('error', (err) => {
          file.close();
          fs.unlink(dest, () => {}); // Delete temp file
          reject(err.message);
        });

        file.on('finish', () => {
          resolve();
        });

        file.on('error', (err) => {
          file.close();

          if (err.code === 'EEXIST') {
            reject('File already exists');
          } else {
            fs.unlink(dest, () => {}); // Delete temp file
            reject(err.message);
          }
        });
      });
    }
  },
};

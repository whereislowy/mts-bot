/* eslint-disable no-undef */
const Discord = require('discord.js');
const {
  blue,
  logs,
  emojiAttention,
  prefix
} = require('../../../config.json');

module.exports = {
  name: 'antiwebhook',
  description: 'Désactive/Active l\'antiwebhook',
  aliases: ['antiwebhook', 'Antiwebhook'],
  usage: 'antiwebhook [on/off]',
  perms: `\`Whitelist\``,

  async execute(message, args, client, lang, guildInfo) {

    const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

    let color = guildInfo.color

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.WhitelistNoInWL}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    if (!message.guild.owner) return;

    if (!guildInfo.whitelist.users.includes(message.author.id)) {
      return message.channel.send(WLAlready);
    }

    if (args[0] === 'on') {
      await client.db.raids.findOneAndUpdate({
        server: message.guild.id
    }, {
        $set: {
            antiwebhook: true
        }
    });
      message.channel.send({
        embed: {
          color: color,
          description: `${lang.BanAction} ${lang.AntiwebhookEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });

      if (!logchannel) return
      logchannel.send({
        embed: {
          color: color,
          description: `${lang.BanAction} ${lang.AntiwebhookEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });
    } else if (args[0] === 'off') {
      await client.db.raids.findOneAndUpdate({
        server: message.guild.id
    }, {
        $set: {
            antiwebhook: false
        }
    });
      message.channel.send({
        embed: {
          color: color,
          description: `${lang.BanAction} ${lang.AntiwebhookDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });

      if (!logchannel) return
      logchannel.send({
        embed: {
          color: color,
          description: `${lang.BanAction} ${lang.AntiwebhookDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });
    } else {
      message.channel.send({
        embed: {
          color: color,
          description: `${lang.WhitelistPreciseOFFoON} ${lang.AntiwebhookFinalWord}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });
    }
  },
};
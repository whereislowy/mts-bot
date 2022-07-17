/* eslint-disable no-undef */
const Discord = require('discord.js');
const {
  blue,
  logs,
  emojiAttention
} = require('../../../config.json');

module.exports = {
  name: 'lock',
  description: 'bloque le salon',
  aliases: ['lock'],
  usage: 'lock',
  perms: `\`MANAGE_CHANNELS\``,

  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    const NoPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.LockErrorNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(NoPerms);

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(embedbotPerms)

    try {
      message.delete();
    } catch {
      
    }

    try {
      message.channel.updateOverwrite(message.guild.roles.cache.find((e) => e.name.toLowerCase().trim() == '@everyone'), {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
      });

      const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`${lang.LockEmbedLocked}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      message.channel.send(embed);

      const embed1 = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`${lang.LockEmbedLocked}`)
        .setDescription(`${lang.BanAction} Lock \n ${lang.BanAuthor} <@${message.author.id}>`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)
      if (!logchannel) return;
      logchannel.send(embed1);
    } catch (e) {
      message.channel.send(e);
    }
  },
};
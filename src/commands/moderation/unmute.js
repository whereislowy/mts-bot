const {
  MessageEmbed,
} = require('discord.js');
const {
  logs,
  emojiAttention,
  blue,
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'unmute la personne',
  aliases: ['unmute'],
  usage: 'unmute + <@user>',
  perms: `\`MANAGE_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

    let color = guildInfo.color

    let muteRole;
    if (message.guild.roles.cache.get(guildInfo.roleMuted)) {
      let role = message.guild.roles.cache.get(guildInfo.roleMuted)
      if(!role) return;
      muteRole = role.id
    } else {
      let rolee = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');
      if(!rolee) return;
      muteRole = rolee.id
    }

    const NoPerms = new MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());

    if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(NoPerms);

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(embedbotPerms)

    const mention = message.mentions.members.first();

    if (!mention) {
      message.reply({
        embed: {

          color: color,
          description: `<@${message.author.id}> ${lang.UnmuteErrorNoMention}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });
    } else if (!mention.roles.cache.has(muteRole)) {
      return message.reply({
        embed: {

          color: color,
          description: `<@${mention.id}> ${lang.UnmuteErrorNoMuted}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });
    } else {
      try {
        mention.roles.remove(muteRole);
      } catch {

      }

      const embed = new MessageEmbed()
        .setAuthor(mention.displayName, mention.user.avatarURL())
        .setColor(color)
        .setDescription(`${lang.BanAction} Unmute \n ${lang.BanAuthor} <@${message.author.id}>`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());

      message.channel.send(embed);

      const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)
      if (!logchannel) return;

      const unmuteembed = new MessageEmbed()
        .setAuthor(mention.displayName, mention.user.avatarURL())
        .setColor(color)
        .setDescription(`${lang.BanAction} Unmute \n ${lang.BanAuthor} <@${message.author.id}>`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL());
      logchannel.send(unmuteembed);
    }
  },
};
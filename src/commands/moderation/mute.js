/* eslint-disable no-undef */
const {
  MessageEmbed,
} = require('discord.js');
const {
  logs,
  emojiAttention,
  blue,
  prefix
} = require('../../../config.json');
const Discord = require('discord.js')

module.exports = {
  name: 'mute',
  description: 'mute la personne mentionné',
  aliases: ['mute'],
  usage: 'mute + <@user> + <reason>',
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

    const mention = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || `${lang.BanNoReason}`;

    const NoPerms = new MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(NoPerms);

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(embedbotPerms)

    if (!muteRole) return message.channel.send(`${lang.MuteErrorNoRole}`);

    if (!mention) {
      message.channel.send({
        embed: {

          color: color,
          description: `${lang.MuteErrorNoPerson}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });
    } else if (mention.roles.cache.has(muteRole)) {
      return message.channel.send({
        embed: {

          color: color,
          description: `<@${mention.id}> ${lang.MuteUserAlreadyMute}`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`,
            text: `${client.user.username} © 2021`,
          },
        },
      });
    } else {
      try {
        await mention.roles.add(muteRole);
      } catch {

      }
      const Owner = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.MuteUserOwner}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
      if (mention.id === message.guild.ownerID) return message.channel.send(Owner);

      const embed = new MessageEmbed()
        .setAuthor(mention.displayName, mention.user.avatarURL())
        .setColor(color)
        .setDescription(`${lang.BanAction} Mute <@${mention.id}> \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      message.channel.send(embed);


      const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)
      if (!logchannel) return;

      const muteembed = new MessageEmbed()
        .setAuthor(mention.displayName, mention.user.avatarURL())
        .setColor(color)
        .setDescription(`${lang.BanAction} Mute <@${mention.user.id}> \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
      logchannel.send(muteembed);
    }
  },
};
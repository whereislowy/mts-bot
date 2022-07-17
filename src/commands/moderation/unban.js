const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  logs,
  emojiAttention,
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Deban la personne mentionné',
  aliases: ['unban'],
  usage: 'unban + <@id>',
  perms: `\`BAN_MEMBERS\``,

  async execute(message, args, client, lang, guildInfo) {

    let color = guildInfo.color
    const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

    const NoPerms = new MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.BanErrorNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply(NoPerms);

    const embedbotPerms = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
    .setTimestamp()
    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(embedbotPerms)

    const user = await client.users.fetch(args[0]);
    if (!user) return message.reply(`${lang.UnbanNoPerson}`);
    message.guild.members.unban(user);

    const embed = new MessageEmbed()
      .setAuthor(`${user.username}`, user.avatarURL())
      .setColor(color)
      .setDescription(`${lang.BanAction} Unban \n ${lang.BanAuthor} <@${message.author.id}>`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());

    message.channel.send(embed);

    const unbanembed = new MessageEmbed()
      .setAuthor(user.username, user.avatarURL())
      .setColor(color)
      .setDescription(`${lang.BanAction} Unban \n ${lang.BanAuthor} <@${message.author.id}>`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());
    if (!logchannel) return;
    logchannel.send(unbanembed);
  },
};

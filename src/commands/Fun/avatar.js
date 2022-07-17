const Discord = require('discord.js');
const {
  blue,
  emojiAttention
} = require('../../../config.json');

module.exports = {

  name: 'avatar',
  description: "donne l'avatar de la personne mentionné",
  aliases: ['avatar', 'pic'],
  usage: 'pic + <@user>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    const embedbotPerms = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
    .setTimestamp()
    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)
    
    const member = message.mentions.users.first() || message.author;
    const avatar = member.displayAvatarURL({
      size: 1024,
      dynamic: true,
    });

    const embed = new Discord.MessageEmbed()
      .setTitle(`${member.username} avatar :`)
      .setImage(avatar)
      .setColor(color)
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    message.channel.send(embed);
  },
};
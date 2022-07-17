/* eslint-disable no-undef */
const Discord = require('discord.js');
const {
  blue,
  logs,
  emojiAttention
} = require('../../../config.json');

module.exports = {
  name: 'invite',
  description: 'lien d\'invitation du bot',
  aliases: ['add', 'inv', 'invite'],
  usage: 'invite',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    const invite = new Discord.MessageEmbed()
    .setTitle(`🎫 ${lang.InviteTitle}`)
    .setURL('https://discord.com/api/oauth2/authorize?client_id=809104772178903051&permissions=8&scope=bot')
    .setColor(color)
    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`)
message.channel.send(invite)

  },
};

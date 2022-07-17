const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  emojiAttention
} = require('../../../config.json');
const Discord = require('discord.js')

module.exports = {
  name: 'warnings',
  description: "Affiche le nombre de warns de la personne mentionné",
  aliases: ['warnings'],
  usage: 'warnings + <@user>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {
let color = guildInfo.color
    const user = message.mentions.members.first() || message.author;

    const [index, userInfo] = [guildInfo.users.findIndex(userInfo => userInfo.id === user.id), guildInfo.users.find(userInfo => userInfo.id === user.id)];
    const warnings = userInfo.warnings
    if (warnings === null || warnings === undefined) warnings = 0;

    const embed = new MessageEmbed()
      .setColor(color)
      .setDescription(`${user} ${lang.WarningsEmbed1} **${warnings}** ${lang.WarningsEmbed2}`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());

    message.channel.send(embed);
  },
};

const {
  MessageEmbed,
} = require('discord.js');
const {
  emojiAttention,
  owner,
  blue,
} = require('../../../config.json');
const Discord = require('discord.js')

module.exports = {
  name: 'prefix',
  description: 'Choisis un nouveau prefix',
  aliases: ['setprefix', 'sp'],
  usage: 'prefix + <prefix>',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang, guildInfo) {

    let color = guildInfo.color

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)

    // Set Prefix
    const changes = args[0];

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.PrefixErrorNoOwner}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    if(!message.guild.owner) {
      return message.channel.send(WLAlready)
  }

    if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {

      if (!changes) {
        return message.channel.send({
          embed: {

            color: color,
            description: `${emojiAttention} ${lang.PrefixErrorNoPrefix}`,
            footer: {
              icon_url: `${client.user.displayAvatarURL()}`,
              text: `${client.user.username} © 2021`,
            },
          },
        });
      }

      if (changes.length > 5) {
        return message.channel.send({
          embed: {

            color: color,
            description: `${emojiAttention} ${lang.PrefixErrorLength}`,
            footer: {
              icon_url: `${client.user.displayAvatarURL()}`, // petite en bas a gauche
              text: `${client.user.username} © 2021`,
            },
          },
        });
      }

      await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { prefix: changes}});
      message.channel.send({
        embed: {

          color: color,
          description: `${lang.PrefixNewPrefix} **${changes}**`,
          footer: {
            icon_url: `${client.user.displayAvatarURL()}`, // petite en bas a gauche
            text: `${client.user.username} © 2021`,
          },
        },
      });
    } else {
      return message.channel.send(WLAlready)
    }
  },
};
const Discord = require('discord.js');
const {
  blue,
  logs,
  emojiAttention,
} = require('../../../config.json');

module.exports = {
  name: 'poll',
  description: 'crée un poll',
  aliases: ['poll'],
  usage: 'poll + <message>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    const embedbotPerms = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)

    if (!args[0]) return message.channel.send(`${lang.PollErrorQuestion}`);

    const msg = args.join(' ');

    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<:poll:842452659365609512> ${msg}`)
      .setAuthor(`${lang.PollCreateBy} ${message.author.username}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    try {
      message.delete();
    } catch {

    }

    message.channel.send(embed).then(async (messageReaction) => {
      messageReaction.react('<:yes:801094802761580544>');
      await sleep(250)
      messageReaction.react('<:no:801094814602231844>');

      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
    });
  },
};
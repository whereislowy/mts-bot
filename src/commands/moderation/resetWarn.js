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
  name: 'resetwarns',
  aliases: ['rwarns'],
  usage: 'rwarns <@user>',
  description: "Reset les avertissements d'un membre",
  perms: `\`MANAGE_CHANNELS\``,
  
  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      const embedPerms = new MessageEmbed()
        .setColor(color)
        .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
      return message.channel.send(embedPerms);
    }

    const embedbotPerms = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
    .setTimestamp()
    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(embedbotPerms)

    const user = message.mentions.members.first();

    if (!user) {
      const embedUser = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.ResetWarnErrorNoPerson}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedUser);
    }

    if (message.mentions.users.first().bot) {
      const embedBot = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.ResetWarnErrorBot}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedBot);
    }
    const [index, userInfo] = [guildInfo.users.findIndex(userInfo => userInfo.id === user.id), guildInfo.users.find(userInfo => userInfo.id === user.id)];
    const warnings = userInfo.warnings;

    if (warnings === null || warnings == 0) {
      const embedAvert2 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.ResetWarnErrorUserNoAvert}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedAvert2);
    }

    delete userInfo.warnings;
      try {
          await client.db.guilds.findOneAndUpdate({
              id: message.guild.id,
              'users.id': user.id
          }, {
              $set: {
                'users.$.warnings': user.id
              }
          });
      } catch (error) {
          return;
      }

    const embedAvert4 = new MessageEmbed()
      .setColor(color)
      .setDescription(`${lang.ResetWarnFinalMessage1} ${user} ${lang.ResetWarnFinalMessage2} \n \n ${lang.BanAuthor} <@${message.author.id}>`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    await message.channel.send(embedAvert4);

    const embedAvertLog = new MessageEmbed()
      .setColor(color)
      .setDescription(`${lang.ResetWarnFinalMessage1} ${user} ${lang.ResetWarnFinalMessage2} \n \n ${lang.BanAuthor} <@${message.author.id}>`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (!logchannel) return;
    logchannel.send(embedAvertLog);
  },
};

const {
  MessageEmbed,
} = require('discord.js');
const Pagination = require('discord.js-pagination');
const Discord = require('discord.js');
const {
  blue,
  emojiAttention,
  owner
} = require('../../../config.json');

module.exports = {
  name: 'whitelist',
  description: 'Affiche les commandes de whitelist',
  aliases: ['wl'],
  usage: 'whitelist (donne la liste des commandes)',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.RoleReactionErrorNoOwner}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    if (!message.guild.owner) {
      return message.channel.send(WLAlready)
    }

    if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {
      const help1 = new MessageEmbed()
        .setColor(color)
        .setTitle(`**✩ __${lang.WhitelistEmbedChannelsTitle}__ ✩**`)
        .addField(`**${lang.WhitelistEmbedChannelsWarn1}**`, `${emojiAttention} ${lang.WhitelistEmbedChannelsWarn2}`)
        .addField(`• \`wlc + add + <#channel>\``, `*${lang.WhitelistEmbedChannelsAdd}*`)
        .addField(`• \`wlc + remove + <#channel>\``, `*${lang.WhitelistEmbedChannelsRemove}*`)
        .addField(`• \`wlc + list\``, `*${lang.WhitelistEmbedChannelsList}*`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      const help2 = new MessageEmbed()
        .setColor(color)
        .setTitle(`**✩ __${lang.WhitelistEmbedUsersTitle}__ ✩**`)
        .addField(`**${lang.WhitelistEmbedUsersWarn1}**`, `${emojiAttention} ${lang.WhitelistEmbedUsersWarn2}`)
        .addField(`• \`wlu + add + <@user>\``, `*${lang.WhitelistEmbedUsersAdd}*`)
        .addField(`• \`wlu + remove + <@user>\``, `*${lang.WhitelistEmbedUsersRemove}*`)
        .addField(`• \`wlu + list\``, `*${lang.WhitelistEmbedUsersList}*`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      const pages = [
        help1,
        help2,
      ];

      const emojiList = ['⬅️', '➡️'];

      const timeout = 500000;

      Pagination(message, pages, emojiList, timeout);
    } else {
      return message.channel.send(WLAlready);
    }


  },
};
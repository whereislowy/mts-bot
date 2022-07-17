const MessageEmbed = require('discord.js');
const Discord = require('discord.js');
const {
  blue,
  emojiAttention,
  owner,
  prefix
} = require('../../../config.json');

module.exports = {
  name: 'wlc',
  description: 'Ajout, suppression, list des salons whitelists',
  aliases: ['whitelistc', 'wlchannels'],
  usage: 'wlc + add | remove + <@user>',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang, guildInfo) {

    let color = guildInfo.color

    /// //////////////////////////////////////////////////////////////
    /// /////////////////////// EMBED ///////////////////////////////
    /// ////////////////////////////////////////////////////////////
    let prefixbot = guildInfo.prefix
    const WLnoDB = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLChannelsErrorNoWL}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const WLnoChannel = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLChannelsErrorNoChannel}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLChannelsErrorAlready}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const WLNoFind = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLChannelsErrorChannelNoExist}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const WLNoArgs = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} ${lang.OwnerBadArgs} \n${prefixbot}wlc **add** + <#channel> \n${prefixbot}wlc **remove** + <#channel> \n${prefixbot}wlc **list**`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const NoWL = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.WLUsersErrorNoOwner}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    if (!message.guild.owner) {
      return message.channel.send(NoWL)
    }

    if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {
      if (!(args[0])) return message.channel.send(WLNoArgs);

      let channelID;
      if ((args[0]) === 'add') {
        if (args[1]) channelID = args[1].replace(/[<>#]/g, '');
        else return message.channel.send(WLnoChannel);

        if (guildInfo.whitelist.channels.includes(channelID)) {
          return message.channel.send(WLAlready);
        }

        const channel = message.guild.channels.cache.get(channelID);
        if (!channel) {
          return message.channel.send(WLNoFind);
        }

        await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $push: { 'whitelist.channels': channelID}});

        const WLadded = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`<@${message.author.id}> ${lang.WlChannelsWordChannel} **${channel}** ${lang.WLUsersAdded}`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLadded);
      }
      if (args[0] === 'remove') {
        if (args[1]) channelID = args[1].replace(/[<>#]/g, '');
        else return message.channel.send(WLnoChannel);

        if (!guildInfo.whitelist.channels.includes(channelID)) {
          return message.channel.send(WLnoDB);
        }

        await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $pull: { 'whitelist.users': memberID}});
        const channel = message.guild.channels.cache.get(channelID);

        const WLRemoved = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.WlChannelsWordChannel} **${channel || channelID}** ${lang.WLUsersRemoved}`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLRemoved);
      }
      if (args[0] === 'list') {
        const list = guildInfo.whitelist.channels
        const result = list.length <= 1 ? lang.WlUsersNoUsers : list.map(channel => `<#${channel}>`).join(" ")
        const WLList = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.WLChannelsFinalMessage} ${result}`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLList);
      }
    } else {
      return message.channel.send(NoWL);
    }

  },
};
const Discord = require('discord.js');
const {
  blue,
  emojiAttention,
  owner,
  prefix
} = require('../../../config.json');

module.exports = {
  name: 'wlu',
  description: 'Ajout, suppression, list des utilisateurs whitelists',
  aliases: ['whitelistu', 'wluser'],
  usage: 'wlu add | remove + <@user>',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang, guildInfo) {

    let color = guildInfo.color

    /// //////////////////////////////////////////////////////////////
    /// /////////////////////// EMBED ///////////////////////////////
    /// ////////////////////////////////////////////////////////////

    let prefixbot = guildInfo.prefix

    const WLnoUser = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLUsersErrorNoMention}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLUersErrorAlreadyWL}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const WLNoFind = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLUsersErrorUserNoExist}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const WLNoArgs = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} ${lang.OwnerBadArgs} \n${prefixbot}wlu **add** + <@user> \n${prefixbot}wlu **remove** + <@user> \n${prefixbot}wlu + **list**`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    const WLnoDB = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`<@${message.author.id}> ${lang.WLUsersErrorNoWL}`)
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

      let memberID;

      if ((args[0]) === 'add') {
        if (args[1]) memberID = args[1].replace(/[<>!@]/g, '');
        else return message.channel.send(WLnoUser);

        if (guildInfo.whitelist.users.includes(memberID)) {
          return message.channel.send(WLAlready);
        }

        const member = message.guild.members.cache.get(memberID);
        if (!member) {
          return message.channel.send(WLNoFind);
        }

        await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $push: { 'whitelist.users': memberID}});

        const WLadded = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`<@${message.author.id}> ${lang.OwnerEmbedMessage1} **${member.user}** ${lang.WLUsersAdded}`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLadded);
      }
      if (args[0] === 'remove') {
        if (args[1]) memberID = args[1].replace(/[<>!@]/g, '');
        else return message.channel.send(WLnoUser);

        if (!guildInfo.whitelist.users.includes(memberID)) {
          return message.channel.send(WLnoDB);
        }

        await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $pull: { 'whitelist.users': memberID}});

        const WLRemoved = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.OwnerEmbedMessage1} **${message.guild.members.cache.get(memberID).user || memberID}** ${lang.WLUsersRemoved}`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLRemoved);
      }
      if (args[0] === 'list') {
        const list = guildInfo.whitelist.users
        const result = list.length <= 1 ? lang.WlUsersNoUsers : list.map(user => `<@${user}>`).join(" ")
        const WLList = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.WLUsersUsers} ${result}`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        return message.channel.send(WLList);
      }
    } else {
      return message.channel.send(NoWL);
    }
  },
};
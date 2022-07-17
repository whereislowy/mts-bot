const {
  MessageEmbed,
} = require('discord.js');
const ms = require('ms');
const {
  blue,
  logs,
  emojiAttention,
} = require('../../../config.json');
const Discord = require('discord.js')

module.exports = {
  name: 'warn',
  usage: 'warn <@user> <reason>',
  description: 'Warn la personne mentionné',
  aliases: ['warn'],
  perms: `\`MANAGE_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

    let color = guildInfo.color

    let muteRole;
    if (message.guild.roles.cache.get(guildInfo.roleMuted)) {
      let role = message.guild.roles.cache.get(guildInfo.roleMuted)
      if(!role) return;
      muteRole = role.id
    } else {
      let rolee = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');
      if(!rolee) return;
      muteRole = rolee.id
    }

    if (!message.member || message.channel.type == 'dm') return;

    const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs);

    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      const embedPerms = new MessageEmbed()
        .setColor(color)
        .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.ClearErrorNoPerms}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedPerms);
    }

    const user = message.mentions.members.first();

    if (!user) {
      const embedUser = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorNoPerson}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedUser);
    }

    if (message.mentions.users.first().bot) {
      const embedBot = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorBot}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedBot);
    }

    if (message.author.id === user.id) {
      const embedWarn = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorYourself}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedWarn);
    }

    if (user.id === message.guild.owner.id) {
      const embedOwner = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorUserOwner}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedOwner);
    }

    const reason = args.slice(1).join(' ') || `${lang.BanNoReason}`;

    if (!reason) {
      const embedRaison = new MessageEmbed()
        .setColor(color)
        .setDescription(`${lang.WarnErrorNoReason1} \n **${guildInfo.prefix}warn <@user> <reason>**`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      return message.channel.send(embedRaison);
    }

    const [index, userInfo] = [guildInfo.users.findIndex(userInfo => userInfo.id === user.id), guildInfo.users.find(userInfo => userInfo.id === user.id)];
    const warnings = userInfo.warnings


    const muteTime = ('3600s');

    if (warnings === 4) {
      const embedWarn4 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user}, ${lang.WarnUserLimit}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      message.channel.send(embedWarn4);

      if (!muteRole) return;
      try {
        user.roles.add(muteRole);
      } catch {

      }

      setTimeout(() => {
        try {
          user.roles.remove(muteRole);
        } catch {

        }
      }, ms(muteTime));

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
    } else if (warnings === null) {
      const warnings2 = userInfo.warnings;

      const embedAvert2 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.WarnEmbedFinal1} \n \n ${lang.BanAuthor} <@${message.author.id}> \n${lang.BanReason} ${reason}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      const embedAdvertLog = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.WarnEmbedFinal1} \n \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason} \n ${lang.WarnEmbedNumber1} ${warnings2 + 1} ${lang.WarnEmbedNumber2}`)
        .setThumbnail(message.mentions.users.first().avatarURL())
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        try {
            await client.db.guilds.findOneAndUpdate({
                id: message.guild.id
            }, {
                $set: {
                    [`users[${index}].warnings`]: 1
                }
            });
        } catch (error) {
            return;
        }
      await message.channel.send(embedAvert2);

      if (!logchannel) return;
      logchannel.send(embedAdvertLog);

    } else if (warnings !== null) {
      const warnings2 = userInfo.warnings;

      const embedAvert4 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.WarnEmbedFinal1} \n \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      const embedAdvertLog1 = new MessageEmbed()
        .setColor(color)
        .setDescription(`${user} ${lang.WarnEmbedFinal1} \n \n ${lang.BanAuthor} <@${message.author.id}> \n ${lang.BanReason} ${reason} \n ${lang.WarnEmbedNumber1} ${warnings2 + 1} ${lang.WarnEmbedNumber2}`)
        .setThumbnail(message.mentions.users.first().avatarURL())
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

      if (!logchannel) return;
      logchannel.send(embedAdvertLog1);

      delete user.tempvoc;
      try {
          await client.db.guilds.findOneAndUpdate({
              id: message.guild.id
          }, {
              $inc: {
                  [`users[${index}].warnings`]: 1
              }
          });
      } catch (error) {
          return;
      }
      await message.channel.send(embedAvert4);
    }
  },
};
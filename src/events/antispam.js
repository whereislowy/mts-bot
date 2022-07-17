const Discord = require('discord.js');
const {
  cooldownMessageTime,
  muteSpamTime,
  linkMuteTime,
  logs,
  blue,
  emojiAttention,
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
  const tmpUserCooldown = [];

  client.on('anti_spam', async (message) => {

    if (!message) return;
    if (!message.guild) return;

    if (!await client.db.guilds.findOne({
        id: message.guild.id
      })) {
      const guildSchema = new client.db.schemas.guild({
        id: message.guild.id
      });
      const antiRaidSchema = new client.db.schemas.raid({
        server: message.guild.id
      });
      await client.db.raids.insert(antiRaidSchema);
      await client.db.guilds.insert(guildSchema);
    }

    const guildInfo = await client.db.guilds.findOne({
      id: message.guild.id
    });
    const raidInfo = await client.db.raids.findOne({
      server: message.guild.id
    });
    if (!guildInfo || !raidInfo) return;

    let color = guildInfo.color

    let language = guildInfo.language
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!message.member || message.channel.type == 'dm') return;
    if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
    if (message.member.hasPermission('ADMINISTRATOR')) return;
    if (message.author.flags.has('VERIFIED_BOT')) return

    if (guildInfo.owner === undefined || guildInfo.owner === null) return;
    if (guildInfo.whitelist.users === undefined || guildInfo.whitelist.users === null) return;
    if (guildInfo.whitelist.channels === undefined || guildInfo.whitelist.channels === null) return;

    if (guildInfo.whitelist.users.includes(message.author.id)) return;
    if (guildInfo.owner.includes(message.author.id)) return;
    if (guildInfo.whitelist.channels.includes(message.channel.id)) return;

    if (message.author.id == client.user.id) return;

    const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

    let muteRole;
    if (message.guild.roles.cache.get(guildInfo.roleMuted)) {
      let role = message.guild.roles.cache.get(guildInfo.roleMuted)
      if (!role) return;
      muteRole = role.id
    } else {
      let rolee = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');
      if (!rolee) return;
      muteRole = rolee.id
    }

    if (!muteRole) return;

    let choice = raidInfo.antispam;
    if (choice == undefined || choice == null) {
      choice = true;
    }

    if (choice === true) {

      if (message.content.length > 1000) {
        try {
          message.delete()
        } catch {
          return;
        }
        if (!tmpUserCooldown.find((x) => x.id == message.author.id)) {
          tmpUserCooldown.push({
            id: message.author.id,
            nbr: 1,
            messages: [],
          });
        } else {
          tmpUserCooldown.find((x) => x.id == message.author.id).nbr += 1;
        }
        if (!muteRole) {
          return message.channel.send(`${emojiAttention} ${lang.AntilinkNoMuteRole} **${guildInfo.prefix}setup** / **${guildInfo.prefix}setmuterole**`).then((mssg) => {
            try {
              mssg.delete({
                timeout: 10000,
              })
            } catch {

            }
          });
        }

        if (!message.member.roles.cache.find((x) => x.id == muteRole)) {
          try {
            message.member.roles.add(muteRole);
          } catch {

          }
        }
        tmpUserCooldown.find((x) => x.id == message.author.id).messages.forEach((m) => {
          m.delete().catch(() => {

          });
        });
        message.reply(`${lang.AntispamMuted}`).then((mssg) => {
          try {
            mssg.delete({
              timeout: 10000,
            })
          } catch {

          }
        });

        const logEmbed1 = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkLogMuted}\n ${lang.BanReason} Spam ${lang.AntispamCaract}.`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!logchannel) return;
        logchannel.send(logEmbed1);
        setTimeout(() => {
          tmpUserCooldown.find((x) => x.id == message.author.id).nbr = 0;
          if (message.member.roles.cache.find((x) => x.id == muteRole)) {
            try {
              message.member.roles.remove(muteRole).then(() => {
                const logEmbed2 = new Discord.MessageEmbed()
                  .setColor(color)
                  .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkUnmute}\n ${lang.BanReason} Spam ${lang.AntispamCaract}.`)
                  .setTimestamp()
                  .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                if (!logchannel) return;
                logchannel.send(logEmbed2);
              });
            } catch {

            }
          }
        }, muteSpamTime);
      }
      if (!tmpUserCooldown.find((x) => x.id == message.author.id)) {
        tmpUserCooldown.push({
          id: message.author.id,
          nbr: 1,
          messages: [],
        });
      } else {
        tmpUserCooldown.find((x) => x.id == message.author.id).nbr += 1;
      }

      tmpUserCooldown.find((x) => x.id == message.author.id).messages.push(message);

      setTimeout(() => {
        tmpUserCooldown.find((x) => x.id == message.author.id).nbr = 0;
        tmpUserCooldown.find((x) => x.id == message.author.id).messages = [];
      }, cooldownMessageTime);

      if (tmpUserCooldown.find((x) => x.id == message.author.id)) {
        if (tmpUserCooldown.find((x) => x.id == message.author.id).nbr > 2 && tmpUserCooldown.find((x) => x.id == message.author.id).nbr < 5) {
          message.reply(`${lang.AntispamCalm}`).then((mssg) => {
            try {
              mssg.delete({
                timeout: 10000,
              })
            } catch {

            }
          });
        }
        if (tmpUserCooldown.find((x) => x.id == message.author.id).nbr >= 5) {
          if (!muteRole) {
            return message.channel.send(`${emojiAttention} ${lang.AntilinkNoMuteRole} **${guildInfo.prefix}setup** / **${guildInfo.prefix}setmuterole**`).then((mssg) => {
              try {
                mssg.delete({
                  timeout: 10000,
                })
              } catch {

              }
            });
          }

          if (!message.member.roles.cache.find((x) => x.id == muteRole)) {
            try {
              message.member.roles.add(muteRole);
            } catch {

            }
          }
          tmpUserCooldown.find((x) => x.id == message.author.id).messages.forEach((m) => {
            m.delete().catch(() => {

            });
          });
          message.reply(`${lang.AntispamMuted1}`).then((mssg) => {
            try {
              mssg.delete({
                timeout: 10000,
              })
            } catch {

            }
          });

          const logEmbed1 = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkLogMuted}\n ${lang.BanReason} Spam.`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

          if (!logchannel) return;
          logchannel.send(logEmbed1);

          setTimeout(() => {
            if (!message.member) return;
            tmpUserCooldown.find((x) => x.id == message.author.id).nbr = 0;
            if (message.member.roles.cache.find((x) => x.id == muteRole)) {
              try {
                message.member.roles.remove(muteRole).then(() => {
                  const logEmbed2 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkUnmute}\n ${lang.BanReason} Spam.`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                  if (!logchannel) return;
                  logchannel.send(logEmbed2);
                });
              } catch {

              }
            }
          }, muteSpamTime);
        }
      }
    } else {

    }
  });
};
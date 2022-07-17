const Discord = require('discord.js');
const MessageEmbed = require('discord.js');
const {
  linkMuteTime,
  logs,
  blue,
  emojiAttention,
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
  client.on('anti_link', async (message) => {

    if (!message) return;
    if (!message.guild) return;
    if (!message.author) return;
    if (!message.member) return;

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

    const color = guildInfo.color
    const language = guildInfo.language
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!message.guild.me.hasPermission("ADMINISTRATOR")) return
    if (message.member.hasPermission('ADMINISTRATOR')) return;
    if (message.author.flags.has('VERIFIED_BOT')) return

    if (guildInfo.owner === undefined || guildInfo.owner === null) return;
    if (guildInfo.whitelist.users === undefined || guildInfo.whitelist.users === null) return;
    if (guildInfo.whitelist.channels === undefined || guildInfo.whitelist.channels === null) return;

    if (guildInfo.whitelist.users.includes(message.author.id)) return;
    if (guildInfo.owner.includes(message.author.id)) return;
    if (guildInfo.whitelist.channels.includes(message.channel.id)) return;

    if (message.author.id == client.user.id) return;

    const channel = message.guild.channels.cache.first() || message.channel || message.channel.id;

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

    let choice1 = raidInfo.antilink;
    if (choice1 == undefined || choice1 == null) {
      choice1 = true;
    }

    if (choice1 === true) {
      if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('www.') || message.content.includes('discord.gg/')) {
        if (!message.channel.messages.cache.find((x) => x.id == message.id)) return;
        try {
          message.delete();
        } catch {
          return;
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
        message.reply(`${lang.AntilinkMuted}`).then((mssg) => {
          try {
            mssg.delete({
              timeout: 10000,
            })
          } catch {

          }
        });

        const logEmbed1 = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.AntilinkMember} <@${message.author.id}> \n ${lang.BanAction} ${lang.AntilinkLogMuted} \n ${lang.BanReason} Anti-Link.`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!logchannel) return;
        logchannel.send(logEmbed1);

        setTimeout(() => {
          if (!message.member) return;
          if (message.member.roles.cache.has(muteRole)) {
            try {
              message.member.roles.remove(muteRole).then(() => {
                const logEmbed4 = new Discord.MessageEmbed()
                  .setColor(color)
                  .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkUnmute}\n ${lang.BanReason} Anti-Link.`)
                  .setTimestamp()
                  .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                if (!logchannel) return;
                logchannel.send(logEmbed4);
              });
            } catch {}

          }
        }, linkMuteTime);
      }
    } else {

    }
  });

  /// //////////////////////////////////////////////////////////////
  /// /////////////////////// ANTI LINK EDIT //////////////////////
  /// ////////////////////////////////////////////////////////////

  client.on('messageUpdate', async (oldMsg, newMsg) => {

    if (!oldMsg) return;
    if (!newMsg) return;
    const message = newMsg;

    if (!message) return;

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

    if (!message.guild) return;

    let color = guildInfo.color

    const language = guildInfo.language
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!message.member || message.channel.type == 'dm') return;
    if (!message.guild.me.hasPermission("ADMINISTRATOR")) return
    if (message.member.hasPermission('ADMINISTRATOR')) return;

    if (guildInfo.owner === undefined || guildInfo.owner === null) return;
    if (guildInfo.whitelist.users === undefined || guildInfo.whitelist.users === null) return;
    if (guildInfo.whitelist.channels === undefined || guildInfo.whitelist.channels === null) return;

    if (guildInfo.whitelist.users.includes(message.author.id)) return;
    if (guildInfo.owner.includes(message.author.id)) return;
    if (guildInfo.whitelist.channels.includes(message.channel.id)) return;

    if (message.author.id === client.user.id) return;

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

    let choice1 = raidInfo.antilink;
    if (choice1 == undefined || choice1 == null) {
      choice1 = true;
    }

    let hasBeenApplied = false;

    if (choice1 === true) {
      if (hasBeenApplied) return;
      if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('www.') || message.content.includes('discord.gg/')) {
        if (!message.channel.messages.cache.find((x) => x.id == message.id)) return;
        try {
          message.delete();
        } catch {
          return;
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
        message.reply(`${lang.AntilinkMuted}`).then((mssg) => {
          try {
            mssg.delete({
              timeout: 10000,
            })
          } catch {

          }
        });

        const logEmbed2 = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkLogMuted}\n ${lang.BanReason} Anti-Link (Edit).`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!logchannel) return;
        logchannel.send(logEmbed2);

        hasBeenApplied = true;
        setTimeout(() => {
          if (!message.member) return;
          if (message.member.roles.cache.find((x) => x.id == muteRole)) {
            try {
              message.member.roles.remove(muteRole).then(() => {
                const logEmbed3 = new Discord.MessageEmbed()
                  .setColor(color)
                  .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkUnmute}\n ${lang.BanReason} Anti-Link (Edit).`)
                  .setTimestamp()
                  .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                if (!logchannel) return;
                logchannel.send(logEmbed3);
              });
            } catch {

            }
          }
        }, linkMuteTime);
      }
    } else {

    }
  });
};
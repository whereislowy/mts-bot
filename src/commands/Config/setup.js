const {
  logs,
  emojiAttention,
  emojiValidé,
  blue,
  owner
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
  name: 'setup',
  description: 'crée les catégories, channels et rôles necessaire au bon fonctionnement du bot',
  aliases: ['setup'],
  usage: 'setup',
  perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

  async execute(message, args, client, lang, guildInfo) {

    let color = guildInfo.color

    const WLAlready = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.SetupErrorNoOwner}`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

    if (!message.guild.owner) {
      return message.channel.send(WLAlready)
    }

    if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {

      const permsrequired = [
        'SEND_MESSAGES',
        'MANAGE_ROLES',
        'MANAGE_CHANNELS'
      ]
      const embedbotPerms = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
      if (!message.guild.me.hasPermission(permsrequired)) return message.channel.send(embedbotPerms)

      const logsch = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

      let roleID;
      let roles;
      if (message.guild.roles.cache.get(guildInfo.roleMuted)) {
        let role = message.guild.roles.cache.get(guildInfo.roleMuted)
        if (role) {
          roles = role.id
        }
      } else {
        let rolee = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');
        if (rolee) {
          roles = rolee.id
        }
      }

      //const roles = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');

      if (logsch && !roles) {
        var muteRole = await message.guild.roles.create({
          data: {
            name: '🚫・Muted',
            permissions: 0,
          },
        });
        message.guild.channels.cache.forEach((channel) => channel.createOverwrite(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false,
        }));

        await client.db.guilds.findOneAndUpdate({
          id: message.guild.id
        }, {
          $set: {
            roleMuted: muteRole.id
          }
        });
        await message.channel.send(`${emojiValidé} ${lang.SetupRoleMessage1} ${muteRole} ${lang.SetupRoleMessage2}`);
      }

      if (!logsch && roles) {
        var channel_Logs = await message.guild.channels.create(logs, {
          type: 'text',
          permissionOverwrites: [{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          }],
        });
        await client.db.guilds.findOneAndUpdate({
          id: message.guild.id
        }, {
          $push: {
            'whitelist.channels': channel_Logs.id
          }
        });
        await client.db.guilds.findOneAndUpdate({
          id: message.guild.id
        }, {
          $set: {
            'logs.channel': channel_Logs.id
          }
        });
        message.channel.send(`${emojiValidé} ${lang.SetupChannelMessage} ${channel_Logs} ${lang.SetupRoleMessage2}`);
      }

      if (logsch && roles) {
        message.channel.send(`${lang.SetupAlreadyDo}`);
      }

      if (!logsch && !roles) {
        var channel_Logs = await message.guild.channels.create(logs, {
          type: 'text',
          permissionOverwrites: [{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          }],
        });

        var muteRole = await message.guild.roles.create({
          data: {
            name: '🚫・Muted',
            permissions: 0,
          },
        });
        message.guild.channels.cache.forEach((channel) => channel.createOverwrite(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false,
        }))

        let logsid = message.guild.channels.cache.find(channel => channel.name == logs)
        if (!logsid) return
        await client.db.guilds.findOneAndUpdate({
          id: message.guild.id
        }, {
          $set: {
            roleMuted: muteRole.id
          }
        });
        await client.db.guilds.findOneAndUpdate({
          id: message.guild.id
        }, {
          $set: {
            'logs.channel': channel_Logs.id
          }
        });
        await client.db.guilds.findOneAndUpdate({
          id: message.guild.id
        }, {
          $push: {
            'whitelist.channels': channel_Logs.id
          }
        });
        await message.channel.send(`**${emojiValidé} ${lang.SetupFinalMessage1} ${channel_Logs} ${lang.SetupFinalMessage2} ${muteRole} ${lang.SetupFinalMessage3}`);
      }
    } else {
      message.channel.send(WLAlready)
    }
  }
};
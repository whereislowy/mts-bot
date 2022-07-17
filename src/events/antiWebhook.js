const Discord = require('discord.js');
const {
  blue,
  logs,
  emojiValidé,
  emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
  client.on('webhookUpdate', async (channel) => {

    if(!channel) return;
    if(!channel.guild) return;

    if (!await client.db.guilds.findOne({
      id: channel.guild.id
  })) {
  const guildSchema = new client.db.schemas.guild({
      id: channel.guild.id
  });
  const antiRaidSchema = new client.db.schemas.raid({
      server: channel.guild.id
  });
  await client.db.raids.insert(antiRaidSchema);
  await client.db.guilds.insert(guildSchema);
}

    const guildInfo = await client.db.guilds.findOne({
      id: channel.guild.id
    });
    const raidInfo = await client.db.raids.findOne({
      server: channel.guild.id
  });
  if (!guildInfo || !raidInfo) return;

    const color = guildInfo.color
    const language = guildInfo.language
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return
    let choice2 = raidInfo.antiwebhook

    if (choice2 == undefined || choice2 == null) {
      choice2 = true;
    }

    if (choice2 === true) {
      const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'WEBHOOK_CREATE',
      });

      if (!fetchedLogs) return;

      const WebhookLog = fetchedLogs.entries.first();

      if (!WebhookLog) return;

      const {
        executor,
        target,
      } = WebhookLog;

      if (executor == client.user.id) return;
      const member = channel.guild.members.cache.get(executor.id)
      if (member) {
        if (member.roles.highest.position >= channel.guild.me.roles.highest.position) return;
      }
      if (executor.flags.has('VERIFIED_BOT')) return

      if (guildInfo.owner === undefined || guildInfo.owner === null) return;
      if (guildInfo.whitelist.users === undefined || guildInfo.whitelist.users === null) return;

      if (guildInfo.whitelist.users.includes(executor.id)) return;
      if (guildInfo.owner.includes(executor.id)) return;

      if (WebhookLog) {

        const logchannel = channel.guild.channels.cache.get(guildInfo.logs.channel) || channel.guild.channels.cache.find((ch) => ch.name === logs)

        let channelnuke = channel.guild.channels.cache.get(channel.id)
        if (!channelnuke) return;
        let posisi = channelnuke.position

        try {
          channelnuke.delete()
        } catch {

        }
        channelnuke.clone().then((channel2) => {
          try {
            channel2.setPosition(posisi)
          } catch {

          }
          const renew2 = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiValidé} ${lang.NukeRecreated}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
          channel2.send(renew2)
        })

        if (!channel.guild.me.hasPermission("BAN_MEMBERS")) return;
        if (guildInfo.sanction === 'ban') {
          try {
            channel.guild.members.ban(executor, {
              reason: 'Anti-Webhook',
            });
          } catch (error) {
            return;
          }
        }

        if (!channel.guild.me.hasPermission("KICK_MEMBERS")) return;
        if (guildInfo.sanction === 'kick') {
          try {
            channel.guild.member(executor).kick('Anti-Webhook')
          } catch (error) {
            return;
          }
        }

        // if (!channel.guild.me.hasPermission("MANAGE_ROLES")) return;
        // if (guildInfo.sanction === 'derank') {
        //   try {
        //     member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
        //   } catch (error) {
        //     return;
        //   }
        // }

        const embed = new Discord.MessageEmbed()
          .setColor(color)
          .setDescription(`${lang.Antiwebhook} <@${executor.id}>. \n ${lang.Antiwebhook1} ${guildInfo.sanction} ${lang.Antiwebhook2}`)
          .setTimestamp()
          .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        if (!logchannel) return
        try {
          logchannel.send(embed);
        } catch (error) {
          return;
        }
      }
    }
  });
};
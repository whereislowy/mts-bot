const {
  blue,
  emojiAttention,
  prefix
} = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = (client) => {
  client.on('prefix_bot', async (message) => {

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

    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return

    let color = guildInfo.color

    let language = guildInfo.language
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    if (!message.member || message.channel.type == 'dm') return;
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return
    if (message.mentions.members && message.mentions.members.first()) {
      if (message.mentions.members.first().id === client.user.id) {
        let prefixbot = guildInfo.prefix
        if (prefixbot === null || prefixbot === undefined) {
          prefixbot = prefix
        }
        message.channel.send({
          embed: {

            color: color,
            description: `${lang.Prefix} **${prefixbot}**`,
            footer: {
              icon_url: `${client.user.displayAvatarURL()}`,
              text: `${client.user.username} © 2021`,
            },
          },
        });
      }
    }
  });
};
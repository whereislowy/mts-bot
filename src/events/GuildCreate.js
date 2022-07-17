const Discord = require('discord.js');
const {
  blue,
  emojiValidé,
  emojiAttention,
  prefix
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
  client.on('guildCreate', async (guild) => {
    if (!guild) return;

    const guildSchema = new client.db.schemas.guild({
      id: guild.id
    });
    const antiRaidSchema = new client.db.schemas.raid({
      server: guild.id
    });
    await client.db.raids.insert(antiRaidSchema);
    await client.db.guilds.insert(guildSchema);
    const guildInfo = await client.db.guilds.findOne({
      id: guild.id
    });

    let color = guildInfo.color

    let language = guildInfo.language
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

    let mtschannel = client.guilds.cache.get('797477459762610238').channels.cache.find((c) => c.id === '812412959636324385')
    const msg = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`• Bot ajouté sur : **${guild.name}** \n • Membres : **${guild.memberCount}** \n • Boosts : **${guild.premiumSubscriptionCount}** <a:boosters:800822501856641045>`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    mtschannel.send(msg)

    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(`${emojiValidé} Merci d'avoir ajouté MTS BOT à votre serveur **${guild.name}** !  \n\n - Pour changer la langue, vous devez faire : **${prefix}language (fr / eng)** - Pour que le bot fonctionne, vous allez devoir faire **${prefix}setup**.\n - Par la suite vous devrez faire **${prefix}wl** et ajouter au moins 1 salon et 1 utilisateur \u200B dans la whitelist de chaque, sinon les antispam, antilink etc ne marcheront pas ! \n **Discord de support**: https://discord.gg/9VkGNECv3v Merci de nous indiquez ici si vous constatez des erreurs de commandes / des suggestions.`)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    if (guild.owner) {
      try {
        guild.owner.send(embed)
      } catch {
        return;
      }
    }
  });
};
const Discord = require('discord.js');
const fs = require('fs').promises;
const {
    blue,
    emojiValidé,
    emojiAttention
} = require('../../config.json');

module.exports = (client) => {
    client.on('guildDelete', async (guild) => {

        if (!guild) return;

        const guildInfo = await client.db.guilds.findOne({
            id: guild.id
        });

        if (guild.name === undefined) return;
        let color = guildInfo.color

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        let mtschannel = client.guilds.cache.get('797477459762610238').channels.cache.find((c) => c.id === '812412959636324385')

        const msg = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`• Bot retiré sur : **${guild.name}** \n • Membres : **${guild.memberCount}** \n • Boosts : **${guild.premiumSubscriptionCount}** <a:boosters:800822501856641045>`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        mtschannel.send(msg)
        await client.db.guilds.remove({id: guild.id});
        await client.db.raids.remove({server: guild.id})
    });
};
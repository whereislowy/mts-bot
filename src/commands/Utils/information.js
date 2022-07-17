const {
    MessageEmbed,
} = require('discord.js');
const {
    blue,
    emojiAttention,
    prefix
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'information',
    description: 'Envoie les informations à propos du bot',
    aliases: ['info', 'infos', 'informations'],
    usage: 'information',
    perms: `\`SEND_MESSAGES\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color
        let prefixbot = guildInfo.prefix
        let language = guildInfo.language

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`<:infos:830166024270774293> ${lang.InformationEmbedTitle}`)
            .setDescription(`<:cmd:830170171577466880> ${client.user.username} ${lang.InformationEmbed1} **${client.guilds.cache.size}** ${lang.InformationEmbed2} | **${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}** ${lang.InformationEMbed3} \n
**${lang.InformationEmbed4}** \n <:discord:797805283514515477> [${lang.InformationEmbed5}](https://discord.gg/9VkGNECv3v) 
<:support:830172157161504808> [${lang.InformationEmbed6}](https://discord.com/api/oauth2/authorize?client_id=809104772178903051&permissions=8&scope=bot)
<:topgg:829664711989657631> [Top.gg](https://top.gg/bot/809104772178903051)`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        const msg = await message.channel.send(embed)

    }
}
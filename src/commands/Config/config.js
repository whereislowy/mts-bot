const {
    emojiAttention,
    blue,
    prefix,
    owner,
    logs
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'config',
    aliases: ['configuration', 'settings', 'setting'],
    description: 'Affiche les paramètres du bot',
    usage: 'config',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color
        let prefixbot = guildInfo.prefix
        const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)
        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.LangErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if(!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {

            let sanction = guildInfo.sanction
            if (!sanction) {
                sanction = `ban`
            }
            if (!logchannel) {
                channel = `Non défini`
            }

            let categorytempvoc;
            let categorytempvocID = guildInfo.tempvoc.category
            if (!categorytempvocID) {
                categorytempvoc = `Non défini`
            }
            categorytempvoc = message.guild.channels.cache.get(categorytempvocID)
            if (!categorytempvoc) {
                categorytempvoc = `Non défini`
            }

            let tempvocal;
            let tempvocalID = guildInfo.tempvoc.channel
            if (!tempvocalID) {
                tempvocal = `Non défini`
            }
            tempvocal = message.guild.channels.cache.get(tempvocalID)
            if (!tempvocal) {
                tempvocal = `Non défini`
            }
            if (tempvocal.parentID !== categorytempvocID) {
                tempvocal = `Non défini`
            }

            let roles = message.guild.roles.cache.get(guildInfo.roleMuted) || message.guild.roles.cache.find((role) => role.name === '🚫・Muted');

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`<:engrenage:797865431805198336> Configuration :`)
                .setDescription(`**Language :** ${guildInfo.language} ${guildInfo.language === 'fr' ? `🇫🇷` : `🇬🇧`}
            **Channel Logs :** ${logchannel}
            **Role Muted :** ${roles}
            **Prefix :** ${prefixbot}
            **Sanction :** ${sanction}
            **Color :** ${color}
            **Tempvocal :** *Channel :* ${tempvocal}
            `)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
            message.channel.send(embed)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}
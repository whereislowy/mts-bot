const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
    emojiON,
    emojiOFF,
    prefix
} = require('../../../config.json');

module.exports = {
    name: 'logs',
    description: 'affiche les logs activés / désactivés du discord',
    aliases: ['logs'],
    usage: 'logs',
    perms: `\`ADMINISTRATOR\``,

    async execute(message, args, client, lang, guildInfo) {
        const prefix = guildInfo.prefix;
        const color = guildInfo.color;
        const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)
        
        const NoPerms = new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.permsAdmin}`)
        .setTimestamp()
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const embedbotPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(NoPerms);

        const logsBan = guildInfo.logs.bans ? emojiON:emojiOFF
        const logsChannel = guildInfo.logs.channels ? emojiON:emojiOFF
        const logsMessages = guildInfo.logs.messages ? emojiON:emojiOFF
        const logsRoles = guildInfo.logs.roles ? emojiON:emojiOFF

        const soutien = new Discord.MessageEmbed()
            .setTitle(`${lang.LogsServEmbed}`)
            .setColor(color)
            .setDescription(`• Logs ban : ${logsBan} \n • Logs channels : ${logsChannel} \n • Logs messages : ${logsMessages} \n • Logs Rôles : ${logsRoles}`)
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`)
        message.channel.send(soutien)

    }
}
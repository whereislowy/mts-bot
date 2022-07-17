const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
} = require('../../../config.json');

module.exports = {
    name: 'rolecheck',
    description: 'Affiche le nombre de personne possedant un rôle',
    aliases: ['rolecheck', 'rolec'],
    usage: 'rolec + <@user>',
    perms: `\`MENTION_EVERYONE\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color

        const NoPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.roleCheckNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!message.member.hasPermission('MENTION_EVERYONE')) return message.channel.send(NoPerms);

        const embedbotPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        if (!message.guild.me.hasPermission("MENTION_EVERYONE")) return message.channel.send(embedbotPerms)

        const roleRegex = /(<@&(\d{17,19})>)|(^\d{17,19}$)/g
        const prblm = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} ${lang.roleCheckErrorRole}`)
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`)

        if (!args[0] || !args[0].match(roleRegex)) return message.channel.send(prblm)

        const role = await message.guild.roles.fetch(args[0].replace(/[<@&>]/g, ''))
        const norole = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${lang.roleCheckErrorInvalidRole}`)
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`)
        if (!role) return message.channel.send(norole)

        const security1 = new Discord.MessageEmbed()
            .setTitle('💠 Role checker:')
            .setColor(color)
            .setDescription(`• ${role.members.size} ${lang.roleCheckFinalMessage}`)
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`)

        return message.channel.send(security1)
    },
};
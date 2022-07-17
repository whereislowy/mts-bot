const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
    emojiON,
    emojiOFF
} = require('../../../config.json');

module.exports = {
    name: 'security',
    description: 'Affiche les sécurités du discord',
    aliases: ['secur', 'security', 'sec'],
    usage: 'security',
    perms: `\`ADMINISTRATOR\``,

    async execute(message, args, client, lang, guildInfo, raidInfo) {

        const color = guildInfo.color;


        const embedPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.permsAdmin}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(embedPerms);

        const embedbotPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.channel.send(embedbotPerms)

        const antispam = raidInfo.antispam ? emojiON : emojiOFF

        const antilink = raidInfo.antilink ? emojiON : emojiOFF
        const antiwebhook = raidInfo.antiwebhook ? emojiON : emojiOFF
        const antiban = raidInfo.antiban ? emojiON : emojiOFF
        const antirole = raidInfo.antirole ? emojiON : emojiOFF
        const antiword = raidInfo.antiword ? emojiON : emojiOFF
        // const antibot = raidInfo.antibot ? emojiON:emojiOFF
        const antichannel = raidInfo.antichannel ? emojiON : emojiOFF
        const antieveryone = raidInfo.antieveryone ? emojiON : emojiOFF
        const security = new Discord.MessageEmbed()
            .setTitle(`${lang.SecurityServEmbed}`)
            .setColor(color)
            .setDescription(`• Antispam : ${antispam} \n • Antilink : ${antilink} \n • Antiwebhook : ${antiwebhook} \n • Antiban : ${antiban} \n • Antichannel : ${antichannel} \n • Antieveryone : ${antieveryone} \n • Antirole : ${antirole} \n • Antiword : ${antiword}`)
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`)
        message.channel.send(security)

    },
};
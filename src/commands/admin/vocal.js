const Discord = require("discord.js");
const {
    blue,
    emojiValidé,
    emojiAttention,
    emojiVocal,
    emojiMuted,
    emojiDeaf
} = require('../../../config.json')

module.exports = {
    name: 'vocal',
    aliases: ['voc', 'vocal'],
    description: 'Affiche le nombre de personne en vocal sur le discord',
    usage: 'vocal',
    perms: `\`ADMINISTRATOR\``,
    
    async execute(message, args, client, lang, guildInfo) {

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

        let size = message.guild.members.cache.filter(m => m.voice.channel).size
        // let vocmute = message.guild.members.cache.filter(m => m.voice.mute).size
        // let vocdeaf = message.guild.members.cache.filter(m => m.voice.deaf).size
        const vocal = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiVocal} ${lang.VocalEmbed1} **${size}** ${lang.VocalEmbed2}`)
            // \n ${emojiMuted} Il y a **${vocmute}** personnes mute \n ${emojiDeaf} Il y a **${vocdeaf}** personnes mute casque
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        message.channel.send(vocal)
    }
}
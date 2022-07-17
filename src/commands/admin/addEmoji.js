const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
    emojiON,
    emojiOFF,
    emojiValidé,
    prefix
} = require('../../../config.json');
const { parse } = require("twemoji-parser");

module.exports = {
    name: 'addemoji',
    description: 'Ajoute un émoji sur le Discord',
    aliases: ['ae'],
    usage: 'addemoji <emoji> <nom>',
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

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(NoPerms);

        const emoji = args[0];
        if (!emoji) return message.channel.send(`${lang.unvalidEmoji}`);

        let customemoji = Discord.Util.parseEmoji(emoji);

        if (customemoji.id) {
            const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
        customemoji.animated ? "gif" : "png"
    }`;
            const name = args[1];
            if (!name.match(/^([a-zA-Z ]+)$/)) {
                return message.channel.send(`${lang.unvalidCaracterEmoji}`)
            }
            message.guild.emojis.create(
                `${Link}`,
                `${name || `${customemoji.name}`}`
            ).catch(error => {
            })
            const emojiname = client.emojis.cache.find((emoji) => emoji.id === '797862184126382170');
            const emojiid = client.emojis.cache.find((emoji) => emoji.id === '797865238028222495');
            const Added = new Discord.MessageEmbed()
                .setTitle(`${emojiValidé} ${lang.EmojiAdded}`)
                .setColor(color)
                .setDescription(`__**${lang.EmojiAddedInformations}:**__\n\n ${emojiname} **${lang.EmojiAddedNom}:** \`${name || `${customemoji.name}`}\`\n ${emojiid} **ID:** \`${customemoji.id}\``)
                .setImage(`${Link}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
            return message.channel.send(Added).catch(e => {
            })
        } else {
            let CheckEmoji = parse(emoji, {
                assetType: "png"
            });
            if (!CheckEmoji[0])
                return message.channel.send(`${lang.unvalidEmoji}`);
            message.channel.send(
                `${lang.EmojiNormal}`
            );
        }
    }
}
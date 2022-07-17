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

module.exports = {
    name: 'premium',
    description: 'Ajoute un émoji sur le Discord',
    aliases: ['premium'],
    usage: 'premium <emoji> <nom>',
    perms: `\`makrag\``,

    async execute(message, args, client, lang, guildInfo) {

        const prefix = guildInfo.prefix;
        const color = guildInfo.color;
        const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)
        
        if (message.author.id !== '739504971128635505') {
            return;
        }
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(` <:number_one:832945812295647234> Merci d'envoyer 2€ à : https://paypal.me/pools/c/8vi5esdycJ \n
        <:number_two:832947423030411294> Envoyer une preuve du paiement (screen).`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        message.channel.send(embed)
    }
}
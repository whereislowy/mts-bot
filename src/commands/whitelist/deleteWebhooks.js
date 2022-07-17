const Discord = require("discord.js");
const {
    blue,
    emojiValidé,
    emojiAttention,
    prefix
} = require('../../../config.json');

module.exports = {
    name: 'deletewebhooks',
    description: 'Supprime tous les webhooks du Discord',
    aliases: ['deletewebhook', 'deletewebhooks', 'dwebhooks', 'dwebhook'],
    usage: 'dwebhooks',
    perms: `\`Whitelist\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.WhitelistNoInWL}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);


        if (!message.guild.owner) return;

        if (!guildInfo.whitelist.users.includes(message.author.id)) {
            return message.channel.send(WLAlready);
        }

        const hooks = message.guild.fetchWebhooks().then(webhooks => {
                webhooks.forEach(webhook => {
                    try {
                        webhook.delete()
                    } catch {

                    }
                })
                const webhooksdeleted = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`**${webhooks.size}** ${lang.deletewebhooks}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                message.channel.send(webhooksdeleted)
            })
            .catch()
    }
}
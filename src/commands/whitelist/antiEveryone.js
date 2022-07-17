const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
    prefix
} = require('../../../config.json');

module.exports = {
    name: 'antieveryone',
    description: 'Désactive / Active l\'Antieveryone',
    aliases: ['antieveryone', 'Antieveryone'],
    usage: 'antieveryone [on/off]',
    perms: `\`Whitelist\``,

    async execute(message, args, client, lang, guildInfo) {

        const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

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
        if (args[0] === 'on') {
            await client.db.raids.findOneAndUpdate({
                server: message.guild.id
            }, {
                $set: {
                    antieveryone: true
                }
            });
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiEveryoneEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} © 2021`,
                    },
                },
            });

            if (!logchannel) return
            logchannel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiEveryoneEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} © 2021`,
                    },
                },
            });
        } else if (args[0] === 'off') {
            await client.db.raids.findOneAndUpdate({
                server: message.guild.id
            }, {
                $set: {
                    antieveryone: false
                }
            });
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiEveryoneDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} © 2021`,
                    },
                },
            });

            if (!logchannel) return
            logchannel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiEveryoneDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} © 2021`,
                    },
                },
            });
        } else {
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.WhitelistPreciseOFFoON} ${lang.AntiEveryoneFinalWord}`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} © 2021`,
                    },
                },
            });
        }
    },
};
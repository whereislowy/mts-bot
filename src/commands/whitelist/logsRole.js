const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention,
    prefix
} = require('../../../config.json');

module.exports = {
    name: 'logsrole',
    description: 'Désactive / Active les logs des rôles',
    aliases: ['logrole', 'logsroles', 'logroles'],
    usage: 'logsroles [on/off]',
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
            await client.db.guilds.findOneAndUpdate({
                id: message.guild.id
            }, {
                $set: {
                    'logs.roles': true
                }
            });
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.LogsRoleEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
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
                    description: `${lang.BanAction} ${lang.LogsRoleEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} © 2021`,
                    },
                },
            });
        } else if (args[0] === 'off') {
            await client.db.guilds.findOneAndUpdate({
                id: message.guild.id
            }, {
                $set: {
                    'logs.roles': false
                }
            });
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.LogsRoleDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
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
                    description: `${lang.BanAction} ${lang.LogsRoleDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
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
                    description: `${lang.WhitelistPreciseOFFoON} ${lang.LogsRoleFinalWord}`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} © 2021`,
                    },
                },
            });
        }
    },
};
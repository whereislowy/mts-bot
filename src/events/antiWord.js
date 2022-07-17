const {
    blue,
    emojiAttention,
    prefix,
    muteSpamTime,
    logs
} = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('anti_word', async (message) => {

        if (!message) return;
        if (!message.guild) return;

        if (!await client.db.guilds.findOne({
            id: message.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: message.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: message.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({
            id: message.guild.id
        });
        const raidInfo = await client.db.raids.findOne({
            server: message.guild.id
        });
        if (!guildInfo || !raidInfo) return;

        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return

        let color = guildInfo.color
        if (!color) return;

        let muteRole;
        if (message.guild.roles.cache.get(guildInfo.roleMuted)) {
            let role = message.guild.roles.cache.get(guildInfo.roleMuted)
            if (!role) return;
            muteRole = role.id
        } else {
            let rolee = message.guild.roles.cache.find((role) => role.name === '🚫・Muted');
            if (!rolee) return;
            muteRole = rolee.id
        }
        if (!muteRole) return;

        const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)
        if (!logchannel) return;

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!message.member || message.channel.type == 'dm') return;
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return
        if (message.member.hasPermission('ADMINISTRATOR')) return;

        let choice = raidInfo.antiWords
        if (choice === undefined || choice === null) {
            choice = true;
        }

        if (choice === true) {

            if (guildInfo.owner === undefined || guildInfo.owner === null) return;
            if (guildInfo.whitelist.users === undefined || guildInfo.whitelist.users === null) return;
            if (guildInfo.whitelist.channels === undefined || guildInfo.whitelist.channels === null) return;

            if (guildInfo.whitelist.users.includes(message.author.id)) return;
            if (guildInfo.owner.includes(message.author.id)) return;
            if (guildInfo.whitelist.channels.includes(message.channel.id)) return;

            if (message.author.id == client.user.id) return;

            let dbInsulte = guildInfo.antiWords

            if (dbInsulte === null || dbInsulte === undefined) return;

            if (dbInsulte.some(insulte => message.content.includes(insulte))) {
                if (!message.channel.messages.cache.find((msg) => msg.id == message.id)) return;
                try {
                    message.delete()
                } catch {
                    return;
                }
                message.channel.send(`${message.author}, ${lang.AntiWordMuted}`).then((mssg) => {
                    try {
                        mssg.delete({
                            timeout: 10000,
                        })
                    } catch {

                    }
                });
                if (!message.member.roles.cache.find((x) => x.id == muteRole)) {
                    try {
                        message.member.roles.add(muteRole);
                    } catch {

                    }
                }

                const logEmbed1 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkLogMuted}\n ${lang.BanReason} ${lang.AntiWordBadMSG}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                if (!logchannel) return;
                logchannel.send(logEmbed1);

                setTimeout(() => {
                    if (!message.member) return;
                    if (message.member.roles.cache.find((x) => x.id == muteRole)) {
                        try {
                            message.member.roles.remove(muteRole).then(() => {
                                const logEmbed2 = new Discord.MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`${lang.AntilinkMember} <@${message.author.id}>\n ${lang.BanAction} ${lang.AntilinkUnmute}\n ${lang.BanReason} ${lang.AntiWordBadMSG}`)
                                    .setTimestamp()
                                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                                if (!logchannel) return;
                                logchannel.send(logEmbed2);
                            });
                        } catch {

                        }
                    }
                }, muteSpamTime);
            }
        }
    });
};
const usersMap = new Map();
const {
    logs,
    blue,
    emojiAttention
} = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = (client) => {

    client.on('guildBanAdd', async (guild, user) => {

        if (!guild) return;
        if (!user) return;

        if (!await client.db.guilds.findOne({
            id: guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({
            id: guild.id
        });
        const raidInfo = await client.db.raids.findOne({
            server: guild.id
        });
        if (!guildInfo || !raidInfo) return;
        const color = guildInfo.color
        const language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!guild.me.hasPermission("ADMINISTRATOR")) return;
        let choice8 = raidInfo.antiban;
        if (choice8 === undefined || choice8 === null) {
            choice8 = true;
        }

        if (choice8 === true) {

            if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;


            if (executor == client.user.id) return;
            if (executor.flags.has('VERIFIED_BOT')) return;
            const member = guild.members.cache.get(executor.id)
            if (!member) return;
            if (member) {
                if (member.roles.highest.position >= guild.me.roles.highest.position) return;
            }

            if (guildInfo.whitelist.users.includes(executor.id)) return;
            if (guildInfo.owner.includes(executor.id)) return;


            if (!usersMap.has(executor.id)) {
                usersMap.set(executor.id, 2)
                setTimeout(() => {
                    usersMap.delete(executor.id)
                }, 1000 * 60);

            } else if (usersMap.get(executor.id) === 1) {
                //usersMap.get(executor.id) == usersMap.get(executor.id) + 1;
                usersMap.set(executor.id, usersMap.get(executor.id) + 1)

            } else {
                const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

                if (!guild.me.hasPermission("BAN_MEMBERS")) return;
                if (guildInfo.sanction === 'ban') {
                    try {
                        member.guild.members.ban(executor, {
                            reason: 'Antiban',
                        });
                    } catch (error) {
                        return;
                    }
                }

                if (!guild.me.hasPermission("KICK_MEMBERS")) return;
                if (guildInfo.sanction === 'kick') {
                    try {
                        member.guild.member(executor).kick('Antiban')
                    } catch (error) {
                        return;
                    }
                }

                // if (!guild.me.hasPermission("MANAGE_ROLES")) return;
                // if (db.get(`${guild.id}.sanction`) === 'derank') {
                //     try {
                //         member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
                //     } catch (error) {
                //         return;
                //     }
                // }

                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${executor} ${lang.EventsAete} ${guildInfo.sanction} ${lang.AntiBan} \n ${lang.BanReason} ${lang.AntiBanMotif}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                if (!logchannel) return
                try {
                    logchannel.send(embed)
                } catch (error) {
                    return;
                }
            }
        }
    })

}
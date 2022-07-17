const Discord = require('discord.js');
const {
    blue,
    emojiAttention,
    logs
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on("guildMemberUpdate", async (oldMember, newMember) => {

        if (!oldMember) return;
        if (!newMember) return;

        if (!await client.db.guilds.findOne({
            id: newMember.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: newMember.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: newMember.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({
            id: newMember.guild.id
        });
        const raidInfo = await client.db.raids.findOne({
            server: newMember.guild.id
        });
        if (!guildInfo || !raidInfo) return;

        if (!newMember.guild.me.hasPermission("ADMINISTRATOR")) return;

        let color = guildInfo.color

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        const logchannel = newMember.guild.channels.cache.get(guildInfo.logs.channel) || newMember.guild.channels.cache.find((ch) => ch.name === logs)

        let choice = raidInfo.antirole;
        if (choice === undefined || choice === null) {
            choice = true;
        }

        if (choice === true) {
            const oldRoles = oldMember.roles.cache.filter((r) => r.name !== '@everyone').keyArray();
            const newRoles = newMember.roles.cache.filter((r) => r.name !== '@everyone').keyArray();

            if (!newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
            if (!newMember.guild.me.hasPermission("MANAGE_SERVER")) return;

            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE',
            });

            if (!fetchedLogs) return;

            const RoleLog = fetchedLogs.entries.first();

            if (!RoleLog) return;

            const {
                executor,
                target
            } = RoleLog;

            if (newMember.id !== target.id) return

            const member = newMember.guild.members.cache.get(executor.id)
            if (!member) return;
            if (member.roles.highest.position >= newMember.guild.me.roles.highest.position) return;

            if (executor.flags.has('VERIFIED_BOT')) return;
            if (executor == client.user.id) return;


            if (guildInfo.whitelist.users.includes(executor.id)) return;
            if (guildInfo.owner.includes(executor.id)) return;

            if (guildInfo.sanction === 'ban') {
                try {
                    newMember.guild.members.ban(executor, {
                        reason: 'Anti-Role',
                    });
                } catch (error) {
                    return;
                }
            }
            if (guildInfo.sanction === 'kick') {
                try {
                    newMember.guild.member(executor).kick('Anti-Role')
                } catch (error) {
                    return;
                }
            }

            // if (guildInfo.sanction === 'derank') {
            //     try {
            //         member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
            //     } catch {
            //         return;
            //     }
            // }

            if (oldRoles.length > newRoles.length) {
                const difference = oldRoles.filter(dif => !newRoles.includes(dif))
                try {
                    newMember.roles.add(difference)
                } catch {

                }
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${executor} ${lang.AntiRoleEventRemoved} <@&${difference}> ${lang.AntiRoleEventTo} ${target} ${lang.AntiRoleEvent1} ${guildInfo.sanction} ${lang.AntiRoleEventReAdded} \n ${lang.BanReason} Anti-Role`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
                if (!logchannel) return
                logchannel.send(embed)
            }

            if (oldRoles.length < newRoles.length) {
                const difference = newRoles.filter(dif => !oldRoles.includes(dif))
                try {
                    newMember.roles.remove(difference)
                } catch {

                }
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${executor} a ajouté <@&${difference}> ${lang.AntiRoleEventTo} ${target} ${lang.AntiRoleEvent1} ${guildInfo.sanction} ${lang.AntiRoleEventReRemoved} \n ${lang.BanReason} Anti-Role`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
                if (!logchannel) return
                logchannel.send(embed)
            }
        }
    })
}
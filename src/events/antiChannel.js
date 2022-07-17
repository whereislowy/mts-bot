const {
    logs,
    blue,
    emojiAttention
} = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = (client) => {

    /// //////////////////////////////////////////////////////////////
    /// /////////////////////// CHANNEL EDIT ////////////////////////
    /// ////////////////////////////////////////////////////////////

    client.on('channelUpdate', async (oldChannel, newChannel) => {

        if (!oldChannel) return;
        if (!newChannel) return;
        if (!newChannel.guild) return;

        if (!await client.db.guilds.findOne({
            id: newChannel.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: newChannel.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: newChannel.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({id: newChannel.guild.id});
        const raidInfo = await client.db.raids.findOne({server: newChannel.guild.id});
        if(!guildInfo || !raidInfo) return;

        const color = guildInfo.color
        const language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        let choice9 = raidInfo.antichannel;
        if (choice9 == undefined || choice9 === null) {
            choice9 = true;
        }

        if (choice9 === true) {

            if (newChannel.parentID === guildInfo.tempvoc.category) {
                return;
            }

            if (!newChannel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
            if (!newChannel.guild.me.hasPermission("ADMINISTRATOR")) return;

            const fetchedLogs = await newChannel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_UPDATE',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;

            if (newChannel.id !== target.id) return

            if (executor.flags.has('VERIFIED_BOT')) return;
            if (executor == client.user.id) return;
            const member = newChannel.guild.members.cache.get(executor.id)
            if (!member) return;
            if (member.roles.highest.position >= newChannel.guild.me.roles.highest.position) return;
            if(!newChannel.guild.owner) return;

            if (guildInfo.whitelist.users.includes(executor.id)) return;
            if (guildInfo.owner.includes(executor.id)) return;


            const logchannel = newChannel.guild.channels.cache.get(guildInfo.logs.channel) || newChannel.guild.channels.cache.find((ch) => ch.name === logs)
            if (!newChannel.guild.me.hasPermission("BAN_MEMBERS")) return;
            if (guildInfo.sanction === 'ban') {
                try {
                    newChannel.guild.members.ban(executor, {
                        reason: 'Anti-Channel',
                    });
                } catch (error) {
                    return;
                }
            }

            if (!newChannel.guild.me.hasPermission("KICK_MEMBERS")) return;
            if (guildInfo.sanction === 'kick') {
                try {
                    newChannel.guild.member(executor).kick('Anti-channel')
                } catch (error) {
                    return;
                }
            }

            // if (!newChannel.guild.me.hasPermission("MANAGE_ROLES")) return;
            // if (db.get(`${newChannel.guild.id}.sanction`) === 'derank') {
            //     try {
            //         member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
            //     } catch (error) {
            //         return;
            //     }
            // }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${executor} ${lang.EventsAete} ${guildInfo.sanction} ${lang.AntiChannel} \n ${lang.BanReason} ${lang.AntiChannelMotif}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

            if (!logchannel) return
            logchannel.send(embed)

        }
    })

    /////////////////////////////////////////////////////////////////
    ////////////////////////// CREATION CHANNEL ////////////////////
    ///////////////////////////////////////////////////////////////


    client.on('channelCreate', async (channel) => {

        if (!channel) return;
        if (!channel.guild) return;

        if (!await client.db.guilds.findOne({
            id: channel.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: channel.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: channel.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({id: channel.guild.id});
        const raidInfo = await client.db.raids.findOne({server: channel.guild.id});
        if(!guildInfo || !raidInfo) return;

        const color = guildInfo.color
        const language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        let choice9 = raidInfo.antichannel;
        if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (choice9 == undefined || choice9 === null) {
            choice9 = true;
        }

        if (choice9 === true) {

            if (channel.parentID === guildInfo.tempvoc.cateogry) {
                return;
            }

            if (!channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
            if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return;

            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_CREATE',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;

            if (channel.id !== target.id) return
            if (executor.flags.has('VERIFIED_BOT')) return;
            if (executor == client.user.id) return;
            const member = channel.guild.members.cache.get(executor.id)
            if (!member) return;
            if (member.roles.highest.position >= channel.guild.me.roles.highest.position) return;
            if(!channel.guild.owner) return;

            if (guildInfo.whitelist.users.includes(executor.id)) return;
            if (guildInfo.owner.includes(executor.id)) return;


            const logchannel = channel.guild.channels.cache.get(guildInfo.logs.channel) || channel.guild.channels.cache.find((ch) => ch.name === logs)

            try {
                channel.delete()
            } catch (error) {
                return;
            }

            if (!channel.guild.me.hasPermission("BAN_MEMBERS")) return;
            if (guildInfo.sanction === 'ban') {
                try {
                    channel.guild.members.ban(executor, {
                        reason: 'Anti-Channel',
                    });
                } catch (error) {
                    return;
                }
            }

            if (!channel.guild.me.hasPermission("KICK_MEMBERS")) return;
            if (guildInfo.sanction === 'kick') {
                try {
                    channel.guild.member(executor).kick('Anti-channel')
                } catch (error) {
                    return;
                }
            }

            // if (!channel.guild.me.hasPermission("MANAGE_ROLES")) return;
            // if (db.get(`${channel.guild.id}.sanction`) === 'derank') {
            //     try {
            //         member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
            //     } catch (error) {
            //         return;
            //     }
            // }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${executor} ${lang.EventsAete} ${guildInfo.sanction} ${lang.AntiChannel} \n ${lang.BanReason} ${lang.AntiChannelMotif}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

            if (!logchannel) return
            logchannel.send(embed)

        }
    })

    /////////////////////////////////////////////////////////////////
    ////////////////////////// SUPPRESSION CHANNEL /////////////////
    ///////////////////////////////////////////////////////////////


    client.on('channelDelete', async (channel) => {

        if (!channel) return;
        if (!channel.guild) return;

        if (!await client.db.guilds.findOne({
            id: channel.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: channel.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: channel.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({id: channel.guild.id});
        const raidInfo = await client.db.raids.findOne({server: channel.guild.id});
        if(!guildInfo || !raidInfo) return;

        let color = guildInfo.color

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        let choice9 = raidInfo.antichannel;
        if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (choice9 == undefined || choice9 === null) {
            choice9 = true;
        }

        if (choice9 === true) {

            if (channel.parentID === guildInfo.tempvoc.category) {
                return;
            }

            if (!channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
            if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return;

            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_DELETE',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const {
                executor,
                target
            } = banLog;

            if (channel.id !== target.id) return
            if (executor.flags.has('VERIFIED_BOT')) return;
            if (executor == client.user.id) return;
            const member = channel.guild.members.cache.get(executor.id)
            if (!member) return;
            if (member.roles.highest.position >= channel.guild.me.roles.highest.position) return;
            if(!channel.guild.owner) return;

            if (guildInfo.whitelist.users.includes(executor.id)) return;
            if (guildInfo.owner.includes(executor.id)) return;


            const logchannel = channel.guild.channels.cache.get(guildInfo.logs.channel) || channel.guild.channels.cache.find((ch) => ch.name === logs)
            try {
                let position;
                let posi;
                if (channel.parent === undefined) {
                    posi = false;
                }
                if (channel.parent) {
                    posi = true;
                    position = channel.rawPosition
                }

                channel.clone().then((channel2) => {
                    if (posi === true) {
                        try {
                            channel2.setPosition(position)
                        } catch {

                        }
                    }
                })
            } catch (error) {
                return;
            }

            if (!channel.guild.me.hasPermission("BAN_MEMBERS")) return;
            if (guildInfo.sanction === 'ban') {
                try {
                    channel.guild.members.ban(executor, {
                        reason: 'Anti-Channel',
                    });
                } catch (error) {
                    return;
                }
            }

            if (!channel.guild.me.hasPermission("KICK_MEMBERS")) return;
            if (guildInfo.sanction === 'kick') {
                try {
                    channel.guild.member(executor).kick('Anti-channel')
                } catch (error) {
                    return;
                }
            }

            // if (!channel.guild.me.hasPermission("MANAGE_ROLES")) return;
            // if (db.get(`${channel.guild.id}.sanction`) === 'derank') {
            //     try {
            //         member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => member.roles.remove(role))
            //     } catch (error) {
            //         return;
            //     }
            // }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${executor} ${lang.EventsAete} ${guildInfo.sanction} ${lang.AntiChannel} \n ${lang.BanReason} ${lang.AntiChannelMotif}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

            if (!logchannel) return
            logchannel.send(embed)

        }
    })

}
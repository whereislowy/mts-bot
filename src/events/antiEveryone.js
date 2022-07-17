const {
    blue,
    emojiAttention,
    prefix,
    logs
} = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('anti_everyone', async (message) => {

        if(!message) return;
        if(!message.guild) return;

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

        const color = guildInfo.color
        const language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!message.member || message.channel.type == 'dm') return;
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        let choice = raidInfo.antieveryone;
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (choice === undefined || choice === null) {
            choice = true;
        }

        if (choice === true) {

            if (message.author.id == client.user.id) return;

            if (guildInfo.whitelist.users.includes(message.author.id)) return;
            if (guildInfo.owner.includes(message.author.id)) return;

            if (message.content.includes('@everyone')) {

                const member = message.guild.members.cache.get(message.author.id)
                if (!member) return;
                if (member) {
                    if (member.roles.highest.position >= message.guild.me.roles.highest.position) return;
                }

                if (guildInfo.users.find(user => user.id === member.id).Everyone === null || guildInfo.users.find(user => user.id === member.id).Everyone === undefined) {
                    const user = guildInfo.users.find(user => user.id === member.id);
                    return await client.db.guilds.findOneAndUpdate({
                        id: member.guild.id,
                        'users.id': user.id
                    }, {
                        $set: {
                            'users.$.Everyone': 1
                        }
                    })
                }
                setTimeout(async () => {
                    const user = guildInfo.users.find(user => user.id === member.id);
                    try {
                        await client.db.guilds.findOneAndUpdate({
                            id: message.guild.id,
                            'users.id': user.id
                        }, {
                            $unset: {
                                'users.$.Everyone': 1
                            }
                        });
                    } catch (error) {
                        return;
                    }
                }, 3600000);

                if (guildInfo.users.find(user => user.id === member.id).Everyone < 3) {
                    const user = guildInfo.users.find(user => user.id === member.id);
                    return await client.db.guilds.findOneAndUpdate({
                        id: message.guild.id,
                        'users.id': user.id
                    }, {
                        $inc: {
                            'users.$.Everyone': 1
                        }
                    });
                }
                setTimeout(async () => {
                    const user = guildInfo.users.find(user => user.id === member.id);
                    try {
                        await client.db.guilds.findOneAndUpdate({
                            id: message.guild.id,
                            'users.id': user.id
                        }, {
                            $unset: {
                                'users.$.Everyone': 1
                            }
                        });
                    } catch (error) {
                        return;
                    }
                }, 3600000);
                if (guildInfo.users.find(user => user.id === member.id).Everyone === 3) {

                    const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

                    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return;
                    if (guildInfo.sanction === 'ban') {
                        try {
                            message.guild.members.ban(message.member, {
                                reason: 'Anti-Everyone',
                            });
                        } catch (error) {
                            return;
                        }
                    }

                    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return;
                    if (guildInfo.sanction === 'kick') {
                        try {
                            message.guild.member(message.member).kick('Anti-Everyone')
                        } catch (error) {
                            return;
                        }
                    }

                    // if (!message.guild.me.hasPermission("MANAGE_ROLES")) return;
                    // if (db.get(`${message.guild.id}.sanction`) === 'derank') {
                    //     try {
                    //         message.member.roles.cache.filter(role => role.name !== '@everyone').forEach(role => message.member.roles.remove(role))
                    //     } catch (error) {
                    //         return;
                    //     }
                    // }

                    const embed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setDescription(`${message.author} a été ${guildInfo.sanction} ${lang.AntiEveryone} \n ${lang.BanReason} ${lang.AntiEveryoneMotif}`)
                        .setTimestamp()
                        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                    if (!logchannel) return
                    logchannel.send(embed)

                    const user = guildInfo.users.find(user => user.id === member.id);
                    try {
                        await client.db.guilds.findOneAndUpdate({
                            id: message.guild.id,
                            'users.id': user.id
                        }, {
                            $unset: {
                                'users.$.Everyone': 1
                            }
                        });
                    } catch (error) {
                        return;
                    }

                }
                setTimeout(async () => {
                    const user = guildInfo.users.find(user => user.id === member.id);
                    try {
                        await client.db.guilds.findOneAndUpdate({
                            id: message.guild.id,
                            'users.id': user.id
                        }, {
                            $unset: {
                                'users.$.Everyone': 1
                            }
                        });
                    } catch (error) {
                        return;
                    }
                }, 3600000);
            }
        }
    });
};
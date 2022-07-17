const Discord = require('discord.js');
const fs = require('fs').promises;
module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {

        if (!oldState) return;
        if (!newState) return;

        if (!await client.db.guilds.findOne({
            id: newState.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: newState.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: newState.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({
            id: newState.guild.id
        });
        const raidInfo = await client.db.raids.findOne({
            server: newState.guild.id
        });
        if (!guildInfo || !raidInfo) return;

        const permsrequired = [
            'SEND_MESSAGES',
            'MANAGE_CHANNELS',
            'MANAGE_ROLES',
        ]

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!oldState.guild.me.hasPermission(permsrequired)) return
        if (!newState.guild.me.hasPermission(permsrequired)) return;
        if (newState.channel && newState.channel.id === guildInfo.tempvoc.channel) {
            const userInfo = guildInfo.users.find(user => user.id === newState.member.id);
            if (userInfo && userInfo.tempvoc) {
                const channelmove = userInfo.tempvoc
                const cha = newState.guild.channels.cache.get(channelmove)
                return newState.member.voice.setChannel(cha)
            }
            const category = guildInfo.tempvoc.category
            if(!category) return;
            const channel = await newState.guild.channels.create(`${lang.Tempvocal} ${newState.member.user.username}`, {
                type: 'voice',
                parent: category,
                permissionOverwrites: [{
                        id: newState.member.id,
                        allow: ['MOVE_MEMBERS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'USE_VAD', 'MANAGE_ROLES', 'STREAM', 'CONNECT', 'SPEAK'],
                    },
                    // PERMS EVERYONE DU SALON
                    {
                        id: newState.guild.id,
                        allow: ['CONNECT', 'SPEAK', 'STREAM', 'VIEW_CHANNEL', 'USE_VAD'],
                    }
                ]
            })

            newState.member.voice.setChannel(channel);
            try {
                if(!userInfo) {
                    await client.db.guilds.findOneAndUpdate({
                        id: newState.member.guild.id
                    }, {
                        $push: {
                            users: {
                                id: newState.member.id,
                                tempvoc: channel.id
                            } 
                        }
                    });
                } else {
                    await client.db.guilds.findOneAndUpdate({
                        id: newState.member.guild.id,
                        'users.id': newState.member.id
                    }, {
                        $set: {
                            'users.$.tempvoc': channel.id
                        }
                    });
                }
            } catch (error) {
                return;
            }
        }
        if (!oldState.channel) return;
        if (oldState.channel.parentID === guildInfo.tempvoc.category && oldState.channel.id !== guildInfo.tempvoc.channel) {
            if (oldState.channel.members.size === 0) {
                oldState.channel.delete();
                const user = guildInfo.users.find(user => user.id === oldState.member.id);
                    delete user.tempvoc;
                    try {
                        await client.db.guilds.findOneAndUpdate({
                            id: newState.guild.id,
                            'users.id': oldState.member.id
                        }, {
                            $unset: {
                                "users.$.tempvoc": 1
                            }
                        });
                    } catch (error) {
                        console.log(error);
                    }
            }
        }
    })
}
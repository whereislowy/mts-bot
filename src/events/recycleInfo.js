module.exports = async (client) => {
    client.on('recycleInfo', async guilds => {
        // await client.db.guilds.remove()
        // await client.db.raids.remove()

        // const FieldsGuildInfo = {
        //     "language": "language",
        //     "ticket": "ticket",
        //     "WLUsers": "whitelist.users",
        //     "Logs": "logs.channel",
        //     "Owners": "owner",
        //     "Color": "color",
        //     "RoleMenu": "role_menu",
        //     "WLChannels": "whitelist.channels",
        //     "RoleMuted": "roleMuted",
        //     "categoryTempvoc": "tempvoc.category",
        //     "tempvoc": "tempvoc.channel",
        // //"":
        //     "sanction": "sanction",
        //     "prefix": "prefix",
        //     "users": "users",
        //     "logsKB": "logs.bans",
        //     "AntiWord": "antiWords",
        //     "logsMSG": "logs.messages",
        //     "logsC": "logs.channels",
        //     "logsRoles": "logs.roles",
        //     "roleMenuChannel": "roleMenuChannel"
        // }
        // const FieldsRaidInfo = {
        //     "antispam": "antispam",
        //     "antilink": "antilink",
        //     "antiwebhook": "antiwebhook", 
        //     "antiChannel": "antichannel",
        //     "antiword": "antiword",
        //     "antirole": "antirole",
        //     "antieveryone": "antieveryone",
        //     "antiban": "antiban"
        // }
        // for (let i = 0; i < guilds.length; i++) {
        //     const guildInfo = await client.db.guilds.findOne({
        //         id: guilds[i].ID
        //     });
        //     const raidInfo = await client.db.raids.findOne({
        //         server: guilds[i].ID
        //     });
        //     if (!guildInfo) {
        //         const SchemaGuild = new client.db.schemas.guild({
        //             id: guilds[i].ID
        //         });
        //         await client.db.guilds.insert(SchemaGuild)
        //     }
        //     if (!raidInfo) {
        //         const SchemaAntiRaid = new client.db.schemas.raid({
        //             server: guilds[i].ID
        //         })
        //         await client.db.raids.insert(SchemaAntiRaid)
        //     }
        //     const objectEntries = Object.entries(guilds[i].data);
        //     for (let j = 0; j < objectEntries.length; j++) {
        //         if (!Object.keys(FieldsGuildInfo).includes(objectEntries[j][0])) {
        //             if(Object.keys(FieldsRaidInfo).includes(objectEntries[j][0])) {
        //                 await client.db.raids.findOneAndUpdate({
        //                     server: guilds[i].ID
        //                 }, {
        //                     $set: {
        //                         [FieldsRaidInfo[objectEntries[j][0]]]: objectEntries[j][1]
        //                     }
        //                 })
        //             }
        //         } else {
        //             if (objectEntries[j][0] === "RoleMenu") {
        //                 const roleMenu = Object.entries(objectEntries[j][1]);
        //                 for (let k = 0; k < roleMenu.length; k++) {
        //                     const roleMenuMessage = {
        //                         id_message: roleMenu[k][0],
        //                         reacts: roleMenu[k][1].roleReact
        //                     }
        //                     await client.db.guilds.findOneAndUpdate({
        //                         id: guilds[i].ID
        //                     }, {
        //                         $push: {
        //                             "role_menu": roleMenuMessage
        //                         }
        //                     })
        //                 }
        //             } else if (objectEntries[j][0] === "users") {
        //                 const users = Object.entries(objectEntries[j][1]);
        //                 for (let h = 0; h < users.length; h++) {
        //                     await client.db.guilds.findOneAndUpdate({
        //                         id: guilds[i].ID
        //                     }, {
        //                         $push: {
        //                             users: {
        //                                 id: users[h][0],
        //                                 ...users[h][1]
        //                             }
        //                         }
        //                     })

        //                 }
        //             } else {
        //                 await client.db.guilds.findOneAndUpdate({
        //                     id: guilds[i].ID
        //                 }, {
        //                     $set: {
        //                         [FieldsGuildInfo[objectEntries[j][0]]]: objectEntries[j][1]
        //                     }
        //                 })
        //             }
        //         }
        //     }
        // }
        // const newServers = client.guilds.cache.filter(async guild => !(await client.db.guilds.findOne({
        //     id: guild.id
        // }))).map(guild => guild.id);
        // for (let i = 0; i < newServers.length; i++) {
        //     const SchemaGuild = new client.db.schemas.guild({
        //         id: guilds[i].ID
        //     });
        //     await client.db.guilds.insert(SchemaGuild)
        //     const SchemaAntiRaid = new client.db.schemas.raid({
        //         server: guilds[i].ID
        //     })
        //     await client.db.raids.insert(SchemaAntiRaid)
        // }
        
    })
}
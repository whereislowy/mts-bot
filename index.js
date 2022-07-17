/* eslint-disable no-undef */
const {
    token,
    prefix,
} = require('./config.json');
const quick = require('quick.db')
const {
    Client,
    Collection,
} = require("discord.js");
const fs = require('fs').promises;
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const axios = require('axios')
const db = require('./database')
const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.db = db;
client.commands = new Collection();

const path = require('path');
async function registry(cheminDossier = path.join(__dirname, './src/events')) {
    const files = await fs.readdir(cheminDossier)
    if (cheminDossier.includes('events')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const file = require(path.join(cheminDossier, files[i]));
                file(client)
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    } else if (cheminDossier.includes('commands')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const command = require(path.join(cheminDossier, files[i]));
                client.commands.set(command.name, command);
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    } else if (cheminDossier.includes('logs')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const file = require(path.join(cheminDossier, files[i]));
                file(client)
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    }
}
registry(path.join(__dirname, './src/events'));
registry(path.join(__dirname, './src/logs'));
registry(path.join(__dirname, './src/commands'));

// client.on('ready', async () => {
//     console.log(`${client.user.username} à été allumé avec succès.`)
//     console.log(`${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`)
//     db.set(`${client.user.id}.statutTime`, false)
//     db.set(`${client.user.id}.avatar`, false)
//     db.set(`${client.user.id}.username`, false)
//     db.set(`${client.user.id}.activityTypeTime`, false)

//     if (db.get(`${client.user.id}.statut`) === undefined || db.get(`${client.user.id}.statut`) === null) {
//         db.set(`${client.user.id}.statut`, `🌀 MTS PREMIUM`)
//     }
//     if (db.get(`${client.user.id}.activityType`) === undefined || db.get(`${client.user.id}.activityType`) === null) {
//         db.set(`${client.user.id}.activityType`, `STREAMING`)
//     }

//     client.user.setActivity(db.get(`${client.user.id}.statut`), {
//         type: db.get(`${client.user.id}.activityType`),
//         url: "https://www.twitch.tv/mtsdev"
//     })
// });
client.on('shardReady', async (id) => {
    await axios.get(`http://localhost:6666/shardReady/${id}`);
})
client.on('ready', async () => {

    // client.guilds.cache.forEach(async (guild) => {
    //     const GuildInfo = await client.db.guilds.findOne({id: guild.id});
    //     const RaidInfo = await client.db.raids.findOne({server: guild.id});
    //     if(!GuildInfo || !RaidInfo) client.emit('initializeGuild', guild);
    // })

    const guilds = await client.db.guilds.find();
    for (let i = 0; i < guilds.length; i++) {
        await client.db.guilds.findOneAndUpdate({
            id: guilds[i].id
        }, {
            $unset: {
                "users.$[].Everyone": 1,
                "users.$[].tempvocal": 1
            }
        })
    };
    const databaseInfo = await quick.all();
    client.emit('recycleInfo', databaseInfo);
    console.log(`${client.user.username} à été allumé avec succès.`)
    console.log(`${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`)

    const headers = {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwOTEwNDc3MjE3ODkwMzA1MSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjE4ODU5NDg2fQ.J4KZFZS1hW3A9Aw_Q7Km7D8_JMvDoEKJ-5v7E16BqkA"
    };
    const baseURL = "https://top.gg/api";
    const {
        data: result
    } = await axios.post(`${baseURL}/bots/809104772178903051/stats`, {
        server_count: client.guilds.cache.size
    }, {
        headers
    });

    console.log(`Top.gg chargé avec : ${client.guilds.cache.size} serveurs`)

    let statuses = [
        "MTS [1.4]",
        `${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`,
    ]

    setInterval(() => {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status, {
            type: "PLAYING",
            url: "https://www.twitch.tv/mtsdev"
        })
    }, 20000)

});

// client.on('presenceUpdate', async (oldPresence, newPresence) => {
//     if (!oldPresence) return;
//     if (!newPresence.guild.me.hasPermission("MANAGE_ROLES")) return
//     let presenceStatusSoutien = db.get(`${newPresence.guild.id}.statutchange`);
//     let roleSoutien = db.get(`${newPresence.guild.id}.RoleSoutien`)
//     if (db.get(`${newPresence.guild.id}.RoleSoutien`) == undefined) return;
//     if (db.get(`${newPresence.guild.id}.statutchange`) == undefined) return;
//     if (db.get(`${newPresence.guild.id}.RoleSoutien`) == null) return;
//     if (db.get(`${newPresence.guild.id}.statutchange`) == null) return;
//     let roleS = newPresence.guild.roles.cache.get(roleSoutien);
//     if (!roleS) return;
//     if (roleS.position > newPresence.guild.me.roles.highest.position) return
//     const m = newPresence;
//     if (m.user.bot) return;
//     const Ifsoutien = (presence) => {
//         if (presence.activities.length > 0) {
//             if (presence.activities.some(activity => activity.type === 'CUSTOM_STATUS')) {
//                 if (presence.activities.find(x => x.type == "CUSTOM_STATUS").state) {
//                     if (presence.activities.find(x => x.type == "CUSTOM_STATUS").state.toLowerCase().includes(presenceStatusSoutien.toLowerCase())) {
//                         return true;
//                     }
//                     return false;
//                 }
//                 return false;
//             }
//             return false;
//         }
//         return false;
//     }
//     if (!Ifsoutien(oldPresence) && Ifsoutien(newPresence)) {
//         if (!m.member.roles.cache.has(roleS.id)) {
//             return m.member.roles.add(roleS)
//         }
//     }
//     if (Ifsoutien(oldPresence) && Ifsoutien(newPresence)) {
//         if (!m.member.roles.cache.has(roleS.id)) {
//             return m.member.roles.add(roleS)
//         }
//     }
//     if (Ifsoutien(oldPresence) && !Ifsoutien(newPresence)) {
//         if (m.member.roles.cache.has(roleS.id)) {
//             return m.member.roles.remove(roleS)
//         }
//     }
// });

///////////////////////////////////////////////////////////////////
////////////////////////// IMPORT COMMANDES //////////////////////
/////////////////////////////////////////////////////////////////

client.on('message', async (message) => {
    if (!message) return;
    if (!message.guild) return;
    if (!message.member || message.channel.type == 'dm') return;
    if (!message.guild || message.author.bot) return;
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
    client.emit('anti_everyone', (message));
    client.emit('anti_link', (message));
    client.emit('anti_spam', (message));
    client.emit('anti_word', (message));
    client.emit('prefix_bot', (message));

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
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(guildInfo.prefix || prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (!cmd) return;
    const language = guildInfo.language
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
    try {
        cmd.execute(message, args, client, lang, guildInfo, raidInfo);
    } catch (error) {
        console.log(error);
        return message.channel.send("Il semble y avoir un eu une erreur lors de l'éxécution de cette commande ")
    }

});

client.login(token)
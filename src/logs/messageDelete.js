const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('messageDelete', async (message) => {

        if (!message) return;
        if (!message.guild) return;
        if (message.content && message.content.length >= 1800) return;

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

        if (!guildInfo) return;

        let color = guildInfo.color

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (message.partial) {
            try {
                await message.fetch()
            } catch {
                return
            }
        }

        if (message.channel.type == 'dm') return
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (message.author.bot) return;

        let choice7 = guildInfo.logs.messages

        if (choice7 == undefined || choice7 == null) {
            choice7 = true;
        }

        if (choice7 === true) {

            if (message.channel.type === 'dm') return;

            if (!message.guild.me.hasPermission("VIEW_AUDIT_LOG")) return

            const fetchedLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: 'MESSAGE_DELETE',
            });

            if (!fetchedLogs) return;

            const messageDeleted = fetchedLogs.entries.first();

            if (!messageDeleted) return

            const {
                executor
            } = messageDeleted

            const logchannel = message.guild.channels.cache.get(guildInfo.logs.channel) || message.guild.channels.cache.find((ch) => ch.name === logs)

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.messageDelete1} ${message.author}  \n ${lang.messageDelete2} ${message.content}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
            if (!logchannel) return;
            try {
                logchannel.send(embed);
            } catch (error) {
                return;
            }
        }
    });
};
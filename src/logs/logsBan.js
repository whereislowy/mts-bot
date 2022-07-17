const Discord = require('discord.js');
const {
    blue,
    emojiValidé,
    logs,
    emojiAttention
} = require('../../config.json');
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

        if(!guildInfo) return;

        let color = guildInfo.color

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!guild.me.hasPermission("ADMINISTRATOR")) return;

        let choice5 = guildInfo.logs.bans

        if (choice5 == undefined || choice5 == null) {
            choice5 = true;
        }

        if (choice5 === true) {

            if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });

            if (!fetchedLogs) return;

            const banLog = fetchedLogs.entries.first();

            if (!banLog) return;

            const logchannel = guild.channels.cache.get(guildInfo.logs.channel) || guild.channels.cache.find((ch) => ch.name === logs)

            if (!banLog) {

                const embed1 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${user.tag} ${lang.logBan1}  ${guild.name}, ${lang.logBan2}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
                if (!logchannel) return
                else logchannel.send(embed1)
            }

            const {
                executor,
                target
            } = banLog;

            if (executor == client.user.id) return;

            if (banLog) {
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${target} ${lang.logBan1} ${guild.name}.\n ${lang.BanAuthor} ${executor}`)
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
    });
}
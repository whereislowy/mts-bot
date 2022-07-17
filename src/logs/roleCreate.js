const Discord = require('discord.js');
const {
    blue,
    logs,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('roleCreate', async (role) => {

        if (!role) return;
        if (!role.guild) return;

        if (!await client.db.guilds.findOne({
            id: role.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: role.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: role.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({
            id: role.guild.id
        });

        if(!guildInfo) return;

        let color = guildInfo.color

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (!role.guild.me.hasPermission("ADMINISTRATOR")) return

        let choice7 = guildInfo.logs.roles

        if (choice7 == undefined || choice7 == null) {
            choice7 = true;
        }

        if (choice7 === true) {

            if (!role.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

            const fetchedLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: 'ROLE_CREATE',
            });

            if (!fetchedLogs) return;

            const roleCreated = fetchedLogs.entries.first();

            if (!roleCreated) return

            const {
                executor
            } = roleCreated

            const logchannel = role.guild.channels.cache.get(guildInfo.logs.channel) || role.guild.channels.cache.find((ch) => ch.name === logs)

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.roleCreate} ${role}  \n ${lang.BanAuthor} ${executor}`)
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
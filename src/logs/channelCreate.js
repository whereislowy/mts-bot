const Discord = require('discord.js');
const fs = require('fs').promises;
const {
    blue,
    logs,
    emojiAttention
} = require('../../config.json');

module.exports = (client) => {
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
        
        const guildInfo = await client.db.guilds.findOne({
            id: channel.guild.id
        });

        if(!guildInfo) return;

        let color = guildInfo.color

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (channel.type == 'dm') return;
        if (!channel.guild.me.hasPermission("ADMINISTRATOR")) return

        let choice6 = guildInfo.logs.channels

        if (choice6 == undefined || choice6 == null) {
            choice6 = true;
        }

        if (choice6 === true) {

            if (!channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_CREATE',
            });

            if (!fetchedLogs) return;

            const channelCreated = fetchedLogs.entries.first();

            if (!channelCreated) return;

            const {
                executor
            } = channelCreated

            const logchannel = channel.guild.channels.cache.get(guildInfo.logs.channel) || channel.guild.channels.cache.find((ch) => ch.name === logs)

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.ChannelCreate} ${channel.name}  \n ${lang.BanAuthor} ${executor}`)
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
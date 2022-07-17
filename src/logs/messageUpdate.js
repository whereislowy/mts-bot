const Discord = require('discord.js')
const {
    blue,
    logs,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on('messageUpdate', async (oldMessage, newMessage) => {

        if (!oldMessage) return;
        if (!newMessage) return;
        if (!newMessage.guild) return;
        if (oldMessage.content && oldMessage.content.length >= 1800) return;
        if (newMessage.content && newMessage.content.length >= 1800) return;

        if (!await client.db.guilds.findOne({
            id: newMessage.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: newMessage.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: newMessage.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({
            id: newMessage.guild.id
        });

        if(!guildInfo) return;

        let color = guildInfo.color

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        if (oldMessage.partial) {
            try {
                await oldMessage.fetch()
            } catch {
                return
            }
        }
        if (newMessage.partial) {
            try {
                await newMessage.fetch()
            } catch {
                return
            }
        }

        if (newMessage.channel.type == 'dm') return;
        if (!newMessage.guild.me.hasPermission("ADMINISTRATOR")) return;
        if (newMessage.author.bot) return;

        let choice7 = guildInfo.logs.messages

        if (choice7 == undefined || choice7 == null) {
            choice7 = true;
        }

        if (choice7 === true) {

            if (newMessage.channel.type === 'dm') return;

            const logchannel = newMessage.guild.channels.cache.get(guildInfo.logs.channel) || newMessage.guild.channels.cache.find((ch) => ch.name === logs)

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.messageUpdate1} ${newMessage.author} !** \n ${lang.messageUpdate2} ${oldMessage} \n ${lang.messageUpdate3} ${newMessage}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`)
            if (!logchannel) return;
            try {
                logchannel.send(embed);
            } catch (error) {
                return;
            }
        }
    });
};
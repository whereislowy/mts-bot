const Discord = require('discord.js');
const {
    blue,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on("messageReactionAdd", async (reaction, user) => {

        if (!reaction) return;
        if (!user) return;
        let message = reaction.message;
        if(!message) return;
        if (!message.guild) return;

        if (!await client.db.guilds.findOne({
            id: reaction.message.guild.id
        })) {
        const guildSchema = new client.db.schemas.guild({
            id: reaction.message.guild.id
        });
        const antiRaidSchema = new client.db.schemas.raid({
            server: reaction.message.guild.id
        });
        await client.db.raids.insert(antiRaidSchema);
        await client.db.guilds.insert(guildSchema);
    }

        const guildInfo = await client.db.guilds.findOne({
            id: reaction.message.guild.id
        });
        const raidInfo = await client.db.raids.findOne({
            server: reaction.message.guild.id
        });
        if (!guildInfo || !raidInfo) return;

        let color = guildInfo.color

        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return;

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        const member = message.guild.members.cache.get(user.id);
        const emoji = reaction.emoji.name;
        const userReaction = message.reactions.cache.filter(reaction => reaction.users.cache.has(member.user.id));
        if (member.user.bot) return;

        if (guildInfo.ticket === undefined) return;

        if (message.partial) {
            try {
                await message.fetch()
            } catch {
                return
            }
        }

        if (["🎟️"].includes(emoji)) {
            switch (emoji) {
                case "🎟️":
                    if (reaction.message.id !== guildInfo.ticket) return;
                    reaction.users.remove(member.user.id);
            }
            let alreadyOpenned = false;
            reaction.message.guild.channels.cache.filter(c => c.name.startsWith("ticket-")).forEach(c => {
                if (c.topic === user.id) alreadyOpenned = true
            })
            if (alreadyOpenned) return;

            message.guild.channels.create(`ticket-${user.username}`, {
                type: 'text'
            }).then(async channel => {
                channel.setTopic(`${user.id}`);

                const everyone = message.guild.roles.everyone

                await channel.updateOverwrite(everyone, {
                    "VIEW_CHANNEL": false,
                    "SEND_MESSAGES": false
                })

                await channel.updateOverwrite(message.guild.members.cache.get(user.id), {
                    "VIEW_CHANNEL": true,
                    "SEND_MESSAGES": true,
                    "READ_MESSAGE_HISTORY": true,
                    "EMBED_LINKS": true
                })

                let Embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor(`🎟️ Ticket ${user.username}`)
                    .setDescription(`${user} ${lang.Ticket1} ${message.guild.name} !
                    ${lang.Ticket2}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                channel.send(Embed).then(async msg => {
                    await msg.react("🔒")
                })
            })
        }

        if (["🔒"].includes(emoji)) {
            switch (emoji) {
                case "🔒":
                    try {
                        if (!message.channel.name.startsWith("ticket-")) return;
                        for (const reaction of userReaction.values()) {
                            reaction.users.remove(member.user.id);
                        }
                    } catch (err) {

                    }
            }
            message.channel.delete()
        }
    })

}
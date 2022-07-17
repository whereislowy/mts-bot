const Discord = require('discord.js');
const {
    blue,
    emojiAttention
} = require('../../config.json');
const fs = require('fs').promises;

module.exports = (client) => {
    client.on("messageReactionAdd", async (reaction, user) => {

        if(!reaction) return;
        if(!user) return;

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

        let language = guildInfo.language
        const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))

        let message = reaction.message;
        if (!message.guild) return;
        const member = message.guild.members.cache.get(user.id);
        if (!member) return;
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return;
        if (user.bot) return;

        if (message.partial) {
            try {
                await message.fetch()
            } catch {
                return
            }
        }

        if (guildInfo.role_menu.some(info => info.message_id === message.id)) {
            let roleid = guildInfo.role_menu.find(info => info.message_id === message.id).reacts.find(r => r.reaction.includes(reaction.id ? reaction.emoji.id : reaction.emoji.name))
            if (!roleid) return;
            try {
                member.roles.add(roleid.role)
            } catch {
                return;
            }
        }
    })
}
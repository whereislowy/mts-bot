module.exports = async (client) => {
    client.on('initializeGuild', async guild => {
        const guildInfo = await client.db.guilds.findOne({id: guild.id});
        const RaidInfo = await client.db.raids.findOne({server: guild.id});
        if(!guildInfo) {
            const ServerSchema = new client.db.schemas.guild({
                id: guild.id
            });
            await client.db.guilds.insert(ServerSchema);
            if(guild.ownerID) await client.db.guilds.findOneAndUpdate({id: guild.id}, { $set: { owner: [guild.ownerID], whitelist: [guild.ownerID]}});
            
        }
        if(!RaidInfo) {
            const RaidServerSchema = new client.db.schemas.raid({
                server: guild.id,
            });
            await client.db.raids.insert(RaidServerSchema)
        }
    })
}
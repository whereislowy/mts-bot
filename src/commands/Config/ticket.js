const Discord = require("discord.js");
const {
    blue,
    emojiAttention,
    owner
} = require('../../../config.json');

module.exports = {
    name: 'ticket',
    description: 'Envoie le message de ticket',
    aliases: ['ticket'],
    usage: 'ticket',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,


    async execute(message, args, client, lang, guildInfo) {

        try {
            message.delete()
        } catch {

        }

        let color = guildInfo.color

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.TicketErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {

            const embedbotPerms = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.botNoPerms}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
            if (!message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send(embedbotPerms)

            let Embed = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(`${lang.TicketEmbedAuthor}`)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true,
                    size: 512
                }))
                .setDescription(`${lang.TicketEmbedDescription}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

            message.channel.send(Embed).then(async msg => {
                try {
                    await msg.react("🎟️")
                } catch {

                }
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { ticket: msg.id}});
            })

        } else {
            message.channel.send(WLAlready)
        }
    }
}
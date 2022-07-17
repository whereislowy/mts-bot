const {
    emojiAttention,
    owner,
    blue
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'language',
    aliases: ['setlang', 'lang'],
    description: 'Choisis la langue du bot',
    usage: 'setlang <fr | eng>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.LangErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {

            if (args[0] === guildInfo.language) {
                return message.channel.send(`${lang.LangAlreadySet} ${guildInfo.language}`)
            }
            if (args[0] === 'fr') {
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { language: 'fr'}});
                return message.channel.send(`${lang.LangSetOn} \`fr\` 🇫🇷`)
            }

            if (args[0] === 'eng') {
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { language: 'eng'}});
                return message.channel.send(`${lang.LangSetOn} \`eng\` 🇬🇧`)
            }
            return message.channel.send(`${lang.LangErrorBadLang}`)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}
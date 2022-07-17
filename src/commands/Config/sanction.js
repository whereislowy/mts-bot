const {
    MessageEmbed
} = require('discord.js');
const {
    emojiAttention,
    owner,
    blue
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'sanction',
    aliases: ['sanction'],
    description: 'Choisis la sanction des commandes de sécurité',
    usage: 'sanction <ban | kick>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.SanctionErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {
            if (args[0] === 'ban') {
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { sanction: 'ban'}});
                return message.channel.send(`${lang.SanctionSetOn} \`ban\``)
            }
            if (args[0] === 'kick') {
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { sanction: 'kick'}});
                return message.channel.send(`${lang.SanctionSetOn} \`kick\``)
            }
            // if(args[0] === 'derank') {
            //     await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { sanction: 'derank'}});
            //     return message.channel.send(`${lang.SanctionSetOn} \`derank\``)
            // }
            return message.channel.send(`${lang.SanctionErrorBadSanction}`)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}
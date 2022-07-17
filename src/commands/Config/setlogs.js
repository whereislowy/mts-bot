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
    name: 'setlogs',
    aliases: ['setlog', 'setlogschannel'],
    description: 'Choisis le salon logs du bot',
    usage: 'setlogschannel <#channel>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.SetLogsErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const samechannel = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.SetLogsErrorAlreadyThisChannel}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if(!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {

            if (!args[0]) {
                return message.channel.send(`${lang.SetLogsErrorInvalidChannel}`)
            }

            const channelID = args[0].replace(/[<>#]/g, '')
            if (channelID === guildInfo.logs.channel) {
                return message.channel.send(samechannel)
            }
            const channel = await message.guild.channels.cache.get(channelID)

            if (!channel) {
                return message.channel.send(`${lang.SetLogsErrorInvalidChannel}`)
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.SetLogsFinalMessage1} ${channel} ${lang.SetLogsFinalMessage2}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
            message.channel.send(embed)
            await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { 'logs.channel': channelID}});
        } else {
            return message.channel.send(WLAlready);
        }
    }
}
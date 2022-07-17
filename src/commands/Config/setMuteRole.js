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
    name: 'setmuterole',
    aliases: ['setmuterole'],
    description: 'Choisis le rôle muted',
    usage: 'setmuterole <@&role>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.SetMuteRoleErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const samechannel = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.SetMuteRoleErrorAlreadyThisRole}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {

            if (!args[0]) {
                return message.channel.send(`${lang.SetMuteRoleErrorInvalidRole}`)
            }

            const channelID = args[0].replace(/[<>@&]/g, '')

            if (channelID === guildInfo.roleMuted) {
                return message.channel.send(samechannel)
            }
            const channel = await message.guild.roles.cache.get(channelID)

            if (!channel) {
                return message.channel.send(`${lang.SetMuteRoleErrorInvalidRole}`)
            }

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.SetMuteRoleFinalMessage1} ${channel} ${lang.SetMuteRoleFinalMessage2}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
            message.channel.send(embed)
            await client.db.guilds.findOneAndUpdate({
                id: message.guild.id
            }, {
                $set: {
                    roleMuted: channelID
                }
            });
        } else {
            return message.channel.send(WLAlready);
        }
    }
}
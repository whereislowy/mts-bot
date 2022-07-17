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
    name: 'tempvocal',
    aliases: ['tempvoc', 'tempvocal', 'vocaltemp'],
    description: 'Met en place le système de vocaux temporaire',
    usage: 'tempvocal',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color

        const permsrequired = [
            'SEND_MESSAGES',
            'MANAGE_CHANNELS',
            'MANAGE_ROLES',
        ]

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.TempVocalErrorNoOwner}`)
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
            if (!message.guild.me.hasPermission(permsrequired)) return message.channel.send(embedbotPerms)

            const channelcheck = message.guild.channels.resolve(guildInfo.tempvoc.channel)
            const categorycheck = message.guild.channels.resolve(guildInfo.tempvoc.category)

            if (!categorycheck && channelcheck) {
                const category = await message.guild.channels.create(`${lang.TempVocalCategoryCreate}`, {
                    type: 'category'
                })
                channelcheck.setParent(category)
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { 'tempvoc.category': category.id}});
                return message.channel.send(`${lang.TempVocalCategoryCreated}`)
            }
            if (categorycheck && !channelcheck) {
                const channel = await message.guild.channels.create(`${lang.TempVocalChannelCreate}`, {
                    type: 'voice',
                    parent: categorycheck
                })
                channel.setParent(categorycheck)
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { 'tempvoc.channel': channel.id}});
                return message.channel.send(`${lang.TempVocalChannelCreated}`)
            }
            if (!categorycheck && !channelcheck) {
                const category = await message.guild.channels.create(`${lang.TempVocalCategoryCreate}`, {
                    type: 'category'
                })
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { 'tempvoc.category': category.id}});
                const channel = await message.guild.channels.create(`${lang.TempVocalChannelCreate}`, {
                    type: 'voice',
                    parent: category
                })
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { 'tempvoc.channel': channel.id}});
                const embedCreated = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.TempVocalAllCreated1} \n ${emojiAttention} ${lang.TempVocalAllCreated2} \`${lang.TempVocalChannelCreate}\` ${lang.TempVocalAllCreated3}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                return message.channel.send(embedCreated)
            }
            if (channelcheck.parentID !== categorycheck.id) {
                channelcheck.setParent(categorycheck)
                return message.channel.send(`${lang.TempVocalAllCreated2} \`${lang.TempVocalChannelCreate}\` ${lang.TempVocalBadCategory}`)
            }
            if (channelcheck && categorycheck) {
                return message.channel.send(`${lang.TempVocalAlreadyCreated}`)
            }

        } else {
            message.channel.send(WLAlready)
        }
    }
}
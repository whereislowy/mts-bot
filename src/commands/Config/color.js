const {
    emojiAttention,
    owner,
    blue
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'color',
    aliases: ['setcolor'],
    description: 'Choisis la couleur des embeds du bot',
    usage: 'color <HEX>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.ColorErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const Length = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.ColorErrorBadCode}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);


        if (!message.guild.owner) {
            return message.channel.send(WLAlready)
        }

        if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {

            const regex = /^[0-9A-F]{6}$/i

            if (!args[0]) return message.channel.send(Length)
            if (args[0].startsWith('#')) {
                let codecolor = args[0].replace(/[#]/g, '')
                if (codecolor.match(regex)) {

                    await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { color: codecolor}});
                    const newguildInfo = await client.db.guilds.findOne({id: message.guild.id});
                    const embedcolor = new Discord.MessageEmbed()
                        .setColor(newguildInfo.color)
                        .setDescription('­')
                    message.channel.send(`${lang.CodeColorSetted1} \`${codecolor}\`, ${lang.CodeColorSetted2}`)
                    return message.channel.send(embedcolor)
                } else {
                    return message.channel.send(Length)
                }
            }
            if (args[0].match(regex)) {
                let codecolor = args[0]

                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $set: { color: codecolor}});
                const newguildInfo = await client.db.guilds.findOne({id: message.guild.id});

                const embedcolor = new Discord.MessageEmbed()
                    .setColor(newguildInfo.color)
                    .setDescription('­')
                message.channel.send(`${lang.CodeColorSetted1} \`${codecolor}\`, ${lang.CodeColorSetted2}`)
                return message.channel.send(embedcolor)
            }
            return message.channel.send(Length)
        } else {
            return message.channel.send(WLAlready);
        }
    }
}
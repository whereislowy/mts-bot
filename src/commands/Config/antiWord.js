/* eslint-disable no-undef */
const Discord = require('discord.js');
const {
    blue,
    emojiAttention,
    owner,
    prefix
} = require('../../../config.json');

module.exports = {
    name: 'antiw',
    description: 'Ajout, suppression, list des mots interdits',
    aliases: ["blacklistword", "anti-insulte", "antiinsulte", "anti-word"],
    usage: 'antiword add | remove + <mot>',
    perms: `\`OWNER (du Discord)\`,  \`OWNERS (choisis avec la commande)\``,

    async execute(message, args, client, lang, guildInfo) {

        const prefixbot = guildInfo.prefix;
        const color = guildInfo.color;

        const WLnoUser = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.AntiWordBadWord}.`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.AntiWordAlready}.`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
        const WLNoArgs = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} ${lang.OwnerBadArgs} \n${prefixbot}antiw **add** + <${lang.AntiWordWord}> \n${prefixbot}antiw **remove** + <${lang.AntiWordWord}> \n${prefixbot}antiw + **list**`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const WLnoDB = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.AntiWordNoBlacklisted}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const NoWL = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.WLUsersErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (message.author.id === message.guild.owner.id || guildInfo.owner.includes(message.author.id) || message.author.id === owner) {
            if (!(args[0])) return message.channel.send(WLNoArgs);

            let memberID;

            if ((args[0]) === 'add') {
                if (args[1]) memberID = args[1]
                else return message.channel.send(WLnoUser);

                if (guildInfo.antiWords.includes(memberID)) {
                    return message.channel.send(WLAlready);
                }

                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $push: { antiWords: memberID}});

                const WLadded = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntiWordTheWord} \`${memberID}\` ${lang.AntiWordAdded}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                return message.channel.send(WLadded);
            }
            if (args[0] === 'remove') {
                if (args[1]) memberID = args[1]
                else return message.channel.send(WLnoUser);

                if (!guildInfo.antiWords.includes(memberID)) {
                    return message.channel.send(WLnoDB);
                }
                await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $pull: { antiWords: memberID}})

                const WLRemoved = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntiWordTheWord} **${memberID}** ${lang.AntiWordRemoved}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                return message.channel.send(WLRemoved);
            }
            if (args[0] === 'list') {
                const list = guildInfo.antiWords
                let result = '';
                if (!list[0]) {
                    result = `${lang.AntiWordNothing}`;
                } else {
                    let id;
                    for (id of list) {
                            result += `\`${id}\`, `;
                    }
                    result = `${result.substring(0, result.length - 2)}`;
                }
                const WLList = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`${lang.AntiWordFinal} \n ${result}`)
                    .setTimestamp()
                    .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

                return message.channel.send(WLList);
            }
        } else {
            return message.channel.send(NoWL);
        }
    },
};
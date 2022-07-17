/* eslint-disable no-undef */
const Discord = require('discord.js');
const {
    blue,
    emojiAttention,
    prefix
} = require('../../../config.json');

module.exports = {
    name: 'owner',
    description: 'Ajout, suppression, list des utilisateurs owners',
    aliases: ['owner'],
    usage: 'owner add | remove + <@user>',
    perms: `\`OWNER (du Discord)\``,

    async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

        /// //////////////////////////////////////////////////////////////
        /// /////////////////////// EMBED ///////////////////////////////
        /// ////////////////////////////////////////////////////////////

        let prefixbot = guildInfo.prefix

        const WLnoUser = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.OwnerErrorNoMention}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.OwnerErrorAlreadyWL}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const NoPerms = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} <@${message.author.id}> ${lang.OwnerErrorNoOwner}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const WLNoFind = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.OwnerErrorWLNoExist}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const WLNoArgs = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojiAttention} ${lang.OwnerBadArgs} \n${prefixbot}owner **add** + <@user> \n${prefixbot}owner **remove** + <@user> \n${prefixbot}owner + **list**`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        const WLnoDB = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> ${lang.OwnerErrorNoDB}`)
            .setTimestamp()
            .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

        if (!message.guild.owner) {
            return message.channel.send(NoPerms)
        }

        if (message.author.id !== message.guild.owner.id) return message.channel.send(NoPerms);
        if (!(args[0])) return message.channel.send(WLNoArgs);

        let memberID;

        if ((args[0]) === 'add') {
            if (args[1]) memberID = args[1].replace(/[<>!@]/g, '');
            else return message.channel.send(WLnoUser);

            if (guildInfo.owner.includes(memberID)) {
                return message.channel.send(WLAlready);
            }

            const member = message.guild.members.cache.get(memberID);
            if (!member) {
                return message.channel.send(WLNoFind);
            }

            await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $push: { owner: memberID}});
            await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $push: { 'whitelist.users': memberID}});

            const WLadded = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> ${lang.OwnerEmbedMessage1} **${member.user}** ${lang.OwnerEmbedAdded}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

            return message.channel.send(WLadded);
        }
        if (args[0] === 'remove') {
            if (args[1]) memberID = args[1].replace(/[<>!@]/g, '');
            else return message.channel.send(WLnoUser);

            if (!guildInfo.owner.includes(memberID)) {
                return message.channel.send(WLnoDB);
            }

            await client.db.guilds.findOneAndUpdate({id: message.guild.id}, { $pull: { owner: memberID}})

            const WLRemoved = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.OwnerEmbedMessage1} **${message.guild.members.cache.get(memberID).user || memberID}** ${lang.OwnerEmbedRemoved}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

            return message.channel.send(WLRemoved);
        }
        if (args[0] === 'list') {
            const list = guildInfo.owner
            let result = '';
            if (!list[0]) {
                result = `${lang.OwnerEmbedListNever}`;
            } else {
                let id;
                for (id of list) {
                    if (!message.guild.members.cache.has(id)) {

                    } else {
                        result += `\n ${message.guild.members.cache.get(id)}, `;
                    }
                }
                result = `${result.substring(0, result.length - 2)}`;
            }
            const WLList = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${lang.OwnerEmbedList} ${result}`)
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);

            return message.channel.send(WLList);
        }
    },
};
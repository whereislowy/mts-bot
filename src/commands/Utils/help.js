/* eslint-disable no-undef */
const {
    MessageEmbed,
} = require('discord.js');
const {
    blue,
    emojiAttention,
    prefix
} = require('../../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Envoie la liste des commandes',
    aliases: ['help'],
    usage: 'help',
    perms: `\`SEND_MESSAGES\``,

    async execute(message, args, client, lang, guildInfo) {

        let color = guildInfo.color
        let prefixbot = guildInfo.prefix

        if (args[0]) {
            const command = client.commands.get(args[0])
            if (command === undefined) return

            const embedhelpcommande = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(
                    `**${lang.HelpCommandName}** ${lang.commands[command.name.toLowerCase()].name}\n` +
                    `**Alias :** ${lang.commands[command.name.toLowerCase()].aliases.join(' | ')} \n` +
                    `**${lang.HelpCommandDescription}** ${lang.commands[command.name.toLowerCase()].description}\n` +
                    `**${lang.HelpCommandUtilisation}** ${prefixbot}${lang.commands[command.name.toLowerCase()].usage} \n` +
                    `**${lang.HelpCommandPerms}** ${lang.commands[command.name.toLowerCase()].perms}`
                )
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
            message.channel.send(embedhelpcommande);

        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`<:cmd:830170171577466880> ${lang.HelpTitleList}`)
                .setDescription(
                    `<:potion:830182990960525382> __**${lang.HelpDescriptionCategoryFun}**__ \n \`8ball\`, \`poll\`, \`avatar\`, \`information\`

                <:utils:830166195504021504> __**${lang.HelpDescriptionCategoryUtils}**__ \n \`help\`, \`ping\`, \`userinfo\`, \`serverinfo\`, \`botinfo\`, \`weather\`, \`warnings\`, \`invite\` 
                
                <a:mod:830188380457009152> __**${lang.HelpDescriptionCategoryModeration}**__ \n \`kick\`, \`ban\`, \`unban\`, \`mute\`, \`tempmute\`, \`unmute\`, \`warn\`, \`resetwarns\`, \`lock\`, \`unlock\`, \`nuke\`, \`clear\`, \`rolecheck\` 
                
                <:username:797862184126382170> __**${lang.HelpDescriptionCategoryAdministration}**__ \n \`embed\`, \`security\`, \`logs\`, \`vocal\`, \`addemoji\`
                
                <:list:830166107520368740> __**${lang.HelpDescriptionCategoryWhitelist}**__ \n  \`Antispam\`, \`Antilink\`, \`Antiwebhook\`, \`Antiban\`, \`Antichannel\`, \`Antieveryone\`, \`Antirole (invalide sans intents)\`, \`Antiword\`, \`logsban\`, \`logsc\`, \`logsmsg\`, \`logsroles\`\, \`deletewebhooks\` 
                
                <:engrenage:797865431805198336> __** ${lang.HelpDescriptionCategoryConfiguration}**__ \n \`prefix\`, \`language\`, \`color\`, \`setlogs\`, \`setmuterole\`, \`sanction\`, \`setup\`, \`tempvocal\`, \`ticket\`, \`rolereaction\`, \`owner\`, \`whitelist\`, \`antiw (antiword config)\`, \`config\` \n
                
                ${lang.HelpDescriptionPermissionHelp} \`${prefixbot}help <command>\`
                <:infos:830166024270774293> [Discord](https://discord.gg/9VkGNECv3v)`
                )
                .setTimestamp()
                .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
            message.channel.send(embed)

        };

    },
};
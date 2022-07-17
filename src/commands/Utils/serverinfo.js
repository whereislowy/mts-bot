const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  emojiAttention
} = require('../../../config.json');

module.exports = {
  name: 'serverinfo',
  description: 'informations sur le serveur discord',
  aliases: ['serverinfo', 'si'],
  usage: 'serverinfo',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    let region;
    switch (message.guild.region) {
      case 'europe':
        region = '🇪🇺 Europe';
        break;
      case 'us-east':
        region = '🇺🇸 us-east';
        break;
      case 'us-west':
        region = '🇺🇸 us-west';
        break;
      case 'us-south':
        region = '🇺🇸 us-south';
        break;
      case 'us-central':
        region = '🇺🇸 us-central';
        break;
      case 'eu-central':
        region = '🇪🇺 Europe';
        break;
      case 'singapore':
        region = ':flag_sg: Singapore';
        break;
      case 'sydney':
        region = ':flag_au: Sydney';
        break;
      case 'us-west':
        region = ':flag_us: U.S. West';
        break;
      case 'southafrica':
        region = ':flag_za:  South Africa';
        break;
      case 'eu-west':
        region = ':flag_eu: Western Europe';
        break;
      case 'russia':
        region = ':flag_ru: Russia';
        break;
      case 'hongkong':
        region = ':flag_hk: Hong Kong';
        break;
    }

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({
        dynamic: true,
      }))
      .setColor(color)
      .setTitle(`${message.guild.name} ${lang.ServerinfoEmbedTitle}`)
      .addFields({
        name: '<a:crown:800822175237406730> » Owner: ',
        value: `<@${message.guild.owner.user.id}>`,
        inline: true,
      }, {
        name: `<a:etoilechelou:800822203603746836> » ${lang.ServerinfoMembers}: `,
        value: `${lang.ServerinfoThereIs} ${message.guild.memberCount} ${lang.ServerinfoMembers}!`,
        inline: true,
      }, {
        name: '<:bot:797863835125022741> » Bots: ',
        value: `${lang.ServerinfoThereIs} ${message.guild.members.cache.filter((m) => m.user.bot).size} bots!`,
        inline: true,
      }, {
        name: `:date: » ${lang.ServerinfoDate}: `,
        value: message.guild.createdAt.toLocaleDateString('en-us'),
        inline: true,
      }, {
        name: `:bookmark_tabs: » ${lang.ServerinfoNBRoles}: `,
        value: `${lang.ServerinfoThereIs} ${message.guild.roles.cache.size} ${lang.ServerinfoRole}.`,
        inline: true,
      }, {
        name: '<a:world:800822154295246899> » Region: ',
        value: region,
        inline: true,
      }, {
        name: `<a:partner1:800822909681532999> » ${lang.ServerinfoPartner1}: `,
        value: message.guild.verified ? `${lang.ServerinfoPartner} <:partner:795987082303635466> !` : `${lang.ServerinfoNoPartner}`,
        inline: true,
      }, {
        name: '<a:boosters:800822501856641045> » Boosters: ',
        value: message.guild.premiumSubscriptionCount >= 1 ? `${lang.ServerinfoThereIs} ${message.guild.premiumSubscriptionCount} Boosts ${lang.ServerinfoBoost}.` : `${lang.ServerinfoNoBoost}`,
        inline: true,
      }, {
        name: '<:emoji:826835993842810884> » Emojis: ',
        value: message.guild.emojis.cache.size >= 1 ? `${lang.ServerinfoThereIs} ${message.guild.emojis.cache.size} emojis!` : `${lang.ServerinfoNoEmoji}`,
        inline: true,
      })
      .setFooter(message.guild.name, message.guild.iconURL({
        dynamic: true,
      }))
      .setTimestamp();
    await message.channel.send(embed);
  },
};
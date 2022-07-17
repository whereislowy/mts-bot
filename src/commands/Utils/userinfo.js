const {
  MessageEmbed,
  MessageFlags,
} = require('discord.js');
const moment = require('moment');
const {
  blue,
  emojiAttention
} = require('../../../config.json');

module.exports = {
  name: 'userinfo',
  aliases: ['userinfo', 'ui'],
  description: "Envoie les informations sur l'utilisateur mentionné (ou vous)",
  usage: 'userinfo + <@user>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    let user;

    if (!args[0]) {
      user = message.member;
    } else {
      user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch((err) => message.channel.send(`${lang.UserinfoNoUser}`));

      if (!user) return message.channel.send(`${lang.UserinfoBadID}`);
    }

    if (!user) {
      return message.channel.send(`${lang.UserinfoNoUser}`);
    }

    // STATUT
    const dnd = client.emojis.cache.find((emoji) => emoji.id === '797859741031202838'); // fait
    const online = client.emojis.cache.find((emoji) => emoji.id === '797859714297233408'); // fait
    const offline = client.emojis.cache.find((emoji) => emoji.id === '797859755699601458'); // fait
    const inactif = client.emojis.cache.find((emoji) => emoji.id === '797859728344219649'); // fait

    const status = {
      online: `${online} ${lang.UserinfoStatutOnline}`,
      idle: `${inactif} ${lang.UserinfoStatutIdle}`,
      dnd: `${dnd} ${lang.UserinfoStatutDND}`,
      offline: `${offline} ${lang.UserinfoStatutOffline}`,
    };

    // BOT
    const BOT = {
      false: `:x: ${lang.UserinfoNo}`,
      true: `:white_check_mark: ${lang.UserinfoYes}`,
    };

    // NOW BADGES
    let badges = await user.user.flags;
    badges = await badges.toArray();

    /* let arrayBadges = [];
        arrayBadges.forEach(badge => arrayBadges.push(BadgesAll[badge])) */

    const newbadges = [];
    badges.forEach((m) => {
      newbadges.push(m.replace('_', ' '));
    });

    const staff = client.emojis.cache.find((emoji) => emoji.id === '797862214869712926'); // fait
    const partner = client.emojis.cache.find((emoji) => emoji.id === '797858925667287050'); // fait
    const eventHype = client.emojis.cache.find((emoji) => emoji.id === '797879670493282355'); // fait
    const hunterlvl1 = client.emojis.cache.find((emoji) => emoji.id === '797879646040358922'); // fait
    const bravery = client.emojis.cache.find((emoji) => emoji.id === '797879003021180988'); // fait
    const brilliance = client.emojis.cache.find((emoji) => emoji.id === '797879029624864788'); // fait
    const balance = client.emojis.cache.find((emoji) => emoji.id === '797879016312143873'); // fait
    const supporter = client.emojis.cache.find((emoji) => emoji.id === '797858849792327702'); // fait
    const hunterlvl2 = client.emojis.cache.find((emoji) => emoji.id === '797879659475238928'); // fait
    const botverif = client.emojis.cache.find((emoji) => emoji.id === '797863426210005032'); // fait
    const dev = client.emojis.cache.find((emoji) => emoji.id === '797862200499765358'); // fait

    const emoji1 = client.emojis.cache.find((emoji) => emoji.id === '797509133493731408'); // fait
    const emoji3 = client.emojis.cache.find((emoji) => emoji.id === '797863835125022741'); // fait
    const emoji4 = client.emojis.cache.find((emoji) => emoji.id === '797864726922657832'); // fait
    const emoji5 = client.emojis.cache.find((emoji) => emoji.id === '797865238028222495'); // fait
    const emoji6 = client.emojis.cache.find((emoji) => emoji.id === '797865431805198336'); // fait
    const emoji7 = client.emojis.cache.find((emoji) => emoji.id === '797862184126382170'); // fait

    const BadgesAll = {
      DISCORD_EMPLOYEE: `${staff}`,
      PARTNERED_SERVER_OWNER: `${partner}`,
      HYPESQUAD_EVENTS: `${eventHype}`,
      BUGHUNTER_LEVEL_1: `${hunterlvl1}`,
      HOUSE_BRAVERY: `${bravery}`,
      HOUSE_BRILLIANCE: `${brilliance}`,
      HOUSE_BALANCE: `${balance}`,
      EARLY_SUPPORTER: `${supporter}`,
      BUGHUNTER_LEVEL_2: `${hunterlvl2}`,
      VERIFIED_BOT: `${botverif}`,
      EARLY_VERIFIED_BOT_DEVELOPER: `${dev}`,
    };

    const arrayBadges = [];
    badges.forEach((badge) => arrayBadges.push(BadgesAll[badge]));

    const embed = new MessageEmbed()
      .setThumbnail(user.user.displayAvatarURL({
        dynamic: true,
      }));

    // EMBED COLOR BASED ON member
    embed.setColor(color);

    // OTHER STUFF
    embed.setAuthor(user.user.tag, user.user.displayAvatarURL({
      dynamic: true,
    }));

    const User = message.mentions.users.first() || message.member.user;
    const member = message.guild.members.cache.get(User.id);

    // CHECK IF USER HAVE NICKNAME
    if (user.nickname !== null) embed.addField(`📖 » ${lang.UserinfoNom}`, user.nickname);
    embed.addField(`${emoji7} » Pseudo`, `${user.user.username}`, true)
      .addField(`${emoji4} » Hashtag `, `#${user.user.discriminator}`, true)
      .addField(`${emoji5} » ID`, `\`${user.user.id}\``, false)
      .addField(`${emoji1} » Badges`, `${arrayBadges.length === 0 ? `${lang.UserinfoNoBadge}` : arrayBadges.join(' ')}`, true)
      .addField(`${emoji3} » Bot `, ` ${BOT[user.user.bot]}`, true)
      .addField(`${emoji6} » Status `, `${status[user.user.presence.status]}`, false)
      .addField(`🗓️ » ${lang.UserinfoJoinTime}`, moment(member.joinedAt).format('DD/MM/YYYY HH:mm:ss'), true)
      .addField(`📥 » ${lang.UserinfoAccountCreated}`, moment(User.createdAt).format('DD/MM/YYYY HH:mm:ss'), true)
      .setTimestamp()
      .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`);
    return message.channel.send(embed).catch((err) => message.channel.send(`Error : ${err}`));
  },
};

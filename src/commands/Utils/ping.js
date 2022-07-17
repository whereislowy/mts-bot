const {
  blue,
  emojiAttention
} = require('../../../config.json');

module.exports = {
  name: 'ping',
  aliases: ['ms', 'ping'],
  description: 'Envoie la latence du bot',
  usage: 'ping',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

    let color = guildInfo.color

    message.channel.send({
      embed: {

        color: color,
        title: `${lang.PingTitle}`,
        description: `__${lang.PingEmbed} ${message.client.ws.ping} ms.__`,
        footer: {
          icon_url: `${client.user.displayAvatarURL()}`,
          text: `${client.user.username} © 2021`,
        },
      },
    });
  },
};

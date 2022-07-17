const weather = require('weather-js');
const {
  MessageEmbed,
} = require('discord.js');
const {
  blue,
  emojiAttention
} = require('../../../config.json');

module.exports = {
  name: 'weather',
  description: 'Affiche les conditions climatique de la ville',
  aliases: ['weather'],
  usage: 'weather + <ville>',
  perms: `\`SEND_MESSAGES\``,

  async execute(message, args, client, lang, guildInfo) {

let color = guildInfo.color

    weather.find({
      search: args.join(' '),
      degreeType: 'C',
    }, (error, result) => {
      try {
        message.delete();
      } catch {

      }
      if (error) {
        return message.channel.send(`${lang.WeatherNoLocalisation}`).then((m) => {
          try {
            m.delete({
              timeout: 5000,
            })
          } catch {

          }
        });
      }

      if (result === undefined || result.length === 0) {
        return message.channel.send(`${lang.WeatherInvalidLocalisation}`).then((m) => {
          try {
            m.delete({
              timeout: 5000,
            })
          } catch {

          }
        });
      }

      const {
        current
      } = result[0];
      const {
        location
      } = result[0];

      const weatherinfo = new MessageEmbed()
        .setDescription(`**${current.skytext}**`)
        .setAuthor(`┃ • ${current.observationpoint} • ┃`)
        .setThumbnail(current.imageUrl)
        .setColor(color)
        .addField(`🧭 » ${lang.WeatherFuseau}`, `UTC${location.timezone}`, true)
        .addField(`🌀 » ${lang.WeatherTypeDegré}`, `Celsius`, true)
        .addField(`🌡️ » ${lang.WeatherTemp}`, `${current.temperature}°`, true)
        .addField(`💨 » ${lang.WeatherVent}`, current.winddisplay, true)
        .addField(`❄️ » ${lang.WeatherTempMin}`, `${current.feelslike}°`, true)
        .addField(`💦 » ${lang.WeatherHumidité}`, `${current.humidity}%`, true)
        .setFooter(`${client.user.username} © 2021`, `${client.user.displayAvatarURL()}`)
        .setTimestamp();

      message.channel.send(weatherinfo);
    });
  },
};
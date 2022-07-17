const {
    token,
} = require('./config.json');
const { Client }  = require('discord.js');
const express = require('express');
const app = express();
const Bot = new Client();
Bot.login(token)
Bot.on('ready', () => {
    console.log('Bot Running')
});
app.listen(6666, () => {
    console.log('API Running')
});
app.get('/shardReady/:id', (req, res) => {
    Bot.channels.cache.get('810545586213355581').send(`shard ${req.params.id} ready`)
    res.status(200)
})
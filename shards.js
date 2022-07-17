const {
    ShardingManager
} = require('discord.js');
require('./API')
const config = require('./config.json')
const manager = new ShardingManager('./index.js', {
    token: config.token,
    totalShards: 1,
});

manager.on('shardCreate', shard => {
    console.log(`Le shard ${shard.id} a été lancé avec succès !`);
})
manager.spawn();
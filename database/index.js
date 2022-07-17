const monk = require('monk')

const db = monk('mongodb+srv://Makrag:15XkrFlaWyePF1B3@mts.xslzi.mongodb.net/servers');
const antiraidDB = db.get('antiraid');
const guildDB = db.get('guilds');
const users_everyoneDB = db.get('users_everyone');
const raidSchema = require('./schema/schemaAntiraid');
const guildSchema = require('./schema/schemaServer');


console.log(`MongoDB connecté avec succès`);
const DBHandler = {
    raids: antiraidDB,
    guilds: guildDB,
    users: users_everyoneDB, 
    schemas: {
        raid: raidSchema,
        guild: guildSchema
    }
}
module.exports = DBHandler;
const { Client, Intents } = require('discord.js')
const WOKCommands = require('wokcommands')
const path = require('path')
const config = require('./config.json')

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
});

client.once('ready', () => {
    const dbOptions = {
    // These are the default values
    keepAlive: true
  }
    
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir: path.join(__dirname, 'features'),
        testServers: ['881714420408000512'],
        botOwners: ['717224587951079445'],
        dbOptions,
        mongoUri: config.mongoUri,
    })
});

client.on('interactionCreate', async interaction => {
   console.log('Some Interaction was used')
});
client.on('messageCreate', async message => {
   console.log('Some message was sent')
});

client.login(config.token);
"use strict";

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

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: (path.join(__dirname, 'commands')),
        featuresDir: (path.join(__dirname, 'features')),
        testServers: '882069662978949140',
        botOwners: '717224587951079445',
        mongoUri: config.mongoUri,
    })
});

client.login(config.token);
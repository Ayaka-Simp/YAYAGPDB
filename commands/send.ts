// module.exports = {}

import { ICommand } from "wokcommands";
import { TextChannel } from 'discord.js'

export default {
    category: "Configuration",
    description: "Sends a message in the channel specified",

    requiredPermissions: ['MANAGE_MESSAGES'],

    minArgs: 2,
    expectedArgs: '<channel> <text>',
    expectedArgsTypes: ['CHANNEL', 'STRING'],

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    callback: ({ message, interaction, args}) => {
        const channel = (message ? message.mentions.channels.first() : interaction.options.getChannel('channel'));
        if (!channel || channel.type !== "GUILD_TEXT") {
            return "Please tag a text channel.";
        };

        args.shift();
        const text = args.join(' ');

        (channel as TextChannel).send(text)

        if (interaction) {
            interaction.reply({
                content: "Sent message!",
                ephemeral: true
            })
        }
    }
} as ICommand
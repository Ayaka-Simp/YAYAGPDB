import { ICommand } from "wokcommands";

export default {
    category: 'support',
    description: 'Sends useful bot links into the chat',

    slash: "both",

    testOnly: true,

    callback: ({ message, interaction }) => {
        if (message) {
            message.reply("Bot invite link: https://discord.com/api/oauth2/authorize?client_id=907120960652607520&permissions=8&scope=bot%20applications.commands \nSupport server invite link: https://discord.gg/6gZg2ZV73E")
        } else {
            interaction.reply("Bot invite link: https://discord.com/api/oauth2/authorize?client_id=907120960652607520&permissions=8&scope=bot%20applications.commands \nSupport server invite link: https://discord.gg/6gZg2ZV73E")
        }
    }
} as ICommand
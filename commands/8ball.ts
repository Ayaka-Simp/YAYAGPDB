import { ICommand } from "wokcommands";

export default {
    category: "Fun",
    description: "Classic magic 8 ball toy simulated in a command!",

    minArgs: 1,
    expectedArgs: "<question>",
    expectedArgsTypes: ["STRING"],

    slash: 'both',
    guildOnly: false,
    testOnly: true,

    callback: ({message, interaction, args}) => {
        const responses = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];

        const indexOfList = Math.floor(Math.random() * 20) - 1

        return `Question: ${args.join(' ')}\n\nAnswer: ${responses[indexOfList]}`
    }
} as ICommand
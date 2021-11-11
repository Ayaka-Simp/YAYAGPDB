// module.exports = {}

async function clearAllMessagesByCloning(channel, message) {
    // Clone channel
    const newChannel = await channel.clone()

    // Delete old channel
    channel.delete()
    newChannel.send(message)
}

module.exports = {
    category: 'Moderation',
    description: 'Deletes one or more messages at once. Leave amount blank to clone-delete the channel.',

    requiredPermissions: ['MANAGE_MESSAGES'],

    maxArgs: 1,
    expectedArgs: '[amount]',
    expectedArgsTypes: ['NUMBER'],

    slash: "both",
    testOnly: true,
    
    callback: async ({ message, interaction, channel, args }) => {
        //
        const amount = args.length ? parseInt(args.shift()) : 0

        if (!amount) {
            await clearAllMessagesByCloning(channel, `Deleted all messages`)
            setTimeout(() => {
                channel.send("Cleared messages!")
            }, 1000);
        }

        if (message) {
            await message.delete()
        }

        if (amount > 100) {
            return {
                content: "Amount cannot be over 100!",
                ephemeral: true
            }
        }

        // Bulk delete

        // const { size } = await channel.bulkDelete(amount, true)

        // Fetch and then delete messages
        const messages = await channel.messages.fetch({ limit: amount })
        const { size } = messages

        messages.forEach((message) => message.delete())

        const reply = `Deleted ${size} messages`

        if (interaction) {
            return reply
        }
        
        channel.send(reply)
        
    }
}
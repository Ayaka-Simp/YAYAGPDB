const { GuildMember, MessageActionRow,  MessageSelectMenu }  = require('discord.js');

module.exports = {
    category: 'Configuration',
    description: 'Adds a role to the auto role message.',

    permissions: ['MANAGE_GUILD'],

    minArgs: 3,
    maxArgs: 3,
    expectedArgs: '<channel> <messageId> <role>',
    expectedArgsTypes: ['CHANNEL', 'STRING', 'ROLE'],

    slash: "both",
    testOnly: true,
    guildOnly: true,

    init: (client) => {
        client.on('interactionCreate', interaction => {
            if (!interaction.isSelectMenu()) {
                return
            }

            const { customId, values, member } = interaction

            if (customId === 'autoRoles' && member instanceof GuildMember) {
                const component = interaction.component
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })
                
                for (const id of removed) {
                    member.roles.remove(id.value)
                }


                for (const id of values) {
                    member.roles.add(id)
                }

                interaction.reply({
                    content: 'Roles updated!',
                    ephemeral: true
                })
            }
        })
    },

    callback: async ({ message, interaction, args, client }) => {
        const channel = (message
        ? message.mentions.channels.first()
        : interaction.options.getChannel('channel'))
        if (!channel || channel.type !== 'GUILD_TEXT') {
            return 'Please tag a text channel.'
        }

        const messageId = args[1]

        const role = (message ? message.mentions.roles.first() : interaction.options.getRole('role'))
        if (!role) {
            return 'Unknown role!'
        }

        const targetMessage = await channel.messages.fetch(messageId, {
            cache: true,
            force: true
        })

        if (!targetMessage) {
            return `${messageId} is not a valid message id.`
        }

        if (targetMessage.author.id !== client.user?.id) {
            return `Please provide a message ID that was sent from <@${client.user?.id}}>`
        }

        let row = targetMessage.components[0]
        if (!row) {
            row = new MessageActionRow()
        }

        const option = [{
            label: role.name,
            value: role.id
        }]

        let menu = row.components[0]
        if (menu) {
            for (const o of menu.options) {
                if (o.value === option[0].value) {
                    return {
                        custom: true,
                        content: `<@&${o.value}> is already part of this menu.`,
                        allowedMentions: {
                            roles: []
                        },
                        ephemeral: true,
                    }
                }
            }

            menu.addOptions(option)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                    .setCustomId('autoRoles')
                    .setMinValues(0)
                    .setMaxValues(1)
                    .setPlaceholder('Select your roles...')
                    .addOptions(option)
            )
        }

        targetMessage.edit({
            components: [row]
        })

        return {
            custom: true,
            content: `Added <@&${role.id}> to the auto roles menu.`,
            allowedMentions: {
                roles: []
            },
            ephemeral: true
        }
    },
}
// module.exports = {}

const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    category: "Moderation",
    description: "Kicks a member",

    requiredPermissions: ["KICK_MEMBERS"],

    minArgs: 1,
    maxArgs: 2,

    expectedArgs: "<member> [reason]",
    expectedArgsTypes: ["USER", "STRING"],

    slash: 'both',
    guildOnly: true,
    testOnly: true,

    callback: ({ guild, message, interaction, channel, args }) => {
        const memberId = args.shift();
        const member = guild.members.cache.get(memberId);
        const embed = new MessageEmbed()
            .setTitle("Confirmation")
            .setDescription(`Are you sure you want to kick <@${member?.id}>?`);

        const yesButton = new MessageButton()
            .setCustomId("confirmedKick")
            .setLabel("Proceed")
            .setStyle('SUCCESS');

        const noButton = new MessageButton()
            .setCustomId("canceledKick")
            .setLabel("Cancel")
            .setStyle("DANGER");

        const confirmationRow = new MessageActionRow()
            .addComponents([yesButton, noButton]);

        message
            ? message.reply({
                embeds: [embed],
                components: [confirmationRow],
                allowedMentions: { users: [] }
            })
            : interaction.reply({
                embeds: [embed],
                components: [confirmationRow],
                ephemeral: true,
                allowedMentions: { users: [] }
            });

        const filter = (btnInt) => {
            const author = message ? message.author : interaction.user;
            return btnInt.user.id === author.id && btnInt.customId === "confirmedKick" || btnInt.customId === "canceledKick";
        };

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15
        });

        collector.on('collect', async (i) => {
            if (i.customId === "confirmedKick") {
                await member.kick();
                message
                    ? message.reply(`Kicked <@${member?.id}>`)
                    : interaction.reply({
                        ephemeral: true,
                        content: `Kicked <@${member?.id}>`
                    });
            } else {
                message
                    ? message.reply(`Kick canceled.`)
                    : interaction.reply({
                        ephemeral: true,
                        content: `Kick canceled.`
                    });
            }
        });
    },
}
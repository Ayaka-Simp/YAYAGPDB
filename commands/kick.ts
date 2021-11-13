// module.exports = {}

import { ICommand } from "wokcommands";

import { MessageActionRow, MessageButton, MessageEmbed, DiscordAPIError, ButtonInteraction, Interaction } from "discord.js";

export default {
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

        const filter = (btnIn: Interaction) => {
            const btnInt = btnIn as ButtonInteraction
            const author = message ? message.author : interaction.user;
            return btnInt.user.id === author.id && btnInt.customId === "confirmedKick" || btnInt.customId === "canceledKick";
        };

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 30,
        });

        collector.on('collect', async (i: ButtonInteraction) => {
            try {
                if (i.customId === "confirmedKick") {
                    if (args) {
                        await member.kick(args.shift())
                    } else {
                        await member.kick()
                    }
                    message
                        ? message.reply(`Kicked <@${member?.id}>`)
                        : i.reply({
                            ephemeral: true,
                            content: `Kicked <@${member?.id}>`
                        });
                } else {
                    message
                        ? message.reply(`Kick canceled.`)
                        : i.reply({
                            ephemeral: true,
                            content: `Kick canceled.`
                        });
                }
            }
            catch (err) {
                if (err instanceof DiscordAPIError) {
                    message
                        ? message.reply(`Couldn't kick <@${member.id}> because I am too low in the hiearchy!`)
                        : i.reply({
                            ephemeral: true,
                            content: `Couldn't kick <@${member.id}> because I am too low in the hiearchy!`
                        })
                }
            }            
        });
    },
} as ICommand
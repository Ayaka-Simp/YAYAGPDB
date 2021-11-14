// module.exports = {}

import { ButtonInteraction, Interaction } from "discord.js";
import { ICommand } from "wokcommands";

const { MessageActionRow, MessageButton, MessageEmbed, DiscordAPIError } = require("discord.js")

module.exports = {
    category: "Moderation",
    description: "Bans a member",

    requiredPermissions: ["BAN_MEMBERS"],

    minArgs: 1,
    maxArgs: 2,

    expectedArgs: "<member> [reason]",
    expectedArgsTypes: ["USER", "STRING"],

    slash: 'both',
    guildOnly: true,
    testOnly: true,

    callback: ({ guild, message, interaction, channel, args }) => {
        const memberId = args.shift();
        const member = guild!.members.cache.get(memberId!)!;
        const embed = new MessageEmbed()
            .setTitle("Confirmation")
            .setDescription(`Are you sure you want to ban <@${member?.id}>?`);

        const yesButton = new MessageButton()
            .setCustomId("confirmedBan")
            .setLabel("Proceed")
            .setStyle('SUCCESS');

        const noButton = new MessageButton()
            .setCustomId("canceledBan")
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
            if (btnIn.isButton()) {
                const author = message ? message.author : interaction.user;
                const btnInt = btnIn as ButtonInteraction
                return btnInt.user.id === author.id && btnInt.customId === "confirmedBan" || btnInt.customId === "canceledBan";
            }
        };

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 30,
            
        });

        collector.on('collect', async (i: ButtonInteraction) => {
            try {
                if (i.customId === "confirmedBan") {
                    if (args.shift()) {
                        await member.ban({
                            reason: args.shift()
                        })
                    } else {
                        await member.ban()
                    }
                    message
                        ? message.reply(`Banned <@${member?.id}>`)
                        : i.reply({
                            ephemeral: true,
                            content: `Banned <@${member?.id}>`
                        });
                } else {
                    message
                        ? message.reply(`Ban canceled.`)
                        : i.reply({
                            ephemeral: true,
                            content: `Ban canceled.`
                        });
                }
            }
            catch (err) {
                if (err instanceof DiscordAPIError) {
                    message
                        ? message.reply(`Couldn't ban <@${member.id}> because I am too low in the hiearchy!`)
                        : i.reply({
                            ephemeral: true,
                            content: `Couldn't ban <@${member.id}> because I am too low in the hiearchy!`
                        })
                }
            }            
        });
    },
} as ICommand
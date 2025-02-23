import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { events } from "..";
import { client } from "../client";

export const createListAttendeesCommand = () => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        if (interaction.commandName === 'listattendees') {
            const messageId = interaction.options.getString('messageid', true);
            const eventEntry = Object.values(events).find(entry => entry.messageId === messageId);
    
            if (eventEntry) {
                const attendeeList = eventEntry.events.map(event => {
                    const attendees = event.attendees.map(attendee => attendee.username).join(', ');
                    return `**${event.name}:** ${attendees || 'No attendees'}`;
                }).join('\n');
    
                const embed = new EmbedBuilder()
                    .setTitle('Event Attendees')
                    .setDescription(attendeeList)
                    .setColor(0x00FF00);
    
                const buttons = eventEntry.events.map((event, index) => {
                    return new ButtonBuilder()
                        .setCustomId(`sendreminder_${messageId}_${event.name}`)
                        .setLabel(`Send Reminder for ${event.name}`)
                        .setStyle(ButtonStyle.Primary);
                });
    
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
    
                await interaction.reply({ embeds: [embed], components: [row] });
            } else {
                await interaction.reply({ content: 'No events found for the given message ID.', ephemeral: true });
            }
        }
    });    
};

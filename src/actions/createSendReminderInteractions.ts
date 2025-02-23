import { EmbedBuilder } from 'discord.js';
import { events } from '..';
import { client } from '../client';

export const createSendReminderInteractions = () => {
    const sendReminder = async (interaction: any, messageId: string, eventName: string) => {
        const eventEntry = Object.values(events).find(entry => entry.messageId === messageId);

        if (eventEntry) {
            const event = eventEntry.events.find(event => event.name === eventName);
            if (event) {
                const reminderEmbed = new EmbedBuilder()
                    .setTitle(`Reminder for the event: ${event.name}`)
                    .setDescription(`**Happening <t:${event.timestamp}:R>**\nThe event is scheduled at <t:${event.timestamp}:F>`)
                    .setColor(0x00FF00);

                for (const attendee of event.attendees) {
                    const user = await client.users.fetch(attendee.id);
                    user.send({ embeds: [reminderEmbed] });
                }

                await interaction.reply({ content: 'Reminders sent to all attendees.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Event not found with the given name.', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'No events found for the given message ID.', ephemeral: true });
        }
    };

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        const [action, messageId, eventName] = interaction.customId.split('_');
        if (action === 'sendreminder') {
            await sendReminder(interaction, messageId, eventName);
        }
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'sendreminder') {
            const messageId = interaction.options.getString('messageid', true);
            const eventName = interaction.options.getString('eventname', true);
            const eventEntry = Object.values(events).find(entry => entry.messageId === messageId);

            if (eventEntry) {
                const event = eventEntry.events.find(event => event.name === eventName);
                if (event) {
                    const reminderEmbed = new EmbedBuilder()
                        .setTitle(`Reminder for the event: ${event.name}`)
                        .setDescription(`**Happening <t:${event.timestamp}:R>**\nThe event is scheduled at <t:${event.timestamp}:F>`)
                        .setColor(0x00FF00);

                    for (const attendee of event.attendees) {
                        const user = await client.users.fetch(attendee.id);
                        user.send({ embeds: [reminderEmbed] });
                    }

                    await interaction.reply({ content: 'Reminders sent to all attendees.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Event not found with the given name.', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'No events found for the given message ID.', ephemeral: true });
            }
        }
    });
};

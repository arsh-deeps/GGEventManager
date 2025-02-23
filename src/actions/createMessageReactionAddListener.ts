import { EmbedBuilder } from 'discord.js';
import { events } from '..';
import { saveEvents } from '../dao';
import { client } from '../client';
import { buildEventsEmbed } from '../utils/buildEventsEmbed';
import { findEventEntry, parseEmojiIndex } from '../utils/findEventEntry';
import { Attendee } from '../model/Attendee';

export const createMessageReactionAddListener = () => {
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return;

        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Failed to fetch the message:', error);
                return;
            }
        }

        const eventEntry = findEventEntry(reaction);
        if (eventEntry) {
            const eventIndex = parseEmojiIndex(reaction.emoji.name);
            if (eventIndex !== -1 && eventEntry.events[eventIndex]) {
                const event = eventEntry.events[eventIndex];
                if (!event.attendees.some(attendee => attendee.id === user.id)) {
                    if (user.username) {
                        event.attendees.push(new Attendee(user.id, user.username));
                    }
                    saveEvents(events);

                    const embed = buildEventsEmbed(eventEntry.events);
                    await reaction.message.edit({ embeds: [embed] });

                    const rsvpEmbed = new EmbedBuilder()
                        .setTitle(`You have RSVP'd for the event`)
                        .setDescription(`${event.name} at <t:${event.timestamp}:F>`)
                        .setColor(0x00FF00)
                        .setFooter({ text: "You can remove your RSVP by removing your reaction." });

                    user.send({ embeds: [rsvpEmbed] });
                }
            }
        }
    });
}
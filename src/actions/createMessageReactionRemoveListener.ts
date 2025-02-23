import { EmbedBuilder } from "discord.js";
import { events } from "..";
import { saveEvents } from '../dao';
import { client } from "../client";
import { buildEventsEmbed } from "../utils/buildEventsEmbed";
import { findEventEntry, parseEmojiIndex } from "../utils/findEventEntry";

export const createMessageReactionRemoveListener = () => {
    client.on('messageReactionRemove', async (reaction, user) => {
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
                const attendeeIndex = event.attendees.findIndex(attendee => attendee.id === user.id);
                if (attendeeIndex !== -1) {
                    event.attendees.splice(attendeeIndex, 1);
                    saveEvents(events);

                    const embed = buildEventsEmbed(eventEntry.events);
                    await reaction.message.edit({ embeds: [embed] });

                    const unRSVPEmbed = new EmbedBuilder()
                        .setTitle(`You have un-RSVP'd for the event`)
                        .setDescription(`${event.name} at <t:${event.timestamp}:F>`)
                        .setColor(0xFF0000);

                    user.send({ embeds: [unRSVPEmbed] });
                }
            }
        }
    });
};
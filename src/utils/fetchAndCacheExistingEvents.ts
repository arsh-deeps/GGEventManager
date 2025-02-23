import { events } from '..';
import { client } from '../client';

export async function fetchAndCacheExistingEvents() {
    for (const eventId in events) {
        const event = events[eventId];
        if (event.messageId && event.channelId) {
            try {
                const channel = await client.channels.fetch(event.channelId);
                if (channel && channel.isTextBased()) {
                    await channel.messages.fetch(event.messageId);
                }
            } catch (error) {
                console.error(`Failed to fetch message for event ${eventId}:`, error);
            }
        }
    }
}

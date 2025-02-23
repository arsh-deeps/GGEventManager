import { events } from '..';
import { saveEvents } from '../dao';
import { client } from '../client';
import { Event } from '../model/Event';
import { buildEventsEmbed } from '../utils/buildEventsEmbed';

export const createGroupEventsCommand = () => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'creategroupevents') {
            const eventInputs = interaction.options.getString('events', true);
            const eventList = eventInputs.split(';').map(event => {
                const [name, timestampStr] = event.split(',').map(e => e.trim());
                const timestamp = parseInt(timestampStr, 10);
                return new Event(name, timestamp);
            });

            const eventId = `${interaction.guildId}-${Date.now()}`;
            events[eventId] = { events: eventList, channelId: interaction.channelId };
            saveEvents(events);

            const embed = buildEventsEmbed(eventList);

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            events[eventId].messageId = message.id;
            saveEvents(events);

            for (let i = 0; i < eventList.length; i++) {
                await message.react(`${i + 1}️⃣`);
            }
        }
    });
}

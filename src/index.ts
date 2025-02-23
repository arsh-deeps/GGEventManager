import { config } from 'dotenv';
import { Event } from './model/Event';
import { client } from './client';
import { fetchAndCacheExistingEvents } from './utils/fetchAndCacheExistingEvents';
import { buildSlashCommandsForGuild } from './utils/buildSlashCommandsForGuild';
import { createGroupEventsCommand } from './actions/createGroupEventsCommand';
import { createMessageReactionAddListener } from './actions/createMessageReactionAddListener';
import { createMessageReactionRemoveListener } from './actions/createMessageReactionRemoveListener';
import { createSendReminderInteractions } from './actions/createSendReminderInteractions';
import { createListAttendeesCommand } from './actions/createListAttendeesCommand';
import { loadEvents } from './dao';

config(); 
export let events: Record<string, { events: Event[], messageId?: string, channelId?: string }> = loadEvents();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    await buildSlashCommandsForGuild(client);
    await fetchAndCacheExistingEvents();
});

createGroupEventsCommand();
createMessageReactionAddListener();
createMessageReactionRemoveListener();
createListAttendeesCommand();
createSendReminderInteractions();

client.login(process.env.DISCORD_BOT_TOKEN);
import { SlashCommandBuilder, REST, Routes, EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { Attendee } from './Attendee';
import { Event } from './Event';
import { client } from './client.1';
import { buildEventsEmbed } from './utils/buildEventsEmbed';
import { findEventEntry, parseEmojiIndex } from './utils/findEventEntry';
import { fetchAndCacheExistingEvents } from './utils/fetchAndCacheExistingEvents';

config(); // Load environment variables from .env

const eventsFile = 'events.json';
const loadEvents = () => existsSync(eventsFile) ? JSON.parse(readFileSync(eventsFile, 'utf8')) : {};
const saveEvents = (data: any) => writeFileSync(eventsFile, JSON.stringify(data, null, 2));

export let events: Record<string, { events: Event[], messageId?: string, channelId?: string }> = loadEvents();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    await buildSlashCommandsForGuild();

    await fetchAndCacheExistingEvents();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'createevent') {
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

async function buildSlashCommandsForGuild() {
    const commands = [
        new SlashCommandBuilder()
            .setName('createevent')
            .setDescription('Create one or multiple events')
            .addStringOption(option => option.setName('events')
                .setDescription('Event details in the format: Name,Timestamp;Name,Timestamp')
                .setRequired(true)
            )
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

    try {
        if (process.env.GUILD_ID) {
            await rest.put(Routes.applicationGuildCommands(client.user!.id, process.env.GUILD_ID), { body: commands });
            console.log(`Registered commands for guild ${process.env.GUILD_ID}`);
        } else {
            console.error('GUILD_ID is not defined in the environment variables.');
        }
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
}

client.login(process.env.DISCORD_BOT_TOKEN);

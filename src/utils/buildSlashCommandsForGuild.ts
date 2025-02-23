import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";

export async function buildSlashCommandsForGuild(client: Client) {
    const commands = [
        new SlashCommandBuilder()
            .setName('creategroupevents')
            .setDescription('Create one or multiple events')
            .addStringOption(option => option.setName('events')
                .setDescription('Event details in the format: Name,Timestamp;Name,Timestamp')
                .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('listattendees')
            .setDescription('List all attendees for all events for a given message ID')
            .addStringOption(option => option.setName('messageid')
                .setDescription('The message ID of the event')
                .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('sendreminder')
            .setDescription('Send a reminder for a specific event')
            .addStringOption(option => option.setName('messageid')
                .setDescription('The message ID of the event')
                .setRequired(true)
            )
            .addStringOption(option => option.setName('eventname')
                .setDescription('The name of the event')
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
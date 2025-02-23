import { EmbedBuilder } from 'discord.js';
import { Event } from '../model/Event';

export function buildEventsEmbed(eventList: Event[]): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setTitle(`Upcoming Events:`)
        .setColor(0x00AE86);

    eventList.forEach((e, i) => {
        const attendees = e.attendees.length > 0 ? e.attendees.map(attendee => `<@${attendee.id}>`).join(', ') : "No attendees yet.";
        embed.addFields(
            { name: ` ${i + 1}️⃣ 📅  ${e.name}`, value: `<t:${e.timestamp}:F>`, inline: false },
            { name: 'Attendees', value: attendees, inline: false }
        );
    });

    embed.setImage("https://cdn.discordapp.com/attachments/778891526368526387/1342941256518602854/SignUpGoose.png")
        .setFooter({ text: "React with the corresponding number to RSVP! You can remove your RSVP by removing your reaction." });

    return embed;
}

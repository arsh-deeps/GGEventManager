import { events } from '..';

export function findEventEntry(reaction: any) {
    return Object.values(events).find(entry => entry.messageId === reaction.message.id);
}
export function parseEmojiIndex(emojiName: string | null): number {
    return emojiName ? parseInt(emojiName[0]) - 1 : -1;
}

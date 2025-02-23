import { existsSync, readFileSync, writeFileSync } from 'fs';

const EVENTS_FILE = 'events.json';
export const loadEvents = () => existsSync(EVENTS_FILE) ? JSON.parse(readFileSync(EVENTS_FILE, 'utf8')) : {};
export const saveEvents = (data: any) => writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2));

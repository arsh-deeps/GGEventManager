import { Attendee } from "./Attendee";

export class Event {
    name: string;
    timestamp: number;
    attendees: Attendee[];

    constructor(name: string, timestamp: number) {
        this.name = name;
        this.timestamp = timestamp;
        this.attendees = [];
    }
}

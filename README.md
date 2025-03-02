# GGEventManager

GGEventManager is a Discord bot that allows users to create event announcements and RSVP for events.

## Features

- Create event announcements with a simple slash command.
- RSVP for events by reacting to the event message.
- Automatically updates the event message with the list of attendees.
- Sends a direct message to users when they RSVP or un-RSVP for an event.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/arsh-deeps/GGEventManager.git
    cd GGEventManager
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/0) file in the root directory with the following content:
    ```env
    DISCORD_BOT_TOKEN=your-discord-bot-token
    GUILD_ID=your-guild-id
    ```

4. Build the project:
    ```sh
    npm run build
    ```

5. Start the bot:
    ```sh
    npm start
    ```

## Usage

1. Invite the bot to your Discord server.
2. Use the `/createevent` slash command to create events. The command format is:
    ```
    /createevent events: EventName1,Timestamp1;EventName2,Timestamp2
    ```
    Example:
    ```
    /createevent events: Sketchful,1672531199;Gartic,1672617599
    ```

3. Users can RSVP for events by reacting to the event message with the corresponding number emoji.
4. Users can un-RSVP by removing their reaction.

### New Commands

- **/creategroupevents**: Create multiple events at once.
    ```
    /creategroupevents group: GroupName events: EventName1,Timestamp1;EventName2,Timestamp2
    ```
    Example:
    ```
    /creategroupevents group: Gaming events: AmongUs,1672531199;Valorant,1672617599
    ```

- **/listevents**: List all upcoming events.
    ```
    /listevents message_id: MessageID
    ```
    This command will display all upcoming events in the specified message, with buttons to send reminders for each event separately.


- **/sendreminder**: Send a reminder to users who have RSVP'd for an event.
    ```
    /sendreminder message_id: MessageID event: EventName
    ```
    Example:
    ```
    /sendreminder message_id: 1234567890 event: Sketchful
    ```

## Development

To start the bot in development mode with TypeScript support, run:
```sh
npm run dev
```
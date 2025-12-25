# MPK TRAFFIC DISRUPTIONS SCRAPER AND SERVER

## Installation

Clone the repository and navigate to the directory using:

```bash
   git clone git@github.com:pawelek3113/mpk-traffic-disruptions.git
   cd mpk-traffic-disruptions
```

Install the dependencies:

```bash
   npm install
```

Create a `.env` file containing necessary environment variables:

```bash
   touch .env && echo DISCORD_BOT_TOKEN=your_discord_bot_token >> .env && echo DISCORD_CHANNEL_ID=your_discord_channel_id >> .env
```

## Building and running

Run scraper once:

```bash
   npm run build
   npm start
```

or run a server:

```bash
   npm run start-server
```

## Development

Run scraper in development mode:

```bash
   npm run dev
```

or run a server in development mode:

```bash
   npm run dev-server
```

# MPK Traffic Disruptions

Scrapes real-time traffic disruption data from [MPK Łódź](https://www.mpk.lodz.pl) and exposes it via an HTTP server or Discord webhook notifications.

## Stack

- **Runtime:** Node.js + TypeScript
- **Scraping:** Axios + Cheerio
- **Storage:** SQLite (`better-sqlite3`)
- **Server:** Express
- **Notifications:** Discord.js webhook
- **Scheduling:** node-cron, or via crontab in your OS

## Setup

```bash
git clone git@github.com:pawelek3113/mpk-traffic-disruptions.git
cd mpk-traffic-disruptions
npm install
```

### Environment variables

```bash
cp .env.example .env
```

| Variable              | Description                             |
| --------------------- | --------------------------------------- |
| `DISCORD_WEBHOOK`     | Discord webhook URL for notifications   |
| `DATABASE_FILE`       | Path to SQLite database file            |
| `CONTAINER_DB_FOLDER` | Mount point for DB volume (Docker only) |

## Usage

| Command                 | Description               |
| ----------------------- | ------------------------- |
| `npm run dev`           | Run scraper in watch mode |
| `npm run dev-server`    | Run server in watch mode  |
| `npm run prod`          | Build and run scraper     |
| `npm run prod-server`   | Build and run server      |
| `npm test`              | Run tests                 |
| `npm run test:coverage` | Generate coverage report  |

## Docker

```bash
docker compose build
docker compose run --rm app
```

### Scheduling with cron

```bash
mkdir logs
crontab -e

*/5 * * * * cd /path/to/project && /usr/bin/docker compose run --rm app 2>&1 | /usr/bin/ts '[\%Y-\%m-\%d \%H:\%M:\%S]' >> /path/to/logs/cron.log
```

> Requires `ts` from `moreutils`: `sudo apt install moreutils`

## GitHub Actions (self-hosted runner)

1. Go to **Settings > Actions > Runners > New** and follow the setup steps.
2. Add the following secrets/variables under **Settings > Secrets/Variables > Actions**:
   - Secret: `DISCORD_WEBHOOK`
   - Variables: `DATABASE_FILE`, `CONTAINER_DB_FOLDER`
3. Update cron paths to point to the project inside `actions_runner/_work/`.

> `DATABASE_FILE` must be a path inside `CONTAINER_DB_FOLDER`, e.g.:
>
> ```bash
> DATABASE_FILE=/app/data/mpk-scraper.db
> CONTAINER_DB_FOLDER=/app/data
> ```

## Disclaimer

> **Disclaimer:** This project is strictly educational and non-commercial. Data is sourced from [mpk.lodz.pl](https://www.mpk.lodz.pl). The author assumes no responsibility for how it is used.

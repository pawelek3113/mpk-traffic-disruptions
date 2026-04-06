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
cp .env.example .env
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

## Production

To build and run for production, use:

```bash
npm run prod
```

or for server:

```bash
npm run prod-server
```

## Running in a container using docker-compose

```bash
docker compose build
docker compose run --rm app npm run start
```

## Scheduling

### Create directory to logs

```bash
cd project
mkdir logs
```

### Schedule using cron

```bash
crontab -e
*/5 * * * * cd /full/directory/to/the/project/scraper && /usr/bin/docker compose run --rm app npm run start >> /full/directory/to/logs/cron.log 2>&1
```

## Testing

To run tests, use:

```bash
npm test
```

## Coverage

To generate a coverage report, use:

```bash
npm run test:coverage
```

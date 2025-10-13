# The Multiverse

A monorepo containing my personal websites.

## Projects

- **avalonstar.com**: Personal blog and historical archive ([avalonstar.com](https://avalonstar.com))
- **bryanvelo.so**: Personal site and portfolio ([bryanvelo.so](https://bryanvelo.so))
- **omnyist.com**: TBD ([omnyist.com](https://omnyist.com))

## Development

```bash
# Install dependencies
bun install

# Start development server for all apps
bun run dev

# Start development server for a specific app
bun run dev:avalonstar.com
bun run dev:bryanvelo.so
bun run dev:omnyist.com

# Build all apps
bun run build

# Build a specific app
bun run build:avalonstar.com
bun run build:bryanvelo.so
bun run build:omnyist.com
```

## Deployment

This monorepo is deployed using Docker on a self-hosted Mac Mini through Cloudflare Zero Trust.

### Docker Deployment

```bash
# Build and start containers in development mode
docker compose -f docker-compose.dev.yml up -d

# Build and start containers in production mode
docker compose -f docker-compose.yml up -d

# Rebuild containers after changes
docker compose -f docker-compose.yml up -d --build

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

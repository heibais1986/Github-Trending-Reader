# GitHub Trending API

A Cloudflare Worker that provides an API for GitHub trending repositories, designed to work with a HarmonyOS application.

## Features

- Daily automated scraping of GitHub trending repositories
- RESTful API endpoints for accessing trending data
- Cloudflare KV storage for data persistence
- CORS support for cross-origin requests

## API Endpoints

- `GET /api/trending` - Get today's trending repositories
- `GET /api/trending?date=YYYY-MM-DD` - Get trending repositories for a specific date

## Development

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create KV namespace:
```bash
wrangler kv:namespace create "TRENDING_KV"
wrangler kv:namespace create "TRENDING_KV" --preview
```

3. Update `wrangler.toml` with your KV namespace IDs

4. Set GitHub token secret:
```bash
wrangler secret put GITHUB_TOKEN
```

### Development Commands

- `npm run dev` - Start development server
- `npm run deploy` - Deploy to Cloudflare
- `npm run test` - Run tests
- `npm run type-check` - Type checking

## Deployment

1. Configure your KV namespace IDs in `wrangler.toml`
2. Set required secrets using `wrangler secret put`
3. Deploy using `npm run deploy`

## Environment Variables

- `GITHUB_TOKEN` - GitHub API token for accessing the API
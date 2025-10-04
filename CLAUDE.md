# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Cloudflare Worker API that scrapes and serves GitHub trending repositories data, designed to work with a HarmonyOS application. The system uses Cloudflare KV for data persistence and runs automated daily scraping via cron triggers.

## Development Commands

### Core Development
- `npm run dev` - Start local development server with Wrangler
- `npm run deploy` - Deploy to Cloudflare Workers (default environment)
- `npm run type-check` - Run TypeScript type checking

### Environment-Specific Deployment
- `npm run deploy:dev` - Deploy to development environment
- `npm run deploy:staging` - Deploy to staging environment
- `npm run deploy:production` - Deploy to production environment

### Testing
- `npm test` - Run all tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:integration` - Run integration and error scenario tests
- `npm run test:e2e` - Run end-to-end integration tests only
- `npm run test:errors` - Run error scenario tests only
- `npm run test:all` - Run all tests with verbose output

### Monitoring & Operations
- `npm run logs` - Tail production logs (default)
- `npm run logs:staging` - Tail staging environment logs
- `npm run logs:production` - Tail production environment logs
- `npm run secrets:list` - List configured Wrangler secrets
- `npm run kv:list` - List KV namespaces

### Setup Scripts
- `npm run setup` - Run deployment setup (Node.js version)
- `npm run setup:bash` - Run deployment setup (Bash version)
- `npm run deploy:script` - Deploy using custom script
- `npm run deploy:bash` - Deploy using Bash script

## Architecture Overview

### Core Worker Entry Point (src/index.ts)
The main worker exports two handlers:
- **fetch()** - Handles HTTP requests via the router with middleware pipeline
- **scheduled()** - Executes daily GitHub scraping triggered by cron (daily at 00:00 UTC)

### Request Flow Architecture

1. **Global Middleware Pipeline** (runs for all requests):
   - Logging middleware - Request logging with IP and user agent
   - Environment validation - Ensures TRENDING_KV and GITHUB_TOKEN are available
   - CORS middleware - Handles cross-origin requests
   - Timeout middleware - 30 second timeout tracking
   - Rate limiting - 120 requests per minute per IP

2. **Router** (src/router.ts):
   - Express-style routing with path parameter support
   - Route-specific middleware execution
   - CORS preflight handling
   - Wildcard route matching
   - Automatic security headers injection

3. **Route Handlers** (src/api-handlers.ts & src/health-handlers.ts):
   - API routes: `/api/trending`, `/api/trending/dates`, `/api/stats`
   - Health routes: `/health`, `/health/status`, `/health/metrics`, `/health/ready`, `/health/live`, `/health/info`
   - Each handler processes requests and returns JSON responses

### Data Flow Architecture

**Scheduled Scraping Task** (src/scheduled-task.ts):
1. Triggered daily by Cloudflare cron at 00:00 UTC
2. Uses `ScheduledTaskHandler` class with retry mechanism
3. Flow:
   - Fetch trending repos from GitHub API (via `GitHubApiClient`)
   - Transform data using `transformRepository()` from data-processor
   - Store in KV storage via `StorageManager`
   - Perform lifecycle management (cleanup old data)
   - Log execution results

**Retry & Circuit Breaker** (src/retry-mechanism.ts):
- `RetryMechanism` - Exponential backoff with jitter (max 3 retries)
- `CircuitBreaker` - Protects GitHub API calls (5 failure threshold, 5 min recovery)
- `TaskStateManager` - Tracks task execution state in KV storage
- Automatic retry for rate limits, network errors, service unavailable

**Storage Architecture** (src/storage-manager.ts):
- Key pattern: `trending:YYYY-MM-DD` for date-specific data
- Special key: `trending:latest` for most recent data
- Metadata tracking: `storage:metadata` contains data keys and stats
- Data lifecycle: 7-day retention, automatic cleanup of old entries
- KV namespace binding: `TRENDING_KV`

### Key Components

**GitHub Client** (src/github-client.ts):
- Searches GitHub trending repositories using GitHub API
- Handles authentication via `GITHUB_TOKEN` secret
- Implements date validation (YYYY-MM-DD format)
- Rate limit awareness with error handling

**Data Processor** (src/data-processor.ts):
- Transforms GitHub API response to internal `Repository` interface
- Normalizes data structure for consistent API responses
- Handles missing/optional fields gracefully

**Middleware System** (src/middleware.ts):
- Composable middleware with Request/Response transformation
- Validation: date format, query params, request size
- Rate limiting: Per-IP using KV with 60-second TTL
- Performance tracking via `PerformanceOptimizer`

**Health Monitoring** (src/health-monitor.ts & src/health-handlers.ts):
- Global health monitor tracks request metrics
- Response time percentiles (p50, p95, p99)
- Error rate tracking and uptime calculation
- System info: memory, cache hit rates

**Performance Optimization** (src/performance-optimizer.ts):
- In-memory caching with LRU eviction
- Request deduplication for concurrent identical requests
- Response compression support
- Performance metric tracking

**Error Handling** (src/error-reporter.ts):
- Centralized error classification and reporting
- Error aggregation and statistics
- Recent error tracking with metadata

## Configuration Files

**wrangler.toml**:
- KV namespace bindings for `TRENDING_KV`
- Cron trigger: `0 0 * * *` (daily at midnight UTC)
- Environment-specific configs: development, staging, production
- Environment variables: `API_VERSION`, `CORS_MAX_AGE`, `RATE_LIMIT_REQUESTS`

**vitest.config.ts**:
- Uses `miniflare` environment for Cloudflare Workers testing
- Provides KV namespace mocks and test bindings
- Sets `GITHUB_TOKEN` test binding

## API Response Structure

All responses follow consistent JSON format:
```typescript
// Success response
{
  date: string,
  repositories: Repository[],
  updatedAt: string,
  total: number
}

// Error response
{
  error: {
    code: string,
    message: string,
    details: string
  },
  timestamp: string
}
```

## Testing Architecture

Tests use Vitest with Miniflare environment:
- Unit tests per module (e.g., `github-client.test.ts`)
- Integration tests in `test/integration.test.ts`
- Error scenario testing in `test/error-scenarios.test.ts`
- Performance tests in `test/performance.test.ts`
- Storage lifecycle tests in `test/storage-lifecycle.test.ts`

## Environment Setup

Required secrets (set via `wrangler secret put`):
- `GITHUB_TOKEN` - GitHub API authentication token

Required KV namespaces:
```bash
wrangler kv:namespace create "TRENDING_KV"
wrangler kv:namespace create "TRENDING_KV" --preview
```

Update namespace IDs in `wrangler.toml` after creation.

## HarmonyOS App Integration

The `/harmonyos-app` directory contains the companion HarmonyOS application:
- Built with ArkTS (HarmonyOS TypeScript)
- Consumes the Cloudflare Worker API
- See `harmonyos-app/README.md` for app-specific documentation

## Common Patterns

**Adding New API Endpoints**:
1. Create handler function in `src/api-handlers.ts`
2. Register route in `src/index.ts` router with `router.get()` or `router.post()`
3. Add route-specific middleware array if needed
4. Return responses using `createJSONResponse()` or `createErrorResponse()`

**Adding Middleware**:
1. Create middleware function in `src/middleware.ts` following `Middleware` interface
2. Return modified `Request` or `Response` object
3. Add to global pipeline via `router.use()` or route-specific via route registration

**Storage Operations**:
1. Use `StorageManager` instance for all KV operations
2. Follow key naming convention: `prefix:identifier`
3. Include metadata with version and type information
4. Handle errors with try-catch and proper error messages

**Retry Logic**:
1. Use `withRetry()` helper or `RetryMechanism.executeWithRetry()`
2. Configure retry options: `maxRetries`, `baseDelay`, `retryCondition`
3. For GitHub API calls, use circuit breaker protection via `circuitBreaker.execute()`

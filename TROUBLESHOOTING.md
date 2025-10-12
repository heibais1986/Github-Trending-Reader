# GitHub Trending Worker - Troubleshooting Guide

## 🚨 Current Issue: "No trending repositories found"

Your Cloudflare Worker is failing with the error "No trending repositories found for the specified date". This is happening because the original implementation was using an incorrect approach to get trending repositories.

### ❌ What Was Wrong

The original code was searching for repositories **created** after a specific date:
```typescript
const query = `created:>${date} stars:>10`;
```

This doesn't work because:
1. GitHub trending repositories are not necessarily newly created
2. Trending is based on recent star activity, not creation date
3. GitHub's Search API doesn't have a direct "trending" filter

### ✅ What's Fixed

The updated implementation now:
1. **Scrapes GitHub's actual trending page** (`https://github.com/trending`)
2. **Falls back to recent activity search** if scraping fails
3. **Uses multiple parsing patterns** to handle HTML structure changes
4. **Includes debug endpoints** for testing

## 🔧 Testing the Fix

### 1. Test Locally First

Run the scraping test script:
```bash
node scripts/test-scraping.js
```

This will:
- Fetch the GitHub trending page
- Save the HTML for inspection
- Show you what repositories are found
- Help debug parsing issues

### 2. Deploy and Test

Use the deployment script:
```powershell
./scripts/deploy-and-test.ps1
```

Or manually:
```bash
# Deploy
npx wrangler deploy

# Test debug endpoint
curl https://your-worker.workers.dev/api/debug/scraping

# Test manual trigger
curl -X POST https://your-worker.workers.dev/api/trigger-scraping
```

### 3. Check Execution Logs

Monitor your worker in the Cloudflare dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Check the "Logs" tab
4. Look for scraping success/failure messages

## 🐛 Common Issues and Solutions

### Issue 1: HTML Parsing Fails

**Symptoms:**
- "No repositories found" in debug output
- Empty trending data

**Solutions:**
1. Check if GitHub changed their HTML structure
2. Run the test script to inspect the HTML
3. Update parsing patterns in `github-client.ts`

**Debug Steps:**
```bash
# Run local test
node scripts/test-scraping.js

# Check the saved HTML file
# Look for repository containers in trending-page.html
```

### Issue 2: Rate Limiting

**Symptoms:**
- HTTP 403 errors
- "Rate limit exceeded" messages

**Solutions:**
1. Ensure your GitHub token is set correctly
2. Check token permissions (public repo access needed)
3. Reduce scraping frequency if needed

**Debug Steps:**
```bash
# Check if token is set
npx wrangler secret list

# Set token if missing
npx wrangler secret put GITHUB_TOKEN
```

### Issue 3: KV Storage Issues

**Symptoms:**
- Data not persisting
- Storage errors in logs

**Solutions:**
1. Verify KV namespace binding in `wrangler.toml`
2. Check KV namespace exists in Cloudflare dashboard
3. Ensure proper permissions

**Debug Steps:**
```bash
# List KV namespaces
npx wrangler kv:namespace list

# Check KV binding
npx wrangler kv:key list --binding TRENDING_KV
```

### Issue 4: Scheduled Task Not Running

**Symptoms:**
- No automatic data updates
- Empty execution logs

**Solutions:**
1. Check cron trigger configuration
2. Verify worker is deployed
3. Monitor scheduled events in dashboard

**Debug Steps:**
```bash
# Test manual trigger
curl -X POST https://your-worker.workers.dev/api/trigger-scraping

# Check stats
curl https://your-worker.workers.dev/api/stats
```

## 🔍 Debugging Endpoints

### GET /api/debug/scraping
Tests the scraping functionality without storing data:
```bash
curl https://your-worker.workers.dev/api/debug/scraping
```

Expected response:
```json
{
  "message": "Debug scraping test completed",
  "targetDate": "2025-10-05",
  "repositoriesFound": 25,
  "sampleRepositories": [
    {
      "full_name": "microsoft/vscode",
      "description": "Visual Studio Code",
      "stars": 162000,
      "language": "TypeScript"
    }
  ]
}
```

### POST /api/trigger-scraping
Manually triggers the full scraping and storage process:
```bash
curl -X POST https://your-worker.workers.dev/api/trigger-scraping
```

### GET /api/stats
Shows execution statistics and storage info:
```bash
curl https://your-worker.workers.dev/api/stats
```

## 📊 Monitoring and Maintenance

### 1. Regular Health Checks

Set up monitoring for these endpoints:
- `GET /health` - Overall system health
- `GET /api/stats` - Execution statistics
- `GET /api/trending` - Data availability

### 2. Log Analysis

Key log messages to watch for:
- ✅ `"Successfully parsed X repositories using pattern Y"`
- ❌ `"No repositories found with standard patterns"`
- ⚠️ `"Trending page scraping failed, falling back to search API"`

### 3. Data Quality Checks

Verify data quality by checking:
- Repository count (should be 20-50 per day)
- Data freshness (updated daily)
- Repository diversity (different languages/topics)

## 🚀 Performance Optimization

### 1. Caching Strategy

The worker implements several caching layers:
- KV storage for trending data (24h TTL)
- Circuit breaker for API failures
- Retry mechanism with exponential backoff

### 2. Error Handling

Robust error handling includes:
- Multiple parsing patterns for HTML changes
- Fallback to Search API if scraping fails
- Graceful degradation for partial failures

### 3. Resource Management

- Execution timeout: 30 seconds
- Memory optimization for large HTML parsing
- Cleanup of old data (7-day retention)

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the logs** in Cloudflare dashboard
2. **Run debug endpoints** to isolate the problem
3. **Test locally** with the provided scripts
4. **Verify configuration** (tokens, KV bindings, etc.)

### Common Configuration Checklist

- [ ] GitHub token is set and valid
- [ ] KV namespace is created and bound
- [ ] Cron trigger is configured
- [ ] Worker is deployed to correct environment
- [ ] All required secrets are set

### Environment Variables to Check

```bash
# List all secrets
npx wrangler secret list

# Required secrets:
# - GITHUB_TOKEN (GitHub personal access token)

# Check wrangler.toml configuration:
# - KV namespace binding
# - Cron trigger schedule
# - Environment variables
```

## 🔄 Recovery Procedures

### If Scraping Completely Fails

1. **Check GitHub's trending page manually** - visit https://github.com/trending
2. **Test with debug endpoint** - `GET /api/debug/scraping`
3. **Update parsing patterns** if GitHub changed their HTML
4. **Use fallback search API** temporarily

### If Data is Stale

1. **Trigger manual scraping** - `POST /api/trigger-scraping`
2. **Check scheduled task logs** in dashboard
3. **Verify cron trigger is active**
4. **Clear old data** if needed

### Emergency Fallback

If all else fails, you can temporarily use the Search API fallback:
1. The worker automatically falls back to searching recent repositories
2. This provides basic functionality while you fix the main scraping
3. Data quality may be lower but service remains available

---

**Last Updated:** October 2025  
**Version:** 2.0.0 (Fixed Scraping Implementation)
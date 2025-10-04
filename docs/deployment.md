# Deployment Guide

This guide covers how to deploy the GitHub Trending API to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account with Workers enabled
2. **Wrangler CLI**: Install globally with `npm install -g wrangler`
3. **GitHub Token**: Personal Access Token with `public_repo` scope
4. **Node.js**: Version 18 or higher

## Quick Setup

Run the automated setup script:

```bash
# Make the script executable
chmod +x scripts/setup-deployment.sh

# Run the setup
./scripts/setup-deployment.sh
```

This script will:
- Install Wrangler CLI if needed
- Authenticate with Cloudflare
- Create KV namespaces
- Update configuration files
- Set up secrets

## Manual Setup

### 1. Authentication

Login to Cloudflare:
```bash
wrangler login
```

### 2. Create KV Namespaces

Create the required KV namespaces:

```bash
# Production namespace
wrangler kv:namespace create "TRENDING_KV" --env production

# Staging namespace
wrangler kv:namespace create "TRENDING_KV" --env staging

# Preview namespace
wrangler kv:namespace create "TRENDING_KV" --preview
```

Update `wrangler.toml` with the returned namespace IDs.

### 3. Set Secrets

Set the GitHub token for each environment:

```bash
# Production
wrangler secret put GITHUB_TOKEN --env production

# Staging
wrangler secret put GITHUB_TOKEN --env staging

# Development
wrangler secret put GITHUB_TOKEN --env development
```

## Deployment

### Automated Deployment (Recommended)

Use the deployment script for a complete deployment process:

```bash
# Deploy to staging
./scripts/deploy.sh --env staging

# Deploy to production
./scripts/deploy.sh --env production

# Skip tests (for faster deployment)
./scripts/deploy.sh --env production --skip-tests
```

On Windows:
```powershell
# Deploy to staging
.\scripts\deploy.ps1 -Environment staging

# Deploy to production
.\scripts\deploy.ps1 -Environment production

# Skip tests
.\scripts\deploy.ps1 -Environment production -SkipTests
```

### Manual Deployment

Deploy directly with Wrangler:

```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
```

### Deployment Verification

After deployment, verify everything is working:

```bash
# Verify deployment
./scripts/verify-deployment.sh --env production

# Verify with custom domain
./scripts/verify-deployment.sh --env production --domain api.yourdomain.com
```

On Windows:
```powershell
# Verify deployment
.\scripts\verify-deployment.ps1 -Environment production

# Verify with custom domain
.\scripts\verify-deployment.ps1 -Environment production -CustomDomain api.yourdomain.com
```

## CI/CD with GitHub Actions

The repository includes GitHub Actions workflows for automated deployment.

### Required GitHub Secrets

Set these secrets in your GitHub repository settings:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `GITHUB_TOKEN_SECRET`: Your GitHub Personal Access Token

### Workflow Triggers

- **Staging**: Automatically deploys when pushing to `develop` branch
- **Production**: Automatically deploys when pushing to `main` branch
- **Manual**: Use GitHub Actions UI to deploy to any environment

## Environment Configuration

### Production Environment

- **Name**: `github-trending-api-prod`
- **Cron**: Daily at UTC 00:00
- **Log Level**: `info`
- **Rate Limiting**: Enabled

### Staging Environment

- **Name**: `github-trending-api-staging`
- **Cron**: Disabled (manual testing)
- **Log Level**: `debug`
- **Rate Limiting**: Relaxed

### Development Environment

- **Name**: `github-trending-api-dev`
- **Cron**: Disabled
- **Log Level**: `debug`
- **Rate Limiting**: Disabled

## Monitoring and Logs

### View Real-time Logs

```bash
# Production logs
wrangler tail --env production

# Staging logs
wrangler tail --env staging

# Filter by log level
wrangler tail --env production --format pretty
```

### Check Deployment Status

```bash
# List deployments
wrangler deployments list --env production

# Get deployment details
wrangler deployment view <deployment-id> --env production
```

## Custom Domain Setup

### Automated Setup (Recommended)

Use the custom domain setup script:

```bash
# Set up custom domain for production
./scripts/setup-custom-domain.sh --domain api.yourdomain.com --env production

# Set up custom domain for staging
./scripts/setup-custom-domain.sh --domain staging-api.yourdomain.com --env staging
```

On Windows:
```powershell
# Set up custom domain for production
.\scripts\setup-custom-domain.ps1 -Domain api.yourdomain.com -Environment production

# Set up custom domain for staging
.\scripts\setup-custom-domain.ps1 -Domain staging-api.yourdomain.com -Environment staging
```

### Manual Setup

1. **Add Custom Domain Route**
```bash
# Add your domain
wrangler route add "api.yourdomain.com/*" --env production
```

2. **Update DNS**
Add a CNAME record pointing to your Worker:
```
Type: CNAME
Name: api
Target: your-worker-name.workers.dev
Proxy: Enabled (Orange Cloud)
```

3. **SSL Certificate**
Cloudflare automatically provisions SSL certificates for custom domains.

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   ```bash
   wrangler login
   ```

2. **KV Namespace Not Found**
   - Check namespace IDs in `wrangler.toml`
   - Recreate namespaces if needed

3. **Secret Not Set**
   ```bash
   wrangler secret put GITHUB_TOKEN --env production
   ```

4. **Deployment Timeout**
   - Check Worker size limits
   - Optimize bundle size

### Debug Commands

```bash
# Check configuration
wrangler whoami

# List KV namespaces
wrangler kv:namespace list

# List secrets
wrangler secret list --env production

# Test locally
wrangler dev --env development
```

## Performance Optimization

### Bundle Size

- Keep dependencies minimal
- Use tree-shaking
- Avoid large libraries

### Cold Start Optimization

- Minimize initialization code
- Use lazy loading
- Cache frequently used data

### Rate Limiting

Configure appropriate rate limits in `wrangler.toml`:

```toml
[vars]
RATE_LIMIT_REQUESTS = "100"
RATE_LIMIT_WINDOW = "60"
```

## Security Best Practices

1. **Secrets Management**
   - Never commit secrets to version control
   - Use Wrangler secrets for sensitive data
   - Rotate tokens regularly

2. **CORS Configuration**
   - Restrict origins in production
   - Use appropriate headers
   - Validate all inputs

3. **Rate Limiting**
   - Implement per-IP limits
   - Monitor for abuse
   - Use Cloudflare's built-in protection

## Rollback Procedure

If a deployment fails:

1. **Check logs**:
   ```bash
   wrangler tail --env production
   ```

2. **Rollback to previous version**:
   ```bash
   wrangler rollback --env production
   ```

3. **Deploy previous commit**:
   ```bash
   git checkout <previous-commit>
   ./scripts/deploy.sh --env production
   ```

## Production Deployment Process

For production deployments, follow the comprehensive checklist:

1. **Review the checklist**: See `docs/production-deployment-checklist.md`
2. **Deploy to staging first**: Always test in staging before production
3. **Run verification scripts**: Use the provided verification tools
4. **Monitor after deployment**: Check logs and metrics

### Quick Production Deployment

```bash
# 1. Deploy to staging and verify
./scripts/deploy.sh --env staging
./scripts/verify-deployment.sh --env staging

# 2. Deploy to production
./scripts/deploy.sh --env production

# 3. Verify production deployment
./scripts/verify-deployment.sh --env production

# 4. Set up custom domain (optional)
./scripts/setup-custom-domain.sh --domain api.yourdomain.com --env production
```

## Support

For deployment issues:
1. Check the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
2. Review Wrangler CLI logs
3. Check GitHub Actions workflow logs
4. Verify all secrets and configuration
5. Use the verification scripts to diagnose issues
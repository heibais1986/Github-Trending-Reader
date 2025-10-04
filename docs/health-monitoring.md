# Health Monitoring and Observability

This document describes the health monitoring and observability features of the GitHub Trending API.

## Overview

The health monitoring system provides comprehensive insights into the API's operational status, performance metrics, and system health. It includes multiple endpoints for different monitoring needs and integrates with standard monitoring tools.

## Health Check Endpoints

### Basic Health Check
**Endpoint**: `GET /health`

Simple health check for load balancers and basic monitoring.

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600000
}
```

### Comprehensive Health Status
**Endpoint**: `GET /health/status`

Detailed health information including all system checks.

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600000,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "kv_storage": {
      "status": "pass",
      "message": "KV storage is accessible",
      "duration": 45,
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    "github_api": {
      "status": "pass",
      "message": "GitHub API accessible, 1000 requests remaining",
      "duration": 120,
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    "system_resources": {
      "status": "pass",
      "message": "System resources normal",
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    "data_freshness": {
      "status": "pass",
      "message": "Data is fresh (2.5 hours old)",
      "duration": 15,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  },
  "metrics": {
    "requestCount": 1500,
    "errorCount": 12,
    "averageResponseTime": 145.5,
    "lastRequestTime": "2024-01-01T00:00:00.000Z"
  }
}
```

### Performance Metrics
**Endpoint**: `GET /health/metrics`

Performance and usage statistics.

```json
{
  "metrics": {
    "requestCount": 1500,
    "errorCount": 12,
    "averageResponseTime": 145.5,
    "lastRequestTime": "2024-01-01T00:00:00.000Z",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production",
    "version": "1.0.0"
  }
}
```

### Readiness Probe
**Endpoint**: `GET /health/ready`

Kubernetes-style readiness probe for deployment orchestration.

```json
{
  "ready": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "checks": [
    {
      "name": "kv_storage",
      "status": "ready"
    },
    {
      "name": "github_token",
      "status": "ready"
    }
  ]
}
```

### Liveness Probe
**Endpoint**: `GET /health/live`

Kubernetes-style liveness probe for container health.

```json
{
  "alive": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600000
}
```

### System Information
**Endpoint**: `GET /health/info`

System and service information.

```json
{
  "service": "github-trending-api",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600000,
  "runtime": "Cloudflare Workers",
  "features": {
    "github_api": true,
    "kv_storage": true,
    "scheduled_tasks": true,
    "cors_enabled": true,
    "rate_limiting": true
  },
  "endpoints": {
    "health": "/health",
    "status": "/health/status",
    "metrics": "/health/metrics",
    "readiness": "/health/ready",
    "liveness": "/health/live",
    "api": "/api/trending"
  }
}
```

## Health Status Levels

### Healthy
All systems are operating normally. All checks pass.

### Degraded
Some systems show warnings but service is still operational. Some checks return "warn" status.

### Unhealthy
Critical systems are failing. Service may be unavailable. Some checks return "fail" status.

## Individual Health Checks

### KV Storage Check
- **Purpose**: Verifies Cloudflare KV storage connectivity
- **Method**: Attempts to read from KV namespace
- **Pass**: KV is accessible
- **Fail**: KV connection error or timeout

### GitHub API Check
- **Purpose**: Verifies GitHub API connectivity and rate limits
- **Method**: Calls GitHub rate limit endpoint
- **Pass**: API accessible with >100 requests remaining
- **Warn**: API accessible with 10-100 requests remaining
- **Fail**: API unreachable or authentication failed

### System Resources Check
- **Purpose**: Monitors error rates and system performance
- **Method**: Analyzes request/error statistics
- **Pass**: Error rate <5%
- **Warn**: Error rate 5-10%
- **Fail**: Error rate >10%

### Data Freshness Check
- **Purpose**: Ensures trending data is current
- **Method**: Checks timestamp of latest data
- **Pass**: Data <25 hours old
- **Warn**: Data 25-48 hours old or no data available
- **Fail**: Data >48 hours old

## Monitoring Integration

### Prometheus Metrics
The `/health/metrics` endpoint can be scraped by Prometheus for monitoring:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'github-trending-api'
    static_configs:
      - targets: ['your-domain.com']
    metrics_path: '/health/metrics'
    scrape_interval: 30s
```

### Kubernetes Health Checks
Configure Kubernetes probes:

```yaml
# deployment.yaml
spec:
  containers:
  - name: github-trending-api
    livenessProbe:
      httpGet:
        path: /health/live
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

### Load Balancer Health Checks
Configure your load balancer to use the basic health endpoint:

```
Health Check URL: /health
Expected Status: 200
Timeout: 5 seconds
Interval: 30 seconds
```

## Alerting Rules

### Critical Alerts
- Service is unhealthy (`/health/status` returns 503)
- KV storage is unavailable
- GitHub API is unreachable
- Error rate >10%

### Warning Alerts
- Service is degraded (`/health/status` returns degraded)
- GitHub API rate limit low (<100 requests)
- Data is aging (>25 hours old)
- Error rate 5-10%

### Example Alert Configuration (Prometheus)
```yaml
groups:
- name: github-trending-api
  rules:
  - alert: ServiceUnhealthy
    expr: github_trending_api_health_status != 1
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "GitHub Trending API is unhealthy"
      
  - alert: HighErrorRate
    expr: github_trending_api_error_rate > 0.1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate detected"
```

## Performance Monitoring

### Key Metrics
- **Request Count**: Total number of requests processed
- **Error Count**: Number of failed requests
- **Average Response Time**: Mean response time in milliseconds
- **Error Rate**: Percentage of failed requests
- **Uptime**: Service uptime in milliseconds

### Performance Thresholds
- **Response Time**: Target <500ms, Alert >1000ms
- **Error Rate**: Target <1%, Alert >5%
- **Availability**: Target >99.9%

## Logging and Error Reporting

### Structured Logging
All health checks and metrics are logged in structured JSON format:

```json
{
  "level": "INFO",
  "message": "Health check completed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "context": {
    "status": "healthy",
    "duration": 150,
    "checks_passed": 4,
    "checks_failed": 0
  }
}
```

### Error Reporting
Errors are automatically reported with context:

```json
{
  "level": "ERROR",
  "message": "KV storage check failed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "context": {
    "check": "kv_storage",
    "operation": "get",
    "key": "trending:latest"
  },
  "error": {
    "name": "Error",
    "message": "Connection timeout",
    "stack": "..."
  }
}
```

## Troubleshooting

### Common Issues

1. **KV Storage Unavailable**
   - Check Cloudflare dashboard for KV namespace status
   - Verify namespace bindings in wrangler.toml
   - Check Worker permissions

2. **GitHub API Errors**
   - Verify GitHub token is set correctly
   - Check token permissions and rate limits
   - Monitor GitHub API status

3. **High Error Rates**
   - Check application logs for error patterns
   - Monitor resource usage and performance
   - Verify external dependencies

4. **Stale Data**
   - Check scheduled task execution
   - Verify cron trigger configuration
   - Monitor data fetching process

### Debug Commands

```bash
# Check health status
curl https://your-domain.com/health/status

# View metrics
curl https://your-domain.com/health/metrics

# Check readiness
curl https://your-domain.com/health/ready

# View logs
wrangler tail --env production

# Check KV data
wrangler kv:key get "trending:latest" --binding TRENDING_KV
```

## Best Practices

1. **Monitor Continuously**: Set up automated monitoring and alerting
2. **Set Appropriate Thresholds**: Configure alerts based on your SLA requirements
3. **Regular Health Checks**: Include health endpoints in your deployment pipeline
4. **Log Analysis**: Regularly review logs for patterns and issues
5. **Performance Baselines**: Establish performance baselines and monitor trends
6. **Incident Response**: Have procedures for responding to health check failures
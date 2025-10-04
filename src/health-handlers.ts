/**
 * Health Check API Handlers
 * Provides health check endpoints for monitoring and status reporting
 */

import { createJSONResponse, createErrorResponse } from './router';
import { healthMonitor } from './health-monitor';

/**
 * Basic health check endpoint
 * Returns simple status for load balancers and basic monitoring
 */
export async function handleHealthCheck(
  request: Request,
  env: any,
  ctx: ExecutionContext
): Promise<Response> {
  try {
    const health = healthMonitor.getBasicHealth();
    
    return createJSONResponse({
      status: 'ok',
      ...health
    }, 200);
  } catch (error) {
    console.error('Health check error:', error);
    return createErrorResponse(
      503,
      'HEALTH_CHECK_FAILED',
      'Health check failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Detailed health status endpoint
 * Returns comprehensive health information including all checks
 */
export async function handleHealthStatus(
  request: Request,
  env: any,
  ctx: ExecutionContext
): Promise<Response> {
  try {
    const healthStatus = await healthMonitor.getHealthStatus(env);
    
    // Return appropriate HTTP status based on health
    let httpStatus = 200;
    if (healthStatus.status === 'degraded') {
      httpStatus = 200; // Still operational but with warnings
    } else if (healthStatus.status === 'unhealthy') {
      httpStatus = 503; // Service unavailable
    }
    
    return createJSONResponse(healthStatus, httpStatus);
  } catch (error) {
    console.error('Health status error:', error);
    return createErrorResponse(
      503,
      'HEALTH_STATUS_FAILED',
      'Health status check failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Performance metrics endpoint
 * Returns performance and usage metrics
 */
export async function handleMetrics(
  request: Request,
  env: any,
  ctx: ExecutionContext
): Promise<Response> {
  try {
    const metrics = healthMonitor.getMetrics();
    
    // Add additional system metrics
    const extendedMetrics = {
      ...metrics,
      timestamp: new Date().toISOString(),
      environment: env.ENVIRONMENT || 'development',
      version: '1.0.0'
    };
    
    return createJSONResponse({
      metrics: extendedMetrics
    }, 200);
  } catch (error) {
    console.error('Metrics error:', error);
    return createErrorResponse(
      500,
      'METRICS_FAILED',
      'Failed to retrieve metrics',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Readiness probe endpoint
 * Checks if the service is ready to handle requests
 */
export async function handleReadiness(
  request: Request,
  env: any,
  ctx: ExecutionContext
): Promise<Response> {
  try {
    // Check critical dependencies
    const checks = [];
    
    // Check KV storage
    try {
      await env.TRENDING_KV.get('trending:latest');
      checks.push({ name: 'kv_storage', status: 'ready' });
    } catch (error) {
      checks.push({ 
        name: 'kv_storage', 
        status: 'not_ready',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Check if we have GitHub token
    const hasGitHubToken = !!env.GITHUB_TOKEN;
    checks.push({ 
      name: 'github_token', 
      status: hasGitHubToken ? 'ready' : 'not_ready',
      error: hasGitHubToken ? undefined : 'GitHub token not configured'
    });
    
    const allReady = checks.every(check => check.status === 'ready');
    
    return createJSONResponse({
      ready: allReady,
      timestamp: new Date().toISOString(),
      checks
    }, allReady ? 200 : 503);
    
  } catch (error) {
    console.error('Readiness check error:', error);
    return createErrorResponse(
      503,
      'READINESS_CHECK_FAILED',
      'Readiness check failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Liveness probe endpoint
 * Checks if the service is alive and responding
 */
export async function handleLiveness(
  request: Request,
  env: any,
  ctx: ExecutionContext
): Promise<Response> {
  try {
    // Simple liveness check - if we can respond, we're alive
    return createJSONResponse({
      alive: true,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - (globalThis as any).startTime || 0
    }, 200);
  } catch (error) {
    console.error('Liveness check error:', error);
    return createErrorResponse(
      503,
      'LIVENESS_CHECK_FAILED',
      'Liveness check failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * System information endpoint
 * Returns system and environment information
 */
export async function handleSystemInfo(
  request: Request,
  env: any,
  ctx: ExecutionContext
): Promise<Response> {
  try {
    const systemInfo = {
      service: 'github-trending-api',
      version: '1.0.0',
      environment: env.ENVIRONMENT || 'development',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - (globalThis as any).startTime || 0,
      runtime: 'Cloudflare Workers',
      features: {
        github_api: !!env.GITHUB_TOKEN,
        kv_storage: !!env.TRENDING_KV,
        scheduled_tasks: true,
        cors_enabled: true,
        rate_limiting: true
      },
      endpoints: {
        health: '/health',
        status: '/health/status',
        metrics: '/health/metrics',
        readiness: '/health/ready',
        liveness: '/health/live',
        api: '/api/trending'
      }
    };
    
    return createJSONResponse(systemInfo, 200);
  } catch (error) {
    console.error('System info error:', error);
    return createErrorResponse(
      500,
      'SYSTEM_INFO_FAILED',
      'Failed to retrieve system information',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
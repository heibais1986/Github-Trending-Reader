/**
 * GitHub Trending API - Cloudflare Worker
 * Main entry point for the worker
 */

import { Router } from './router';
import { 
  getTrendingHandler, 
  getAvailableDatesHandler, 
  healthCheckHandler, 
  getStatsHandler,
  notFoundHandler 
} from './api-handlers';
import {
  handleHealthCheck,
  handleHealthStatus,
  handleMetrics,
  handleReadiness,
  handleLiveness,
  handleSystemInfo
} from './health-handlers';
import {
  corsMiddleware,
  validationMiddleware,
  rateLimitMiddleware,
  loggingMiddleware,
  environmentValidationMiddleware,
  contentTypeMiddleware,
  timeoutMiddleware,
} from './middleware';
import { healthMonitor } from './health-monitor';

export interface Env {
  TRENDING_KV: KVNamespace;
  GITHUB_TOKEN: string;
}

// Initialize router and define routes
const router = new Router();

// Set global start time for uptime calculation
(globalThis as any).startTime = Date.now();

// Global middleware (runs for all routes)
router.use(loggingMiddleware());
router.use(environmentValidationMiddleware());
router.use(corsMiddleware());
router.use(timeoutMiddleware(30000)); // 30 second timeout
router.use(rateLimitMiddleware(120)); // 120 requests per minute

// Health check routes (no rate limiting for monitoring)
router.get('/health', handleHealthCheck);
router.get('/health/status', handleHealthStatus);
router.get('/health/metrics', handleMetrics);
router.get('/health/ready', handleReadiness);
router.get('/health/live', handleLiveness);
router.get('/health/info', handleSystemInfo);

// API Routes with specific middleware
router.get('/api/trending', getTrendingHandler, [validationMiddleware()]);
router.get('/api/trending/dates', getAvailableDatesHandler);
router.get('/api/health', healthCheckHandler); // Legacy health endpoint
router.get('/api/stats', getStatsHandler);

// Catch-all route for undefined endpoints
router.get('*', notFoundHandler);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startTime = Date.now();
    let response: Response;
    let isError = false;

    try {
      response = await router.handle(request, env, ctx);
      isError = response.status >= 400;
    } catch (error) {
      console.error('Request handling error:', error);
      isError = true;
      response = new Response('Internal Server Error', { status: 500 });
    }

    // Record metrics
    const responseTime = Date.now() - startTime;
    healthMonitor.recordRequest(responseTime, isError);

    // Log performance metrics periodically
    if (Math.random() < 0.01) { // 1% of requests
      healthMonitor.logMetrics();
    }

    return response;
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const { executeScheduledTask } = await import('./scheduled-task');
    
    try {
      console.log('Scheduled task triggered at:', new Date(event.scheduledTime).toISOString());
      
      const result = await executeScheduledTask(event.scheduledTime, env, ctx);
      
      if (result.success) {
        console.log(`Scheduled task completed successfully: ${result.repositoriesProcessed} repositories processed in ${result.executionTime}ms`);
      } else {
        console.error(`Scheduled task failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Scheduled task execution failed:', error);
      // In production, you might want to send alerts or notifications here
    }
  },
};
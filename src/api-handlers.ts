/**
 * API Route Handlers
 * Implements the trending repositories API endpoints
 */

import { StorageManager } from './storage-manager';
import { createJSONResponse, createErrorResponse } from './router';
import { isValidDateFormat } from './github-client';

export interface Env {
  TRENDING_KV: KVNamespace;
  GITHUB_TOKEN: string;
}

/**
 * GET /api/trending
 * Returns current day's trending repositories
 */
export async function getTrendingHandler(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params?: Record<string, string>
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');
    
    const storageManager = new StorageManager(env.TRENDING_KV);
    
    // If date parameter is provided, validate it
    if (dateParam) {
      if (!isValidDateFormat(dateParam)) {
        return createErrorResponse(
          400,
          'VALIDATION_ERROR',
          'Invalid date format. Use YYYY-MM-DD format.',
          `Provided date: ${dateParam}`
        );
      }
      
      // Check if date is not in the future
      const requestedDate = new Date(dateParam);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (requestedDate > today) {
        return createErrorResponse(
          400,
          'VALIDATION_ERROR',
          'Cannot request data for future dates',
          `Requested date: ${dateParam}`
        );
      }
    }
    
    // Retrieve trending data
    const trendingData = await storageManager.getTrendingData(dateParam || undefined);
    
    if (!trendingData) {
      const errorMessage = dateParam 
        ? `No trending data available for date: ${dateParam}`
        : 'No trending data available';
        
      return createErrorResponse(
        404,
        'NOT_FOUND',
        errorMessage,
        dateParam ? `Date: ${dateParam}` : 'Try again later or check available dates'
      );
    }
    
    // Return successful response
    return createJSONResponse(trendingData);
    
  } catch (error) {
    console.error('Error in getTrendingHandler:', error);
    
    return createErrorResponse(
      500,
      'INTERNAL_ERROR',
      'Failed to retrieve trending data',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * GET /api/trending/dates
 * Returns available dates with trending data
 */
export async function getAvailableDatesHandler(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params?: Record<string, string>
): Promise<Response> {
  try {
    const storageManager = new StorageManager(env.TRENDING_KV);
    const availableDates = await storageManager.getAvailableDates();
    
    const response = {
      dates: availableDates,
      total: availableDates.length,
      oldest: availableDates.length > 0 ? availableDates[availableDates.length - 1] : null,
      newest: availableDates.length > 0 ? availableDates[0] : null,
    };
    
    return createJSONResponse(response);
    
  } catch (error) {
    console.error('Error in getAvailableDatesHandler:', error);
    
    return createErrorResponse(
      500,
      'INTERNAL_ERROR',
      'Failed to retrieve available dates',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * GET /api/health
 * Health check endpoint
 */
export async function healthCheckHandler(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params?: Record<string, string>
): Promise<Response> {
  try {
    const storageManager = new StorageManager(env.TRENDING_KV);
    
    // Basic health checks
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: '1.0.0',
      storage: {
        accessible: false,
        stats: null as any,
      },
      environment: {
        hasGitHubToken: !!env.GITHUB_TOKEN,
        hasKVNamespace: !!env.TRENDING_KV,
      },
    };
    
    // Test KV storage access
    try {
      const stats = await storageManager.getStorageStats();
      checks.storage.accessible = true;
      checks.storage.stats = stats;
    } catch (error) {
      checks.status = 'degraded';
      checks.storage.accessible = false;
    }
    
    // Determine overall status
    const isHealthy = checks.storage.accessible && 
                     checks.environment.hasGitHubToken && 
                     checks.environment.hasKVNamespace;
    
    if (!isHealthy) {
      checks.status = 'unhealthy';
    }
    
    const statusCode = checks.status === 'healthy' ? 200 : 
                      checks.status === 'degraded' ? 200 : 503;
    
    return createJSONResponse(checks, statusCode);
    
  } catch (error) {
    console.error('Error in healthCheckHandler:', error);
    
    const errorResponse = {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    return createJSONResponse(errorResponse, 503);
  }
}

/**
 * GET /api/stats
 * Returns API and storage statistics
 */
export async function getStatsHandler(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params?: Record<string, string>
): Promise<Response> {
  try {
    const storageManager = new StorageManager(env.TRENDING_KV);
    
    // Try to get task execution stats if available
    let taskStats = null;
    try {
      const { ScheduledTaskHandler } = await import('./scheduled-task');
      const taskHandler = new ScheduledTaskHandler(env.GITHUB_TOKEN, env.TRENDING_KV);
      taskStats = await taskHandler.getTaskStats();
    } catch (error) {
      console.warn('Could not retrieve task stats:', error);
    }
    
    const [storageStats, availableDates] = await Promise.all([
      storageManager.getStorageStats(),
      storageManager.getAvailableDates(),
    ]);
    
    const stats = {
      timestamp: new Date().toISOString(),
      storage: storageStats,
      data: {
        availableDates: availableDates.length,
        dateRange: {
          oldest: storageStats.oldestDate,
          newest: storageStats.newestDate,
        },
      },
      tasks: taskStats,
      system: {
        version: '1.0.0',
        environment: process.env.ENVIRONMENT || 'production',
      },
    };
    
    return createJSONResponse(stats);
    
  } catch (error) {
    console.error('Error in getStatsHandler:', error);
    
    return createErrorResponse(
      500,
      'INTERNAL_ERROR',
      'Failed to retrieve statistics',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * POST /api/trigger-scraping
 * Manually trigger the scraping task (for testing)
 */
export async function triggerScrapingHandler(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params?: Record<string, string>
): Promise<Response> {
  try {
    console.log('Manual scraping trigger requested');
    
    const { executeScheduledTask } = await import('./scheduled-task');
    
    // Execute the scraping task
    const result = await executeScheduledTask(Date.now(), env, ctx);
    
    if (result.success) {
      return createJSONResponse({
        message: 'Scraping task completed successfully',
        result: result,
        timestamp: new Date().toISOString(),
      });
    } else {
      return createErrorResponse(
        500,
        'SCRAPING_FAILED',
        'Manual scraping task failed',
        result.error || 'Unknown error'
      );
    }
    
  } catch (error) {
    console.error('Error in triggerScrapingHandler:', error);
    
    return createErrorResponse(
      500,
      'INTERNAL_ERROR',
      'Failed to execute manual scraping',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * GET /api/debug/scraping
 * Debug endpoint to test scraping without storing data
 */
export async function debugScrapingHandler(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params?: Record<string, string>
): Promise<Response> {
  try {
    console.log('Debug scraping test requested');
    
    const { GitHubApiClient, getYesterdayDate } = await import('./github-client');
    
    const githubClient = new GitHubApiClient(env.GITHUB_TOKEN);
    const targetDate = getYesterdayDate();
    
    console.log(`Testing scraping for date: ${targetDate}`);
    
    // Test the scraping without storing data
    const result = await githubClient.searchTrendingRepositories(targetDate, 10);
    
    return createJSONResponse({
      message: 'Debug scraping test completed',
      targetDate: targetDate,
      repositoriesFound: result.items.length,
      sampleRepositories: result.items.slice(0, 3).map(repo => ({
        full_name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
      })),
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error in debugScrapingHandler:', error);
    
    return createErrorResponse(
      500,
      'DEBUG_ERROR',
      'Debug scraping test failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Catch-all handler for undefined routes
 */
export async function notFoundHandler(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  params?: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  
  return createErrorResponse(
    404,
    'NOT_FOUND',
    'API endpoint not found',
    `${request.method} ${url.pathname}`
  );
}
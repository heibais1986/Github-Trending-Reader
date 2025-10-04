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
      system: {
        version: '1.0.0',
        environment: 'production',
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
/**
 * Middleware functions for request processing
 * Handles CORS, validation, error handling, and other cross-cutting concerns
 */

import { createErrorResponse } from './router';
import { isValidDateFormat } from './github-client';
import { globalOptimizer, PerformanceOptimizer } from './performance-optimizer';

export interface Middleware {
  (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response>;
}

/**
 * CORS middleware - adds CORS headers to all responses
 */
export function corsMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request> => {
    // CORS is handled in the router's createJSONResponse and createErrorResponse functions
    // This middleware just passes the request through
    // The actual CORS headers are added in the response creation
    return request;
  };
}

/**
 * Request validation middleware
 */
export function validationMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response> => {
    const url = new URL(request.url);
    
    // Validate date parameter if present
    const dateParam = url.searchParams.get('date');
    if (dateParam) {
      if (!isValidDateFormat(dateParam)) {
        return createErrorResponse(
          400,
          'VALIDATION_ERROR',
          'Invalid date format. Use YYYY-MM-DD format.',
          `Provided date: ${dateParam}`
        );
      }
      
      // Check if date is not too far in the future
      const requestedDate = new Date(dateParam);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (requestedDate > today) {
        return createErrorResponse(
          400,
          'VALIDATION_ERROR',
          'Cannot request data for future dates',
          `Requested date: ${dateParam}`
        );
      }
      
      // Check if date is not too far in the past (more than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (requestedDate < thirtyDaysAgo) {
        return createErrorResponse(
          400,
          'VALIDATION_ERROR',
          'Date is too far in the past. Maximum 30 days ago.',
          `Requested date: ${dateParam}, Oldest allowed: ${thirtyDaysAgo.toISOString().split('T')[0]}`
        );
      }
    }
    
    // Validate other query parameters
    const validParams = ['date', 'limit', 'offset'];
    for (const [key, value] of url.searchParams.entries()) {
      if (!validParams.includes(key)) {
        return createErrorResponse(
          400,
          'VALIDATION_ERROR',
          `Invalid query parameter: ${key}`,
          `Valid parameters: ${validParams.join(', ')}`
        );
      }
      
      // Validate numeric parameters
      if ((key === 'limit' || key === 'offset') && value) {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 0) {
          return createErrorResponse(
            400,
            'VALIDATION_ERROR',
            `Parameter '${key}' must be a non-negative integer`,
            `Provided value: ${value}`
          );
        }
        
        if (key === 'limit' && numValue > 100) {
          return createErrorResponse(
            400,
            'VALIDATION_ERROR',
            'Limit parameter cannot exceed 100',
            `Provided value: ${value}`
          );
        }
      }
    }
    
    return request;
  };
}

/**
 * Rate limiting middleware (basic implementation)
 */
export function rateLimitMiddleware(requestsPerMinute: number = 60): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response> => {
    // Get client IP (Cloudflare provides this in CF-Connecting-IP header)
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    'unknown';
    
    // Create rate limit key
    const rateLimitKey = `rate_limit:${clientIP}:${Math.floor(Date.now() / 60000)}`;
    
    try {
      // Check current request count (if KV is available)
      if (env.TRENDING_KV) {
        const currentCount = await env.TRENDING_KV.get(rateLimitKey);
        const count = currentCount ? parseInt(currentCount, 10) : 0;
        
        if (count >= requestsPerMinute) {
          return createErrorResponse(
            429,
            'RATE_LIMIT_EXCEEDED',
            'Too many requests. Please try again later.',
            `Limit: ${requestsPerMinute} requests per minute`
          );
        }
        
        // Increment counter
        await env.TRENDING_KV.put(rateLimitKey, (count + 1).toString(), {
          expirationTtl: 60, // Expire after 1 minute
        });
      }
    } catch (error) {
      // If rate limiting fails, log but don't block the request
      console.warn('Rate limiting error:', error);
    }
    
    return request;
  };
}

/**
 * Request logging middleware
 */
export function loggingMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request> => {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';
    
    console.log(`[${timestamp}] ${request.method} ${url.pathname}${url.search} - IP: ${clientIP} - UA: ${userAgent}`);
    
    return request;
  };
}

/**
 * Security headers middleware
 */
export function securityHeadersMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request> => {
    // Security headers are added in the response creation functions
    // This middleware just passes the request through
    return request;
  };
}

/**
 * Content-Type validation middleware for POST/PUT requests
 */
export function contentTypeMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response> => {
    const method = request.method.toUpperCase();
    
    // Only validate content-type for requests with body
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const contentType = request.headers.get('Content-Type');
      
      if (!contentType) {
        return createErrorResponse(
          400,
          'VALIDATION_ERROR',
          'Content-Type header is required for requests with body',
          `Method: ${method}`
        );
      }
      
      // For this API, we expect JSON
      if (!contentType.includes('application/json')) {
        return createErrorResponse(
          415,
          'UNSUPPORTED_MEDIA_TYPE',
          'Unsupported Content-Type. Expected application/json.',
          `Provided: ${contentType}`
        );
      }
    }
    
    return request;
  };
}

/**
 * Environment validation middleware
 */
export function environmentValidationMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response> => {
    // Check required environment variables
    if (!env.TRENDING_KV) {
      return createErrorResponse(
        503,
        'SERVICE_UNAVAILABLE',
        'KV storage is not available',
        'TRENDING_KV namespace not configured'
      );
    }
    
    if (!env.GITHUB_TOKEN) {
      console.warn('GitHub token not configured - API rate limits may apply');
    }
    
    return request;
  };
}

/**
 * Request timeout middleware
 */
export function timeoutMiddleware(timeoutMs: number = 30000): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response> => {
    // Set a timeout for the request processing
    // This is more of a documentation/logging middleware since Cloudflare Workers
    // have their own timeout mechanisms
    
    const startTime = Date.now();
    
    // Add timeout info to request (for logging purposes)
    const url = new URL(request.url);
    url.searchParams.set('_start_time', startTime.toString());
    
    return new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  };
}

/**
 * Error boundary middleware - catches and formats unhandled errors
 */
export function errorBoundaryMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request> => {
    // This middleware doesn't do anything directly
    // Error handling is done in the router's handle method
    // This is here for consistency and future extensibility
    return request;
  };
}

/**
 * Utility function to create enhanced CORS response with security headers
 */
export function createCORSResponse(data: any, status: number = 200): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    // CORS headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none';",
    // Cache headers
    'Cache-Control': 'public, max-age=300, s-maxage=300',
    'Vary': 'Accept-Encoding',
  });

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

/**
 * Performance monitoring middleware
 */
export function performanceMiddleware(optimizer: PerformanceOptimizer = globalOptimizer): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request> => {
    const startTime = optimizer.startRequest();
    
    // Add performance tracking to context
    (ctx as any).performanceStart = startTime;
    (ctx as any).optimizer = optimizer;
    
    return request;
  };
}

/**
 * Response caching middleware
 */
export function cachingMiddleware(
  optimizer: PerformanceOptimizer = globalOptimizer,
  defaultTTL: number = 300000
): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response> => {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return request;
    }

    const url = new URL(request.url);
    const cacheKey = optimizer.createCacheKey(url.pathname, Object.fromEntries(url.searchParams));
    
    // Check cache
    const cached = optimizer.getCached(cacheKey);
    if (cached) {
      const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Cache-Status': 'HIT',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${Math.floor(defaultTTL / 1000)}`,
      });

      return new Response(JSON.stringify(cached), {
        status: 200,
        headers,
      });
    }

    // Add cache key to context for response caching
    (ctx as any).cacheKey = cacheKey;
    (ctx as any).cacheTTL = defaultTTL;
    
    return request;
  };
}

/**
 * Response compression middleware
 */
export function compressionMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request> => {
    // Check if client accepts compression
    const acceptEncoding = request.headers.get('Accept-Encoding') || '';
    (ctx as any).supportsCompression = acceptEncoding.includes('gzip') || acceptEncoding.includes('deflate');
    
    return request;
  };
}

/**
 * Request size limiting middleware
 */
export function requestSizeLimitMiddleware(maxSizeBytes: number = 1024 * 1024): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response> => {
    const contentLength = request.headers.get('Content-Length');
    
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (size > maxSizeBytes) {
        return createErrorResponse(
          413,
          'PAYLOAD_TOO_LARGE',
          'Request payload too large',
          `Maximum size: ${maxSizeBytes} bytes, received: ${size} bytes`
        );
      }
    }
    
    return request;
  };
}

/**
 * API versioning middleware
 */
export function versioningMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request> => {
    const url = new URL(request.url);
    const version = request.headers.get('API-Version') || url.searchParams.get('version') || 'v1';
    
    // Add version info to context
    (ctx as any).apiVersion = version;
    
    // Add version header to response (will be handled in response creation)
    return request;
  };
}

/**
 * Health check bypass middleware
 */
export function healthCheckMiddleware(): Middleware {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Request | Response> => {
    const url = new URL(request.url);
    
    // Quick health check response to avoid unnecessary processing
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: Date.now(),
      };

      return createCORSResponse(healthData, 200);
    }
    
    return request;
  };
}

/**
 * Utility function to create enhanced error response with security headers
 */
export function createEnhancedErrorResponse(
  status: number,
  code: string,
  message: string,
  details?: string
): Response {
  const errorBody = {
    error: {
      code,
      message,
      details: details || `HTTP ${status}`,
    },
    timestamp: new Date().toISOString(),
  };

  const headers = new Headers({
    'Content-Type': 'application/json',
    // CORS headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none';",
    // No cache for errors
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });

  return new Response(JSON.stringify(errorBody), {
    status,
    headers,
  });
}
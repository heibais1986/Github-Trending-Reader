/**
 * Performance Optimization Utilities
 * Provides caching, compression, and performance monitoring capabilities
 */

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  lastUpdated: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface CompressionOptions {
  enabled: boolean;
  threshold: number; // Minimum size in bytes to compress
  level: number; // Compression level 1-9
}

export class PerformanceOptimizer {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private metrics: PerformanceMetrics = {
    requestCount: 0,
    averageResponseTime: 0,
    cacheHitRate: 0,
    errorRate: 0,
    lastUpdated: new Date().toISOString(),
  };
  private responseTimes: number[] = [];
  private errorCount: number = 0;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  constructor(
    private maxCacheSize: number = 100,
    private defaultTTL: number = 300000 // 5 minutes
  ) {}

  /**
   * Cache management methods
   */
  
  /**
   * Get data from cache if available and not expired
   */
  getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.cacheMisses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.cacheMisses++;
      return null;
    }

    entry.hits++;
    this.cacheHits++;
    return entry.data;
  }

  /**
   * Store data in cache with TTL
   */
  setCache<T>(key: string, data: T, ttl?: number): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      hits: 0,
    });
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): number {
    const now = Date.now();
    let cleared = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    totalHits: number;
    totalMisses: number;
    topKeys: Array<{ key: string; hits: number }>;
  } {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;

    // Get top 10 most accessed keys
    const topKeys = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, hits: entry.hits }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 10);

    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      totalHits: this.cacheHits,
      totalMisses: this.cacheMisses,
      topKeys,
    };
  }

  /**
   * Performance monitoring methods
   */

  /**
   * Record request start time
   */
  startRequest(): number {
    this.metrics.requestCount++;
    return Date.now();
  }

  /**
   * Record request completion and calculate response time
   */
  endRequest(startTime: number, isError: boolean = false): number {
    const responseTime = Date.now() - startTime;
    
    this.responseTimes.push(responseTime);
    
    // Keep only last 1000 response times for memory efficiency
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }

    if (isError) {
      this.errorCount++;
    }

    this.updateMetrics();
    return responseTime;
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get detailed performance statistics
   */
  getDetailedStats(): {
    metrics: PerformanceMetrics;
    responseTimePercentiles: {
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
    cacheStats: ReturnType<typeof this.getCacheStats>;
    memoryUsage: {
      cacheSize: number;
      metricsSize: number;
      totalSize: number;
    };
  } {
    const sortedTimes = [...this.responseTimes].sort((a, b) => a - b);
    const len = sortedTimes.length;

    const percentiles = {
      p50: len > 0 ? sortedTimes[Math.floor(len * 0.5)] : 0,
      p90: len > 0 ? sortedTimes[Math.floor(len * 0.9)] : 0,
      p95: len > 0 ? sortedTimes[Math.floor(len * 0.95)] : 0,
      p99: len > 0 ? sortedTimes[Math.floor(len * 0.99)] : 0,
    };

    const cacheStats = this.getCacheStats();
    
    // Estimate memory usage
    const cacheSize = this.estimateCacheMemoryUsage();
    const metricsSize = this.responseTimes.length * 8; // 8 bytes per number
    
    return {
      metrics: this.getMetrics(),
      responseTimePercentiles: percentiles,
      cacheStats,
      memoryUsage: {
        cacheSize,
        metricsSize,
        totalSize: cacheSize + metricsSize,
      },
    };
  }

  /**
   * Response optimization methods
   */

  /**
   * Optimize JSON response for size and speed
   */
  optimizeResponse(data: any, options: {
    removeNulls?: boolean;
    compactArrays?: boolean;
    roundNumbers?: boolean;
  } = {}): any {
    const {
      removeNulls = true,
      compactArrays = true,
      roundNumbers = true,
    } = options;

    return this.optimizeObject(data, {
      removeNulls,
      compactArrays,
      roundNumbers,
    });
  }

  /**
   * Create optimized cache key from request parameters
   */
  createCacheKey(path: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return `${path}${sortedParams ? '?' + sortedParams : ''}`;
  }

  /**
   * Check if response should be cached based on size and type
   */
  shouldCache(data: any, maxSize: number = 1024 * 1024): boolean {
    try {
      const size = JSON.stringify(data).length;
      return size <= maxSize;
    } catch {
      return false;
    }
  }

  /**
   * Compress response data if beneficial
   */
  async compressResponse(
    data: string,
    options: CompressionOptions = {
      enabled: true,
      threshold: 1024,
      level: 6,
    }
  ): Promise<{ data: string; compressed: boolean; originalSize: number; compressedSize: number }> {
    const originalSize = data.length;

    if (!options.enabled || originalSize < options.threshold) {
      return {
        data,
        compressed: false,
        originalSize,
        compressedSize: originalSize,
      };
    }

    try {
      // Simple compression simulation (in real implementation, use actual compression)
      const compressed = this.simpleCompress(data);
      const compressedSize = compressed.length;

      // Only use compression if it provides significant benefit
      if (compressedSize < originalSize * 0.8) {
        return {
          data: compressed,
          compressed: true,
          originalSize,
          compressedSize,
        };
      }
    } catch (error) {
      console.warn('Compression failed:', error);
    }

    return {
      data,
      compressed: false,
      originalSize,
      compressedSize: originalSize,
    };
  }

  /**
   * Batch processing optimization
   */
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10,
    concurrency: number = 3
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      // Process batch with limited concurrency
      const batchPromises = batch.map(item => processor(item));
      const batchResults = await this.limitConcurrency(batchPromises, concurrency);
      
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Database query optimization
   */
  optimizeQuery(query: any): {
    optimized: any;
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    const optimized = { ...query };

    // Add optimization suggestions based on query patterns
    if (query.limit && query.limit > 100) {
      suggestions.push('Consider reducing limit to improve response time');
      optimized.limit = Math.min(query.limit, 100);
    }

    if (query.sort && Array.isArray(query.sort) && query.sort.length > 3) {
      suggestions.push('Multiple sort fields may impact performance');
    }

    if (!query.limit) {
      suggestions.push('Adding a limit can improve query performance');
      optimized.limit = 50;
    }

    return { optimized, suggestions };
  }

  /**
   * Memory management methods
   */

  /**
   * Clean up resources and optimize memory usage
   */
  cleanup(): {
    cacheCleared: number;
    metricsReset: boolean;
    memoryFreed: number;
  } {
    const cacheCleared = this.clearExpiredCache();
    const memoryFreed = this.estimateCacheMemoryUsage();
    
    // Reset metrics if they're getting too large
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-500);
    }

    return {
      cacheCleared,
      metricsReset: this.responseTimes.length <= 500,
      memoryFreed,
    };
  }

  /**
   * Reset all performance data
   */
  reset(): void {
    this.cache.clear();
    this.responseTimes = [];
    this.errorCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.metrics = {
      requestCount: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      errorRate: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Private helper methods
   */

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    let lowestHits = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Prioritize by least recently used and least hits
      const score = entry.timestamp + (entry.hits * 60000); // Boost score for hits
      
      if (score < oldestTime) {
        oldestTime = score;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private updateMetrics(): void {
    const totalRequests = this.cacheHits + this.cacheMisses;
    
    this.metrics.averageResponseTime = this.responseTimes.length > 0
      ? Math.round(this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length)
      : 0;
    
    this.metrics.cacheHitRate = totalRequests > 0
      ? Math.round((this.cacheHits / totalRequests) * 10000) / 100
      : 0;
    
    this.metrics.errorRate = this.metrics.requestCount > 0
      ? Math.round((this.errorCount / this.metrics.requestCount) * 10000) / 100
      : 0;
    
    this.metrics.lastUpdated = new Date().toISOString();
  }

  private optimizeObject(obj: any, options: any): any {
    if (obj === null || obj === undefined) {
      return options.removeNulls ? undefined : obj;
    }

    if (Array.isArray(obj)) {
      const optimized = obj
        .map(item => this.optimizeObject(item, options))
        .filter(item => !options.removeNulls || item !== undefined);
      
      return options.compactArrays ? optimized : obj;
    }

    if (typeof obj === 'object') {
      const optimized: any = {};
      
      for (const [key, value] of Object.entries(obj)) {
        const optimizedValue = this.optimizeObject(value, options);
        
        if (!options.removeNulls || optimizedValue !== undefined) {
          optimized[key] = optimizedValue;
        }
      }
      
      return optimized;
    }

    if (typeof obj === 'number' && options.roundNumbers) {
      return Math.round(obj * 100) / 100;
    }

    return obj;
  }

  private estimateCacheMemoryUsage(): number {
    let totalSize = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      try {
        totalSize += key.length * 2; // UTF-16 characters
        totalSize += JSON.stringify(entry.data).length * 2;
        totalSize += 32; // Overhead for entry metadata
      } catch {
        totalSize += 1024; // Estimate for non-serializable data
      }
    }
    
    return totalSize;
  }

  private simpleCompress(data: string): string {
    // Simple compression simulation - replace repeated patterns
    return data
      .replace(/\s+/g, ' ')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/:\s*/g, ':')
      .trim();
  }

  private async limitConcurrency<T>(
    promises: Promise<T>[],
    limit: number
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < promises.length; i += limit) {
      const batch = promises.slice(i, i + limit);
      const batchResults = await Promise.all(batch);
      results.push(...batchResults);
    }
    
    return results;
  }
}

/**
 * Global performance optimizer instance
 */
export const globalOptimizer = new PerformanceOptimizer();

/**
 * Performance monitoring middleware
 */
export function createPerformanceMiddleware(optimizer: PerformanceOptimizer = globalOptimizer) {
  return async (request: Request, env: any, ctx: any): Promise<Request | Response> => {
    const startTime = optimizer.startRequest();
    
    // Add performance tracking to context
    (ctx as any).performanceStart = startTime;
    (ctx as any).optimizer = optimizer;
    
    return request;
  };
}

/**
 * Response optimization middleware
 */
export function createResponseOptimizationMiddleware(
  optimizer: PerformanceOptimizer = globalOptimizer,
  options: {
    enableCaching?: boolean;
    enableCompression?: boolean;
    cacheMaxAge?: number;
  } = {}
) {
  const {
    enableCaching = true,
    enableCompression = true,
    cacheMaxAge = 300,
  } = options;

  return async (response: Response, request: Request, ctx: any): Promise<Response> => {
    try {
      const startTime = (ctx as any).performanceStart || Date.now();
      const isError = response.status >= 400;
      
      optimizer.endRequest(startTime, isError);

      // Add performance headers
      const responseTime = Date.now() - startTime;
      const headers = new Headers(response.headers);
      headers.set('X-Response-Time', `${responseTime}ms`);
      headers.set('X-Cache-Status', 'MISS'); // Default, will be overridden if cached

      // Add caching headers for successful responses
      if (!isError && enableCaching) {
        headers.set('Cache-Control', `public, max-age=${cacheMaxAge}`);
        headers.set('ETag', `"${Date.now()}"`);
      }

      // Add compression headers if applicable
      if (enableCompression && response.headers.get('Content-Type')?.includes('application/json')) {
        headers.set('Vary', 'Accept-Encoding');
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });

    } catch (error) {
      console.error('Response optimization failed:', error);
      return response;
    }
  };
}

/**
 * Utility functions for performance optimization
 */

/**
 * Create optimized JSON response with caching
 */
export async function createOptimizedResponse(
  data: any,
  request: Request,
  optimizer: PerformanceOptimizer = globalOptimizer,
  options: {
    ttl?: number;
    compress?: boolean;
    optimize?: boolean;
  } = {}
): Promise<Response> {
  const {
    ttl = 300000,
    compress = true,
    optimize = true,
  } = options;

  try {
    // Create cache key
    const url = new URL(request.url);
    const cacheKey = optimizer.createCacheKey(url.pathname, Object.fromEntries(url.searchParams));

    // Check cache first
    const cached = optimizer.getCached(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache-Status': 'HIT',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Optimize data if requested
    const optimizedData = optimize ? optimizer.optimizeResponse(data) : data;

    // Convert to JSON
    let jsonData = JSON.stringify(optimizedData);

    // Compress if beneficial
    if (compress) {
      const compressed = await optimizer.compressResponse(jsonData);
      jsonData = compressed.data;
    }

    // Cache the response if it's not too large
    if (optimizer.shouldCache(optimizedData)) {
      optimizer.setCache(cacheKey, optimizedData, ttl);
    }

    return new Response(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache-Status': 'MISS',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Failed to create optimized response:', error);
    
    // Fallback to simple response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

/**
 * Performance monitoring decorator
 */
export function withPerformanceMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name: string,
  optimizer: PerformanceOptimizer = globalOptimizer
): T {
  return (async (...args: any[]) => {
    const startTime = optimizer.startRequest();
    let isError = false;

    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      isError = true;
      throw error;
    } finally {
      optimizer.endRequest(startTime, isError);
    }
  }) as T;
}
/**
 * Performance Optimization Tests
 * Tests caching, compression, and performance monitoring functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PerformanceOptimizer, globalOptimizer } from '../src/performance-optimizer';
import { 
  performanceMiddleware, 
  cachingMiddleware, 
  compressionMiddleware,
  requestSizeLimitMiddleware 
} from '../src/middleware';
import { Router } from '../src/router';

const mockEnv = {
  TRENDING_KV: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
  },
  GITHUB_TOKEN: 'test-token',
};

const mockCtx = {
  waitUntil: vi.fn(),
  passThroughOnException: vi.fn(),
};

describe('Performance Optimization Tests', () => {
  let optimizer: PerformanceOptimizer;

  beforeEach(() => {
    vi.clearAllMocks();
    optimizer = new PerformanceOptimizer(50, 300000); // 50 items, 5 min TTL
  });

  describe('PerformanceOptimizer', () => {
    describe('Cache Management', () => {
      it('should cache and retrieve data correctly', () => {
        const testData = { message: 'test data' };
        const key = 'test-key';

        // Initially should return null
        expect(optimizer.getCached(key)).toBeNull();

        // Set cache
        optimizer.setCache(key, testData);

        // Should retrieve cached data
        const cached = optimizer.getCached(key);
        expect(cached).toEqual(testData);
      });

      it('should expire cached data after TTL', async () => {
        const testData = { message: 'test data' };
        const key = 'test-key';
        const shortTTL = 100; // 100ms

        optimizer.setCache(key, testData, shortTTL);

        // Should be available immediately
        expect(optimizer.getCached(key)).toEqual(testData);

        // Wait for expiration
        await new Promise(resolve => setTimeout(resolve, 150));

        // Should be expired
        expect(optimizer.getCached(key)).toBeNull();
      });

      it('should implement LRU eviction when cache is full', () => {
        const maxSize = 3;
        const smallOptimizer = new PerformanceOptimizer(maxSize);

        // Fill cache to capacity
        for (let i = 0; i < maxSize; i++) {
          smallOptimizer.setCache(`key-${i}`, { data: i });
        }

        // All items should be cached
        for (let i = 0; i < maxSize; i++) {
          expect(smallOptimizer.getCached(`key-${i}`)).toEqual({ data: i });
        }

        // Add one more item (should evict oldest)
        smallOptimizer.setCache('key-new', { data: 'new' });

        // Oldest item should be evicted
        expect(smallOptimizer.getCached('key-0')).toBeNull();
        expect(smallOptimizer.getCached('key-new')).toEqual({ data: 'new' });
      });

      it('should clear expired cache entries', async () => {
        const shortTTL = 50;
        
        optimizer.setCache('key1', { data: 1 }, shortTTL);
        optimizer.setCache('key2', { data: 2 }, 300000); // Long TTL
        optimizer.setCache('key3', { data: 3 }, shortTTL);

        // Wait for short TTL to expire
        await new Promise(resolve => setTimeout(resolve, 100));

        const clearedCount = optimizer.clearExpiredCache();
        
        expect(clearedCount).toBe(2); // key1 and key3 should be cleared
        expect(optimizer.getCached('key2')).toEqual({ data: 2 });
      });

      it('should provide accurate cache statistics', () => {
        optimizer.setCache('key1', { data: 1 });
        optimizer.setCache('key2', { data: 2 });

        // Generate some hits and misses
        optimizer.getCached('key1'); // hit
        optimizer.getCached('key1'); // hit
        optimizer.getCached('key2'); // hit
        optimizer.getCached('nonexistent'); // miss

        const stats = optimizer.getCacheStats();
        
        expect(stats.size).toBe(2);
        expect(stats.totalHits).toBe(3);
        expect(stats.totalMisses).toBe(1);
        expect(stats.hitRate).toBe(75); // 3/4 * 100
      });
    });

    describe('Performance Monitoring', () => {
      it('should track request metrics correctly', () => {
        const startTime1 = optimizer.startRequest();
        const startTime2 = optimizer.startRequest();

        // Simulate some processing time
        const responseTime1 = optimizer.endRequest(startTime1 - 100, false);
        const responseTime2 = optimizer.endRequest(startTime2 - 200, true);

        expect(responseTime1).toBeGreaterThan(90);
        expect(responseTime2).toBeGreaterThan(190);

        const metrics = optimizer.getMetrics();
        expect(metrics.requestCount).toBe(2);
        expect(metrics.errorRate).toBe(50); // 1 error out of 2 requests
        expect(metrics.averageResponseTime).toBeGreaterThan(0);
      });

      it('should provide detailed performance statistics', () => {
        // Generate some response times
        for (let i = 0; i < 10; i++) {
          const startTime = optimizer.startRequest();
          optimizer.endRequest(startTime - (i * 10), i % 3 === 0); // Every 3rd request is an error
        }

        const stats = optimizer.getDetailedStats();
        
        expect(stats.metrics.requestCount).toBe(10);
        expect(stats.responseTimePercentiles.p50).toBeGreaterThan(0);
        expect(stats.responseTimePercentiles.p90).toBeGreaterThan(stats.responseTimePercentiles.p50);
        expect(stats.memoryUsage.totalSize).toBeGreaterThan(0);
      });
    });

    describe('Response Optimization', () => {
      it('should optimize response data by removing nulls', () => {
        const data = {
          name: 'test',
          description: null,
          value: 42,
          nested: {
            field1: 'value',
            field2: null,
            field3: undefined
          },
          array: [1, null, 3, undefined, 5]
        };

        const optimized = optimizer.optimizeResponse(data, {
          removeNulls: true,
          compactArrays: true,
          roundNumbers: true
        });

        expect(optimized.description).toBeUndefined();
        expect(optimized.nested.field2).toBeUndefined();
        expect(optimized.nested.field3).toBeUndefined();
        expect(optimized.array).toEqual([1, 3, 5]);
      });

      it('should round numbers when optimizing', () => {
        const data = {
          price: 19.999999,
          rating: 4.567890123,
          count: 42
        };

        const optimized = optimizer.optimizeResponse(data, {
          roundNumbers: true
        });

        expect(optimized.price).toBe(20);
        expect(optimized.rating).toBe(4.57);
        expect(optimized.count).toBe(42);
      });

      it('should create appropriate cache keys', () => {
        const key1 = optimizer.createCacheKey('/api/trending');
        const key2 = optimizer.createCacheKey('/api/trending', { date: '2024-01-01' });
        const key3 = optimizer.createCacheKey('/api/trending', { date: '2024-01-01', limit: '10' });

        expect(key1).toBe('/api/trending');
        expect(key2).toBe('/api/trending?date=2024-01-01');
        expect(key3).toBe('/api/trending?date=2024-01-01&limit=10');
      });

      it('should determine if response should be cached based on size', () => {
        const smallData = { message: 'small' };
        const largeData = { message: 'x'.repeat(2000000) }; // 2MB string

        expect(optimizer.shouldCache(smallData)).toBe(true);
        expect(optimizer.shouldCache(largeData, 1024 * 1024)).toBe(false); // 1MB limit
      });
    });

    describe('Batch Processing', () => {
      it('should process items in batches with concurrency control', async () => {
        const items = Array.from({ length: 25 }, (_, i) => i);
        const processedItems: number[] = [];
        
        const processor = async (item: number): Promise<number> => {
          await new Promise(resolve => setTimeout(resolve, 10));
          processedItems.push(item);
          return item * 2;
        };

        const results = await optimizer.processBatch(items, processor, 5, 2);

        expect(results).toHaveLength(25);
        expect(results[0]).toBe(0);
        expect(results[24]).toBe(48);
        expect(processedItems).toHaveLength(25);
      });
    });

    describe('Memory Management', () => {
      it('should cleanup expired cache and optimize memory', () => {
        // Add some cache entries
        optimizer.setCache('key1', { data: 'large'.repeat(1000) });
        optimizer.setCache('key2', { data: 'small' });

        // Add some response times
        for (let i = 0; i < 1500; i++) {
          const start = optimizer.startRequest();
          optimizer.endRequest(start - 10);
        }

        const cleanupResult = optimizer.cleanup();

        expect(cleanupResult.cacheCleared).toBeGreaterThanOrEqual(0);
        expect(cleanupResult.memoryFreed).toBeGreaterThan(0);
      });

      it('should reset all performance data', () => {
        // Generate some data
        optimizer.setCache('key1', { data: 1 });
        const start = optimizer.startRequest();
        optimizer.endRequest(start - 100);

        // Reset
        optimizer.reset();

        const metrics = optimizer.getMetrics();
        const stats = optimizer.getCacheStats();

        expect(metrics.requestCount).toBe(0);
        expect(stats.size).toBe(0);
        expect(optimizer.getCached('key1')).toBeNull();
      });
    });
  });

  describe('Performance Middleware', () => {
    it('should add performance tracking to request context', async () => {
      const middleware = performanceMiddleware(optimizer);
      const request = new Request('https://example.com/api/trending');

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Request);
      expect((mockCtx as any).performanceStart).toBeDefined();
      expect((mockCtx as any).optimizer).toBe(optimizer);
    });

    it('should return cached response when available', async () => {
      const testData = { repositories: [], total: 0 };
      optimizer.setCache('/api/trending', testData);

      const middleware = cachingMiddleware(optimizer);
      const request = new Request('https://example.com/api/trending');

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(200);
      expect(response.headers.get('X-Cache-Status')).toBe('HIT');

      const data = await response.json();
      expect(data).toEqual(testData);
    });

    it('should pass through non-GET requests without caching', async () => {
      const middleware = cachingMiddleware(optimizer);
      const request = new Request('https://example.com/api/trending', { method: 'POST' });

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Request);
      expect(result).toBe(request);
    });

    it('should detect compression support', async () => {
      const middleware = compressionMiddleware();
      const request = new Request('https://example.com/api/trending', {
        headers: { 'Accept-Encoding': 'gzip, deflate, br' }
      });

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Request);
      expect((mockCtx as any).supportsCompression).toBe(true);
    });

    it('should reject requests that are too large', async () => {
      const middleware = requestSizeLimitMiddleware(1000); // 1KB limit
      const request = new Request('https://example.com/api/data', {
        method: 'POST',
        headers: { 'Content-Length': '2000' }
      });

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(413);

      const errorData = await response.json();
      expect(errorData.error.code).toBe('PAYLOAD_TOO_LARGE');
    });
  });

  describe('Integration with Router', () => {
    it('should work with router middleware chain', async () => {
      const router = new Router();
      
      // Add performance middleware
      router.use(performanceMiddleware(optimizer));
      router.use(cachingMiddleware(optimizer));

      // Add a test route
      router.get('/api/test', async (request, env, ctx) => {
        return new Response(JSON.stringify({ message: 'test' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      });

      // First request should miss cache
      const request1 = new Request('https://example.com/api/test');
      const response1 = await router.handle(request1, mockEnv, mockCtx);

      expect(response1.status).toBe(200);

      // Cache the response manually for testing
      optimizer.setCache('/api/test', { message: 'test' });

      // Second request should hit cache
      const request2 = new Request('https://example.com/api/test');
      const response2 = await router.handle(request2, mockEnv, mockCtx);

      expect(response2.status).toBe(200);
      expect(response2.headers.get('X-Cache-Status')).toBe('HIT');
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should track performance across multiple requests', async () => {
      const router = new Router();
      router.use(performanceMiddleware(optimizer));

      router.get('/api/fast', async () => {
        return new Response(JSON.stringify({ fast: true }));
      });

      router.get('/api/slow', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return new Response(JSON.stringify({ slow: true }));
      });

      // Make several requests
      await router.handle(new Request('https://example.com/api/fast'), mockEnv, mockCtx);
      await router.handle(new Request('https://example.com/api/slow'), mockEnv, mockCtx);
      await router.handle(new Request('https://example.com/api/fast'), mockEnv, mockCtx);

      const metrics = optimizer.getMetrics();
      expect(metrics.requestCount).toBe(3);
      expect(metrics.averageResponseTime).toBeGreaterThan(0);
    });
  });

  describe('Error Handling in Performance Features', () => {
    it('should handle cache errors gracefully', () => {
      // Test with invalid data that can't be serialized
      const circularData: any = {};
      circularData.self = circularData;

      expect(() => {
        optimizer.shouldCache(circularData);
      }).not.toThrow();

      expect(optimizer.shouldCache(circularData)).toBe(false);
    });

    it('should handle compression errors gracefully', async () => {
      const invalidData = '\uD800'; // Invalid Unicode

      const result = await optimizer.compressResponse(invalidData);
      
      expect(result.compressed).toBe(false);
      expect(result.data).toBe(invalidData);
    });
  });
});
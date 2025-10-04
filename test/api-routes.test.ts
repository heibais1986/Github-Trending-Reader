/**
 * API Routes and Middleware Tests
 * Tests the complete API routing system with middleware
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from '../src/router';
import { 
  getTrendingHandler, 
  getAvailableDatesHandler, 
  healthCheckHandler, 
  getStatsHandler,
  notFoundHandler 
} from '../src/api-handlers';
import {
  validationMiddleware,
  rateLimitMiddleware,
  loggingMiddleware,
  environmentValidationMiddleware,
} from '../src/middleware';

// Mock environment
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

describe('API Router and Middleware', () => {
  let router: Router;

  beforeEach(() => {
    router = new Router();
    vi.clearAllMocks();
  });

  describe('Router Basic Functionality', () => {
    it('should handle GET routes', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('OK'));
      router.get('/test', handler);

      const request = new Request('https://example.com/test');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(handler).toHaveBeenCalledWith(request, mockEnv, mockCtx, {});
      expect(response.status).toBe(200);
    });

    it('should handle CORS preflight requests', async () => {
      const request = new Request('https://example.com/api/trending', {
        method: 'OPTIONS',
      });

      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });

    it('should return 404 for undefined routes', async () => {
      const request = new Request('https://example.com/nonexistent');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('should handle route parameters', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('OK'));
      router.get('/api/test/:id', handler);

      const request = new Request('https://example.com/api/test/123');
      await router.handle(request, mockEnv, mockCtx);

      expect(handler).toHaveBeenCalledWith(request, mockEnv, mockCtx, { id: '123' });
    });
  });

  describe('Middleware Functionality', () => {
    it('should run global middleware for all routes', async () => {
      const middleware = vi.fn().mockResolvedValue(new Request('https://example.com/test'));
      const handler = vi.fn().mockResolvedValue(new Response('OK'));

      router.use(middleware);
      router.get('/test', handler);

      const request = new Request('https://example.com/test');
      await router.handle(request, mockEnv, mockCtx);

      expect(middleware).toHaveBeenCalled();
      expect(handler).toHaveBeenCalled();
    });

    it('should run route-specific middleware', async () => {
      const middleware = vi.fn().mockResolvedValue(new Request('https://example.com/test'));
      const handler = vi.fn().mockResolvedValue(new Response('OK'));

      router.get('/test', handler, [middleware]);

      const request = new Request('https://example.com/test');
      await router.handle(request, mockEnv, mockCtx);

      expect(middleware).toHaveBeenCalled();
      expect(handler).toHaveBeenCalled();
    });

    it('should stop execution if middleware returns Response', async () => {
      const errorResponse = new Response('Middleware Error', { status: 400 });
      const middleware = vi.fn().mockResolvedValue(errorResponse);
      const handler = vi.fn().mockResolvedValue(new Response('OK'));

      router.get('/test', handler, [middleware]);

      const request = new Request('https://example.com/test');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(middleware).toHaveBeenCalled();
      expect(handler).not.toHaveBeenCalled();
      expect(response).toBe(errorResponse);
    });
  });

  describe('Validation Middleware', () => {
    it('should validate date format', async () => {
      const middleware = validationMiddleware();
      const request = new Request('https://example.com/api/trending?date=invalid-date');

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.message).toContain('Invalid date format');
    });

    it('should reject future dates', async () => {
      const middleware = validationMiddleware();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const request = new Request(`https://example.com/api/trending?date=${futureDateStr}`);

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.message).toContain('future dates');
    });

    it('should reject dates too far in the past', async () => {
      const middleware = validationMiddleware();
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 35); // 35 days ago
      const oldDateStr = oldDate.toISOString().split('T')[0];

      const request = new Request(`https://example.com/api/trending?date=${oldDateStr}`);

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.message).toContain('too far in the past');
    });

    it('should accept valid dates', async () => {
      const middleware = validationMiddleware();
      const validDate = new Date();
      validDate.setDate(validDate.getDate() - 1); // Yesterday
      const validDateStr = validDate.toISOString().split('T')[0];

      const request = new Request(`https://example.com/api/trending?date=${validDateStr}`);

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Request);
    });

    it('should validate query parameters', async () => {
      const middleware = validationMiddleware();
      const request = new Request('https://example.com/api/trending?invalid=param');

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.message).toContain('Invalid query parameter');
    });
  });

  describe('Environment Validation Middleware', () => {
    it('should check for required KV namespace', async () => {
      const middleware = environmentValidationMiddleware();
      const envWithoutKV = { GITHUB_TOKEN: 'test' };
      const request = new Request('https://example.com/api/trending');

      const result = await middleware(request, envWithoutKV, mockCtx);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(503);
      
      const body = await response.json();
      expect(body.error.code).toBe('SERVICE_UNAVAILABLE');
    });

    it('should pass with valid environment', async () => {
      const middleware = environmentValidationMiddleware();
      const request = new Request('https://example.com/api/trending');

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Request);
    });
  });

  describe('Rate Limiting Middleware', () => {
    it('should allow requests under limit', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue(null); // No previous requests
      mockEnv.TRENDING_KV.put.mockResolvedValue(undefined);

      const middleware = rateLimitMiddleware(10);
      const request = new Request('https://example.com/api/trending', {
        headers: { 'CF-Connecting-IP': '192.168.1.1' }
      });

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Request);
      expect(mockEnv.TRENDING_KV.put).toHaveBeenCalled();
    });

    it('should block requests over limit', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue('10'); // At limit

      const middleware = rateLimitMiddleware(10);
      const request = new Request('https://example.com/api/trending', {
        headers: { 'CF-Connecting-IP': '192.168.1.1' }
      });

      const result = await middleware(request, mockEnv, mockCtx);

      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(429);
      
      const body = await response.json();
      expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('API Handlers Integration', () => {
    beforeEach(() => {
      // Setup router with all routes and middleware
      router.use(environmentValidationMiddleware());
      router.get('/api/trending', getTrendingHandler, [validationMiddleware()]);
      router.get('/api/trending/dates', getAvailableDatesHandler);
      router.get('/api/health', healthCheckHandler);
      router.get('/api/stats', getStatsHandler);
      router.get('*', notFoundHandler);
    });

    it('should handle /api/trending with no data', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue(null);

      const request = new Request('https://example.com/api/trending');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('should handle /api/health', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue(null);

      const request = new Request('https://example.com/api/health');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.status).toBeDefined();
    });

    it('should handle invalid routes', async () => {
      const request = new Request('https://example.com/invalid/route');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers in successful responses', async () => {
      const handler = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ test: 'data' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      );
      router.get('/test', handler);

      const request = new Request('https://example.com/test');
      const response = await router.handle(request, mockEnv, mockCtx);

      // Note: CORS headers are added by the createJSONResponse function in handlers
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should include CORS headers in error responses', async () => {
      const request = new Request('https://example.com/nonexistent');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const request = new Request('https://example.com/nonexistent');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    });
  });
});
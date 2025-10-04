/**
 * Health Handlers Tests
 * Tests for health check API endpoints
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  handleHealthCheck,
  handleHealthStatus,
  handleMetrics,
  handleReadiness,
  handleLiveness,
  handleSystemInfo
} from '../src/health-handlers';

// Mock health monitor
vi.mock('../src/health-monitor', () => ({
  healthMonitor: {
    getBasicHealth: vi.fn(),
    getHealthStatus: vi.fn(),
    getMetrics: vi.fn()
  }
}));

import { healthMonitor } from '../src/health-monitor';

// Mock environment
const mockEnv = {
  TRENDING_KV: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    list: vi.fn()
  },
  GITHUB_TOKEN: 'test-token',
  ENVIRONMENT: 'test'
};

const mockCtx = {} as ExecutionContext;

describe('Health Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleHealthCheck', () => {
    it('should return basic health status', async () => {
      const mockHealth = {
        status: 'healthy',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 1000
      };

      (healthMonitor.getBasicHealth as any).mockReturnValue(mockHealth);

      const request = new Request('https://example.com/health');
      const response = await handleHealthCheck(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toMatchObject({
        status: 'ok',
        ...mockHealth
      });
    });

    it('should handle errors gracefully', async () => {
      (healthMonitor.getBasicHealth as any).mockImplementation(() => {
        throw new Error('Health check failed');
      });

      const request = new Request('https://example.com/health');
      const response = await handleHealthCheck(request, mockEnv, mockCtx);

      expect(response.status).toBe(503);
      
      const data = await response.json();
      expect(data.error.code).toBe('HEALTH_CHECK_FAILED');
    });
  });

  describe('handleHealthStatus', () => {
    it('should return comprehensive health status', async () => {
      const mockStatus = {
        status: 'healthy' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 1000,
        version: '1.0.0',
        environment: 'test',
        checks: {
          kv_storage: { status: 'pass' as const, timestamp: '2024-01-01T00:00:00.000Z' },
          github_api: { status: 'pass' as const, timestamp: '2024-01-01T00:00:00.000Z' }
        }
      };

      (healthMonitor.getHealthStatus as any).mockResolvedValue(mockStatus);

      const request = new Request('https://example.com/health/status');
      const response = await handleHealthStatus(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toMatchObject(mockStatus);
    });

    it('should return 200 for degraded status', async () => {
      const mockStatus = {
        status: 'degraded' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 1000,
        version: '1.0.0',
        environment: 'test',
        checks: {
          kv_storage: { status: 'pass' as const, timestamp: '2024-01-01T00:00:00.000Z' },
          github_api: { status: 'warn' as const, timestamp: '2024-01-01T00:00:00.000Z' }
        }
      };

      (healthMonitor.getHealthStatus as any).mockResolvedValue(mockStatus);

      const request = new Request('https://example.com/health/status');
      const response = await handleHealthStatus(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
    });

    it('should return 503 for unhealthy status', async () => {
      const mockStatus = {
        status: 'unhealthy' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 1000,
        version: '1.0.0',
        environment: 'test',
        checks: {
          kv_storage: { status: 'fail' as const, timestamp: '2024-01-01T00:00:00.000Z' },
          github_api: { status: 'fail' as const, timestamp: '2024-01-01T00:00:00.000Z' }
        }
      };

      (healthMonitor.getHealthStatus as any).mockResolvedValue(mockStatus);

      const request = new Request('https://example.com/health/status');
      const response = await handleHealthStatus(request, mockEnv, mockCtx);

      expect(response.status).toBe(503);
    });
  });

  describe('handleMetrics', () => {
    it('should return performance metrics', async () => {
      const mockMetrics = {
        requestCount: 100,
        errorCount: 5,
        averageResponseTime: 150.5,
        lastRequestTime: '2024-01-01T00:00:00.000Z'
      };

      (healthMonitor.getMetrics as any).mockReturnValue(mockMetrics);

      const request = new Request('https://example.com/health/metrics');
      const response = await handleMetrics(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.metrics).toMatchObject({
        ...mockMetrics,
        timestamp: expect.any(String),
        environment: 'test',
        version: '1.0.0'
      });
    });
  });

  describe('handleReadiness', () => {
    it('should return ready when all dependencies are available', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue('test-data');

      const request = new Request('https://example.com/health/ready');
      const response = await handleReadiness(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.ready).toBe(true);
      expect(data.checks).toHaveLength(2);
      expect(data.checks[0].name).toBe('kv_storage');
      expect(data.checks[0].status).toBe('ready');
      expect(data.checks[1].name).toBe('github_token');
      expect(data.checks[1].status).toBe('ready');
    });

    it('should return not ready when dependencies are unavailable', async () => {
      mockEnv.TRENDING_KV.get.mockRejectedValue(new Error('KV unavailable'));
      mockEnv.GITHUB_TOKEN = '';

      const request = new Request('https://example.com/health/ready');
      const response = await handleReadiness(request, mockEnv, mockCtx);

      expect(response.status).toBe(503);
      
      const data = await response.json();
      expect(data.ready).toBe(false);
      expect(data.checks.some((check: any) => check.status === 'not_ready')).toBe(true);
    });
  });

  describe('handleLiveness', () => {
    it('should return alive status', async () => {
      const request = new Request('https://example.com/health/live');
      const response = await handleLiveness(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.alive).toBe(true);
      expect(data.timestamp).toBeDefined();
      expect(data.uptime).toBeDefined();
    });
  });

  describe('handleSystemInfo', () => {
    it('should return system information', async () => {
      const request = new Request('https://example.com/health/info');
      const response = await handleSystemInfo(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.service).toBe('github-trending-api');
      expect(data.version).toBe('1.0.0');
      expect(data.environment).toBe('test');
      expect(data.runtime).toBe('Cloudflare Workers');
      expect(data.features).toBeDefined();
      expect(data.endpoints).toBeDefined();
    });

    it('should show correct feature availability', async () => {
      // Ensure GitHub token is available for this test
      const envWithToken = { ...mockEnv, GITHUB_TOKEN: 'test-token' };
      
      const request = new Request('https://example.com/health/info');
      const response = await handleSystemInfo(request, envWithToken, mockCtx);

      const data = await response.json();
      expect(data.features.github_api).toBe(true);
      expect(data.features.kv_storage).toBe(true);
      expect(data.features.scheduled_tasks).toBe(true);
      expect(data.features.cors_enabled).toBe(true);
      expect(data.features.rate_limiting).toBe(true);
    });
  });
});
/**
 * Health Monitor Tests
 * Tests for health check and monitoring functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthMonitor } from '../src/health-monitor';

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

// Mock fetch
global.fetch = vi.fn();

describe('HealthMonitor', () => {
  let healthMonitor: HealthMonitor;

  beforeEach(() => {
    healthMonitor = new HealthMonitor();
    vi.clearAllMocks();
  });

  describe('Basic Health Check', () => {
    it('should return basic health status', () => {
      const health = healthMonitor.getBasicHealth();
      
      expect(health).toHaveProperty('status', 'healthy');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('uptime');
      expect(typeof health.uptime).toBe('number');
    });
  });

  describe('Request Metrics', () => {
    it('should record request metrics correctly', () => {
      healthMonitor.recordRequest(100, false);
      healthMonitor.recordRequest(200, true);
      
      const metrics = healthMonitor.getMetrics();
      
      expect(metrics.requestCount).toBe(2);
      expect(metrics.errorCount).toBe(1);
      expect(metrics.averageResponseTime).toBe(150);
    });

    it('should maintain rolling average of response times', () => {
      // Add 101 requests to test rolling window
      for (let i = 0; i < 101; i++) {
        healthMonitor.recordRequest(i, false);
      }
      
      const metrics = healthMonitor.getMetrics();
      
      expect(metrics.requestCount).toBe(101);
      // Should only keep last 100 response times (1-100, not 0-99)
      expect(metrics.averageResponseTime).toBe(50.5); // Average of 1-100
    });
  });

  describe('Comprehensive Health Status', () => {
    it('should return healthy status when all checks pass', async () => {
      // Mock successful KV operation
      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        repositories: []
      }));

      // Mock successful GitHub API call
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          rate: { remaining: 1000 }
        })
      });

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.status).toBe('healthy');
      expect(status.checks).toHaveProperty('kv_storage');
      expect(status.checks).toHaveProperty('github_api');
      expect(status.checks).toHaveProperty('system_resources');
      expect(status.checks).toHaveProperty('data_freshness');
    });

    it('should return degraded status when some checks warn', async () => {
      // Mock successful KV operation
      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify({
        date: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString().split('T')[0], // 26 hours old
        repositories: []
      }));

      // Mock GitHub API with low rate limit
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          rate: { remaining: 50 }
        })
      });

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.status).toBe('degraded');
    });

    it('should return unhealthy status when checks fail', async () => {
      // Mock KV failure
      mockEnv.TRENDING_KV.get.mockRejectedValue(new Error('KV unavailable'));

      // Mock GitHub API failure
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.status).toBe('unhealthy');
      expect(status.checks.kv_storage.status).toBe('fail');
      expect(status.checks.github_api.status).toBe('fail');
    });
  });

  describe('KV Storage Check', () => {
    it('should pass when KV is accessible', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue('test-data');

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.kv_storage.status).toBe('pass');
      expect(status.checks.kv_storage.message).toContain('accessible');
    });

    it('should fail when KV is not accessible', async () => {
      mockEnv.TRENDING_KV.get.mockRejectedValue(new Error('Connection failed'));

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.kv_storage.status).toBe('fail');
      expect(status.checks.kv_storage.message).toContain('error');
    });
  });

  describe('GitHub API Check', () => {
    it('should pass when GitHub API is accessible with good rate limit', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          rate: { remaining: 1000 }
        })
      });

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.github_api.status).toBe('pass');
      expect(status.checks.github_api.message).toContain('1000 requests remaining');
    });

    it('should warn when rate limit is low', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          rate: { remaining: 50 }
        })
      });

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.github_api.status).toBe('warn');
    });

    it('should fail when GitHub API is not accessible', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.github_api.status).toBe('fail');
    });
  });

  describe('Data Freshness Check', () => {
    it('should pass when data is fresh', async () => {
      const today = new Date().toISOString().split('T')[0];
      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify({
        date: today,
        repositories: []
      }));

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.data_freshness.status).toBe('pass');
    });

    it('should warn when data is aging', async () => {
      const oldDate = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString().split('T')[0];
      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify({
        date: oldDate,
        repositories: []
      }));

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.data_freshness.status).toBe('warn');
    });

    it('should fail when data is stale', async () => {
      const staleDate = new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString().split('T')[0];
      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify({
        date: staleDate,
        repositories: []
      }));

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.data_freshness.status).toBe('fail');
    });

    it('should warn when no data is available', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue(null);

      const status = await healthMonitor.getHealthStatus(mockEnv);
      
      expect(status.checks.data_freshness.status).toBe('warn');
      expect(status.checks.data_freshness.message).toContain('No data available');
    });
  });

  describe('System Resources Check', () => {
    it('should pass with normal error rate', () => {
      healthMonitor.recordRequest(100, false);
      healthMonitor.recordRequest(100, false);
      
      const status = healthMonitor.getHealthStatus(mockEnv);
      
      // Should be synchronous for system resources
      expect(status).resolves.toHaveProperty('checks.system_resources.status', 'pass');
    });

    it('should warn with elevated error rate', () => {
      // Create 7% error rate
      for (let i = 0; i < 93; i++) {
        healthMonitor.recordRequest(100, false);
      }
      for (let i = 0; i < 7; i++) {
        healthMonitor.recordRequest(100, true);
      }
      
      const status = healthMonitor.getHealthStatus(mockEnv);
      
      expect(status).resolves.toHaveProperty('checks.system_resources.status', 'warn');
    });

    it('should fail with high error rate', () => {
      // Create 15% error rate
      for (let i = 0; i < 85; i++) {
        healthMonitor.recordRequest(100, false);
      }
      for (let i = 0; i < 15; i++) {
        healthMonitor.recordRequest(100, true);
      }
      
      const status = healthMonitor.getHealthStatus(mockEnv);
      
      expect(status).resolves.toHaveProperty('checks.system_resources.status', 'fail');
    });
  });
});
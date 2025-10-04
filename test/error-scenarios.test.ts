/**
 * Error Scenarios and Edge Cases Tests
 * Tests various error conditions and edge cases for robustness
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitHubApiClient } from '../src/github-client';
import { processRepositories, batchProcessRepositories } from '../src/data-processor';
import { StorageManager } from '../src/storage-manager';
import { Router } from '../src/router';
import { getTrendingHandler, healthCheckHandler } from '../src/api-handlers';
import { RetryMechanism } from '../src/retry-mechanism';

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

describe('Error Scenarios and Edge Cases', () => {
  let gitHubClient: GitHubApiClient;
  let storageManager: StorageManager;
  let router: Router;
  let retryMechanism: RetryMechanism;

  beforeEach(() => {
    vi.clearAllMocks();
    
    gitHubClient = new GitHubApiClient(mockEnv.GITHUB_TOKEN);
    storageManager = new StorageManager(mockEnv.TRENDING_KV);
    router = new Router();
    retryMechanism = new RetryMechanism();

    global.fetch = vi.fn();
  });

  describe('GitHub API Error Scenarios', () => {
    it('should handle GitHub API authentication errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({
          message: 'Bad credentials'
        })
      });

      try {
        await gitHubClient.searchTrendingRepositories('2024-01-01');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('AUTHENTICATION_ERROR');
      }
    });

    it('should handle GitHub API not found errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({
          message: 'Not Found'
        })
      });

      try {
        await gitHubClient.searchTrendingRepositories('2024-01-01');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('API_ERROR');
      }
    });

    it('should handle GitHub API server errors with retry', async () => {
      // Mock server error followed by success
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: 'Internal Server Error' })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          json: () => Promise.resolve({ message: 'Bad Gateway' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ items: [], total_count: 0 })
        });

      const result = await retryMechanism.executeWithRetry(
        () => gitHubClient.searchTrendingRepositories('2024-01-01'),
        'Test retry'
      );

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should handle GitHub API rate limiting with proper backoff', async () => {
      const resetTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Map([
          ['x-ratelimit-remaining', '0'],
          ['x-ratelimit-reset', String(resetTime)]
        ]),
        json: () => Promise.resolve({
          message: 'API rate limit exceeded'
        })
      });

      try {
        await gitHubClient.searchTrendingRepositories('2024-01-01');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('RATE_LIMIT_ERROR');
      }
    });

    it('should handle malformed GitHub API responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          // Missing 'items' field
          total_count: 0
        })
      });

      try {
        await gitHubClient.searchTrendingRepositories('2024-01-01');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it('should handle network connectivity issues', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network request failed'));

      try {
        await gitHubClient.searchTrendingRepositories('2024-01-01');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('NETWORK_ERROR');
      }
    });

    it('should handle request timeout', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Request timeout'));

      try {
        await gitHubClient.searchTrendingRepositories('2024-01-01');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('NETWORK_ERROR');
      }
    });
  });

  describe('Data Processing Error Scenarios', () => {
    it('should handle repositories with missing required fields', async () => {
      const invalidData = {
        items: [
          {
            id: 123,
            name: 'valid-repo',
            full_name: 'user/valid-repo',
            description: 'Valid repository',
            html_url: 'https://github.com/user/valid-repo',
            stargazers_count: 100,
            language: 'JavaScript',
            owner: {
              login: 'user',
              avatar_url: 'https://avatars.githubusercontent.com/u/123'
            }
          },
          {
            id: 456,
            // Missing required fields
            name: null,
            full_name: undefined,
            stargazers_count: 'invalid'
          },
          {
            id: 789,
            name: 'another-valid-repo',
            full_name: 'user/another-valid-repo',
            description: 'Another valid repository',
            html_url: 'https://github.com/user/another-valid-repo',
            stargazers_count: 50,
            language: 'TypeScript',
            owner: {
              login: 'user',
              avatar_url: 'https://avatars.githubusercontent.com/u/123'
            }
          }
        ]
      };

      const result = batchProcessRepositories(invalidData.items);

      expect(result.repositories).toHaveLength(2); // Only valid repos
      expect(result.repositories[0].name).toBe('valid-repo');
      expect(result.repositories[1].name).toBe('another-valid-repo');
    });

    it('should handle repositories with null/undefined values', async () => {
      const dataWithNulls = {
        items: [
          {
            id: 123,
            name: 'test-repo',
            full_name: 'user/test-repo',
            description: null, // Null description should be handled
            html_url: 'https://github.com/user/test-repo',
            stargazers_count: 100,
            language: null, // Null language should be handled
            owner: {
              login: 'user',
              avatar_url: null // Null avatar should be handled
            }
          }
        ]
      };

      const result = processRepositories(dataWithNulls.items);

      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('');
      expect(result[0].language).toBe('Unknown');
      expect(result[0].author.avatar).toBe('');
    });

    it('should handle extremely large repository data', async () => {
      const largeRepo = {
        id: 123,
        name: 'a'.repeat(1000), // Very long name
        full_name: 'user/' + 'a'.repeat(1000),
        description: 'b'.repeat(5000), // Very long description
        html_url: 'https://github.com/user/' + 'a'.repeat(1000),
        stargazers_count: 999999999,
        language: 'JavaScript',
        owner: {
          login: 'user',
          avatar_url: 'https://avatars.githubusercontent.com/u/123'
        }
      };

      const result = processRepositories([largeRepo]);

      expect(result).toHaveLength(1);
      // Data should be processed normally (truncation would be in cleaning step)
      expect(result[0].name).toBe(largeRepo.name);
      expect(result[0].description).toBe(largeRepo.description);
    });

    it('should handle special characters in repository data', async () => {
      const repoWithSpecialChars = {
        id: 123,
        name: 'test-repo-🚀',
        full_name: 'user/test-repo-🚀',
        description: 'A repo with émojis and spëcial chars: <script>alert("xss")</script>',
        html_url: 'https://github.com/user/test-repo-🚀',
        stargazers_count: 100,
        language: 'JavaScript',
        owner: {
          login: 'user-🎯',
          avatar_url: 'https://avatars.githubusercontent.com/u/123'
        }
      };

      const result = processRepositories([repoWithSpecialChars]);

      expect(result).toHaveLength(1);
      // Basic processing should preserve the data (sanitization would be in cleaning step)
      expect(result[0].name).toBe(repoWithSpecialChars.name);
      expect(result[0].description).toBe(repoWithSpecialChars.description);
    });
  });

  describe('Storage Error Scenarios', () => {
    it('should handle KV storage unavailable', async () => {
      mockEnv.TRENDING_KV.put.mockRejectedValue(new Error('KV storage unavailable'));

      const testData = {
        date: '2024-01-01',
        repositories: [],
        total: 0
      };

      try {
        await storageManager.storeTrendingData('2024-01-01', []);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('KV storage unavailable');
      }
    });

    it('should handle KV storage quota exceeded', async () => {
      mockEnv.TRENDING_KV.put.mockRejectedValue(new Error('Storage quota exceeded'));

      const testData = {
        date: '2024-01-01',
        repositories: [],
        total: 0
      };

      try {
        await storageManager.storeTrendingData('2024-01-01', []);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Storage quota exceeded');
      }
    });

    it('should handle corrupted data in storage', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue('invalid-json-data');

      try {
        await storageManager.getTrendingData('2024-01-01');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Failed to retrieve trending data');
      }
    });

    it('should handle storage read timeouts', async () => {
      mockEnv.TRENDING_KV.get.mockRejectedValue(new Error('Read timeout'));

      try {
        await storageManager.getTrendingData('2024-01-01');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Read timeout');
      }
    });

    it('should handle storage write timeouts', async () => {
      mockEnv.TRENDING_KV.put.mockRejectedValue(new Error('Write timeout'));

      const testData = {
        date: '2024-01-01',
        repositories: [],
        total: 0
      };

      try {
        await storageManager.storeTrendingData('2024-01-01', []);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Write timeout');
      }
    });
  });

  describe('API Endpoint Error Scenarios', () => {
    beforeEach(() => {
      router.get('/api/trending', getTrendingHandler);
      router.get('/api/health', healthCheckHandler);
    });

    it('should handle malformed request URLs', async () => {
      const request = new Request('https://api.example.com/api/trending?date=invalid-date-format');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(400);
      
      const errorData = await response.json();
      expect(errorData.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle requests with invalid query parameters', async () => {
      const request = new Request('https://api.example.com/api/trending?invalid=param&another=invalid');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(400);
      
      const errorData = await response.json();
      expect(errorData.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle requests with extremely long URLs', async () => {
      const longParam = 'a'.repeat(10000);
      const request = new Request(`https://api.example.com/api/trending?param=${longParam}`);
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(400);
      
      const errorData = await response.json();
      expect(errorData.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle concurrent requests with storage failures', async () => {
      mockEnv.TRENDING_KV.get.mockRejectedValue(new Error('Storage failure'));

      const requests = Array.from({ length: 5 }, () =>
        router.handle(
          new Request('https://api.example.com/api/trending'),
          mockEnv,
          mockCtx
        )
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(500);
      });
    });

    it('should handle health check when storage is unavailable', async () => {
      mockEnv.TRENDING_KV.get.mockRejectedValue(new Error('Storage unavailable'));

      const request = new Request('https://api.example.com/api/health');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(503);
      
      const healthData = await response.json();
      expect(healthData.status).toBe('unhealthy');
      expect(healthData.checks.storage.status).toBe('fail');
    });
  });

  describe('Mobile App Integration Error Scenarios', () => {
    beforeEach(() => {
      router.get('/api/trending', getTrendingHandler);
    });

    it('should handle mobile app requests with invalid headers', async () => {
      const request = new Request('https://api.example.com/api/trending', {
        headers: {
          'Content-Type': 'invalid/type',
          'Accept': 'invalid/accept'
        }
      });

      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify({
        date: '2024-01-01',
        repositories: [],
        total: 0
      }));

      const response = await router.handle(request, mockEnv, mockCtx);

      // Should still work despite invalid headers
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should handle mobile app requests during maintenance', async () => {
      // Simulate maintenance mode
      mockEnv.TRENDING_KV.get.mockRejectedValue(new Error('Service temporarily unavailable'));

      const request = new Request('https://api.example.com/api/trending', {
        headers: {
          'User-Agent': 'HarmonyOS-App/1.0'
        }
      });

      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(503);
      
      const errorData = await response.json();
      expect(errorData.error.code).toBe('SERVICE_UNAVAILABLE');
      expect(errorData.error.message).toContain('temporarily unavailable');
    });

    it('should handle mobile app requests with network interruptions', async () => {
      // Simulate partial data corruption
      mockEnv.TRENDING_KV.get.mockResolvedValue('{"date":"2024-01-01","repositories":[{"id":"123","name":"test"'); // Truncated JSON

      const request = new Request('https://api.example.com/api/trending');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(500);
      
      const errorData = await response.json();
      expect(errorData.error.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle empty GitHub API responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          items: [],
          total_count: 0
        })
      });

      const result = await gitHubClient.searchTrendingRepositories('2024-01-01');

      expect(result.items).toHaveLength(0);
    });

    it('should handle date edge cases (leap year, month boundaries)', async () => {
      const edgeDates = [
        '2024-02-29', // Leap year
        '2024-02-30', // Invalid date
        '2024-13-01', // Invalid month
        '2024-12-32', // Invalid day
      ];

      router.get('/api/trending', getTrendingHandler);

      for (const date of edgeDates) {
        const request = new Request(`https://api.example.com/api/trending?date=${date}`);
        const response = await router.handle(request, mockEnv, mockCtx);

        if (date === '2024-02-29') {
          // Valid leap year date - should validate properly
          expect([200, 404]).toContain(response.status);
        } else {
          // Invalid dates should return validation error
          expect(response.status).toBe(400);
        }
      }
    });

    it('should handle timezone edge cases', async () => {
      const now = new Date();
      const utcDate = now.toISOString().split('T')[0];
      
      // Test with current UTC date
      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify({
        date: utcDate,
        repositories: [],
        total: 0
      }));

      router.get('/api/trending', getTrendingHandler);

      const request = new Request(`https://api.example.com/api/trending?date=${utcDate}`);
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
    });

    it('should handle maximum payload sizes', async () => {
      // Create a very large repository dataset
      const largeRepositories = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i),
        name: `repo-${i}`,
        fullName: `user/repo-${i}`,
        description: 'A'.repeat(500), // Large description
        url: `https://github.com/user/repo-${i}`,
        stars: i,
        language: 'JavaScript',
        author: {
          name: 'user',
          avatar: 'https://avatars.githubusercontent.com/u/123'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z'
      }));

      const largeData = {
        date: '2024-01-01',
        repositories: largeRepositories,
        total: 1000,
        updatedAt: '2024-01-01T10:00:00Z'
      };

      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify(largeData));
      router.get('/api/trending', getTrendingHandler);

      const request = new Request('https://api.example.com/api/trending');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const responseData = await response.json();
      expect(responseData.repositories).toHaveLength(1000);
    });
  });
});
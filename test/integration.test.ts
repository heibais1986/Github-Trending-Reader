/**
 * End-to-End Integration Tests
 * Tests the complete data flow from GitHub API to mobile app
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GitHubApiClient } from '../src/github-client';
import { processRepositories, batchProcessRepositories } from '../src/data-processor';
import { StorageManager } from '../src/storage-manager';
import { Router } from '../src/router';
import { getTrendingHandler } from '../src/api-handlers';
import { ScheduledTaskHandler } from '../src/scheduled-task';

// Mock environment for integration tests
const mockEnv = {
  TRENDING_KV: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
  },
  GITHUB_TOKEN: 'test-github-token',
};

const mockCtx = {
  waitUntil: vi.fn(),
  passThroughOnException: vi.fn(),
};

// Mock GitHub API responses
const mockGitHubResponse = {
  items: [
    {
      id: 123456,
      name: 'awesome-project',
      full_name: 'user/awesome-project',
      description: 'An awesome open source project',
      html_url: 'https://github.com/user/awesome-project',
      stargazers_count: 1500,
      language: 'TypeScript',
      owner: {
        login: 'user',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456'
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T12:00:00Z'
    },
    {
      id: 789012,
      name: 'cool-library',
      full_name: 'dev/cool-library',
      description: 'A cool utility library',
      html_url: 'https://github.com/dev/cool-library',
      stargazers_count: 850,
      language: 'JavaScript',
      owner: {
        login: 'dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/789012'
      },
      created_at: '2024-01-01T06:00:00Z',
      updated_at: '2024-01-01T18:00:00Z'
    }
  ],
  total_count: 2
};

describe('End-to-End Integration Tests', () => {
  let gitHubClient: GitHubApiClient;
  let storageManager: StorageManager;
  let router: Router;
  let scheduledTask: ScheduledTaskHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    
    gitHubClient = new GitHubApiClient(mockEnv.GITHUB_TOKEN);
    storageManager = new StorageManager(mockEnv.TRENDING_KV);
    router = new Router();
    scheduledTask = new ScheduledTaskHandler(mockEnv.GITHUB_TOKEN, mockEnv.TRENDING_KV);

    // Mock fetch for GitHub API calls
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complete Data Flow - GitHub to Storage', () => {
    it('should successfully fetch, process, and store trending repositories', async () => {
      // Mock successful GitHub API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockGitHubResponse)
      });

      // Mock storage operations
      mockEnv.TRENDING_KV.put.mockResolvedValue(undefined);

      // Execute the complete data flow
      const result = await scheduledTask.executeDailyScrapingTask(Date.now(), mockCtx);

      expect(result.success).toBe(true);
      expect(result.repositoriesProcessed).toBe(2);

      // Verify GitHub API was called
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.github.com/search/repositories'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'token test-github-token'
          })
        })
      );

      // Verify data was stored
      expect(mockEnv.TRENDING_KV.put).toHaveBeenCalledWith(
        expect.stringMatching(/^trending:\d{4}-\d{2}-\d{2}$/),
        expect.stringContaining('awesome-project')
      );

      expect(mockEnv.TRENDING_KV.put).toHaveBeenCalledWith(
        'trending:latest',
        expect.stringContaining('awesome-project')
      );
    });

    it('should handle GitHub API rate limiting gracefully', async () => {
      // Mock rate limit response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Map([
          ['x-ratelimit-remaining', '0'],
          ['x-ratelimit-reset', String(Math.floor(Date.now() / 1000) + 3600)]
        ]),
        json: () => Promise.resolve({
          message: 'API rate limit exceeded'
        })
      });

      try {
        await scheduledTask.executeDailyScrapingTask(Date.now(), mockCtx);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(mockEnv.TRENDING_KV.put).not.toHaveBeenCalled();
      }
    });

    it('should handle GitHub API errors with retry mechanism', async () => {
      // Mock initial failure then success
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: 'Internal Server Error' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockGitHubResponse)
        });

      const result = await scheduledTask.executeDailyScrapingTask(Date.now(), mockCtx);

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(mockEnv.TRENDING_KV.put).toHaveBeenCalled();
    });
  });

  describe('Complete API Flow - Storage to Client', () => {
    it('should serve trending data to mobile app successfully', async () => {
      // Mock stored data
      const storedData = {
        date: '2024-01-01',
        repositories: [
          {
            id: '123456',
            name: 'awesome-project',
            fullName: 'user/awesome-project',
            description: 'An awesome open source project',
            url: 'https://github.com/user/awesome-project',
            stars: 1500,
            language: 'TypeScript',
            author: {
              name: 'user',
              avatar: 'https://avatars.githubusercontent.com/u/123456'
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T12:00:00Z'
          }
        ],
        total: 1,
        updatedAt: '2024-01-01T10:00:00Z'
      };

      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify(storedData));

      // Setup router with handler
      router.get('/api/trending', getTrendingHandler);

      // Make API request
      const request = new Request('https://api.example.com/api/trending');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const responseData = await response.json();
      expect(responseData.date).toBe('2024-01-01');
      expect(responseData.repositories).toHaveLength(1);
      expect(responseData.repositories[0].name).toBe('awesome-project');
      expect(responseData.total).toBe(1);

      // Verify CORS headers for mobile app
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should handle historical data requests', async () => {
      const historicalData = {
        date: '2024-01-01',
        repositories: [],
        total: 0,
        updatedAt: '2024-01-01T10:00:00Z'
      };

      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify(historicalData));

      router.get('/api/trending', getTrendingHandler);

      const request = new Request('https://api.example.com/api/trending?date=2024-01-01');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      expect(mockEnv.TRENDING_KV.get).toHaveBeenCalledWith('trending:2024-01-01');
    });

    it('should return 404 for missing data', async () => {
      mockEnv.TRENDING_KV.get.mockResolvedValue(null);

      router.get('/api/trending', getTrendingHandler);

      const request = new Request('https://api.example.com/api/trending?date=2024-01-01');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(404);
      
      const errorData = await response.json();
      expect(errorData.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Error Scenarios Integration', () => {
    it('should handle storage failures during data collection', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockGitHubResponse)
      });

      // Mock storage failure
      mockEnv.TRENDING_KV.put.mockRejectedValue(new Error('Storage unavailable'));

      try {
        await scheduledTask.executeDailyScrapingTask(Date.now(), mockCtx);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle malformed data in storage', async () => {
      // Mock corrupted data
      mockEnv.TRENDING_KV.get.mockResolvedValue('invalid-json');

      router.get('/api/trending', getTrendingHandler);

      const request = new Request('https://api.example.com/api/trending');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(500);
      
      const errorData = await response.json();
      expect(errorData.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle network timeouts gracefully', async () => {
      // Mock network timeout
      (global.fetch as any).mockRejectedValue(new Error('Network timeout'));

      try {
        await scheduledTask.executeDailyScrapingTask(Date.now(), mockCtx);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Data Consistency and Validation', () => {
    it('should validate repository data structure', async () => {
      const invalidGitHubResponse = {
        items: [
          {
            id: 123456,
            name: 'test-repo',
            // Missing required fields
            stargazers_count: 'invalid-number',
            owner: null
          }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(invalidGitHubResponse)
      });

      try {
        await scheduledTask.executeDailyScrapingTask(Date.now(), mockCtx);
        expect.fail('Should have thrown an error due to invalid data');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should maintain data consistency across updates', async () => {
      // First update
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockGitHubResponse)
      });

      mockEnv.TRENDING_KV.put.mockResolvedValue(undefined);

      await scheduledTask.executeDailyScrapingTask(Date.now(), mockCtx);

      // Verify both current and latest keys are updated
      expect(mockEnv.TRENDING_KV.put).toHaveBeenCalledWith(
        expect.stringMatching(/^trending:\d{4}-\d{2}-\d{2}$/),
        expect.any(String),
        expect.any(Object)
      );
      expect(mockEnv.TRENDING_KV.put).toHaveBeenCalledWith(
        'trending:latest',
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large datasets efficiently', async () => {
      // Create large mock response
      const largeResponse = {
        items: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `repo-${i}`,
          full_name: `user/repo-${i}`,
          description: `Repository ${i}`,
          html_url: `https://github.com/user/repo-${i}`,
          stargazers_count: 1000 - i,
          language: i % 2 === 0 ? 'TypeScript' : 'JavaScript',
          owner: {
            login: 'user',
            avatar_url: 'https://avatars.githubusercontent.com/u/123456'
          },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T12:00:00Z'
        })),
        total_count: 100
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(largeResponse)
      });

      mockEnv.TRENDING_KV.put.mockResolvedValue(undefined);

      const startTime = Date.now();
      const result = await scheduledTask.executeDailyScrapingTask(Date.now(), mockCtx);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(result.repositoriesProcessed).toBe(100);
      
      // Should complete within reasonable time (5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should handle concurrent API requests', async () => {
      const storedData = {
        date: '2024-01-01',
        repositories: [mockGitHubResponse.items[0]],
        total: 1,
        updatedAt: '2024-01-01T10:00:00Z'
      };

      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify(storedData));
      router.get('/api/trending', getTrendingHandler);

      // Make multiple concurrent requests
      const requests = Array.from({ length: 10 }, () => 
        router.handle(
          new Request('https://api.example.com/api/trending'),
          mockEnv,
          mockCtx
        )
      );

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Storage should be accessed for each request
      expect(mockEnv.TRENDING_KV.get).toHaveBeenCalledTimes(10);
    });
  });

  describe('Mobile App Integration Scenarios', () => {
    it('should handle mobile app startup data request', async () => {
      const currentData = {
        date: new Date().toISOString().split('T')[0],
        repositories: mockGitHubResponse.items.map(item => ({
          id: String(item.id),
          name: item.name,
          fullName: item.full_name,
          description: item.description,
          url: item.html_url,
          stars: item.stargazers_count,
          language: item.language,
          author: {
            name: item.owner.login,
            avatar: item.owner.avatar_url
          },
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })),
        total: 2,
        updatedAt: new Date().toISOString()
      };

      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify(currentData));
      router.get('/api/trending', getTrendingHandler);

      const request = new Request('https://api.example.com/api/trending', {
        headers: {
          'User-Agent': 'HarmonyOS-App/1.0',
          'Accept': 'application/json'
        }
      });

      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.repositories).toHaveLength(2);
      expect(data.repositories[0]).toHaveProperty('id');
      expect(data.repositories[0]).toHaveProperty('name');
      expect(data.repositories[0]).toHaveProperty('stars');
      expect(data.repositories[0].author).toHaveProperty('name');
      expect(data.repositories[0].author).toHaveProperty('avatar');
    });

    it('should handle mobile app refresh request', async () => {
      // Simulate app requesting fresh data
      mockEnv.TRENDING_KV.get.mockResolvedValue(null); // No cached data

      router.get('/api/trending', getTrendingHandler);

      const request = new Request('https://api.example.com/api/trending', {
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'HarmonyOS-App/1.0'
        }
      });

      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(404);
      
      const errorData = await response.json();
      expect(errorData.error.code).toBe('NOT_FOUND');
      expect(errorData.error.message).toContain('No trending data available');
    });

    it('should validate response format for mobile app compatibility', async () => {
      const mobileCompatibleData = {
        date: '2024-01-01',
        repositories: [{
          id: '123456',
          name: 'test-repo',
          fullName: 'user/test-repo',
          description: 'Test repository',
          url: 'https://github.com/user/test-repo',
          stars: 100,
          language: 'TypeScript',
          author: {
            name: 'user',
            avatar: 'https://avatars.githubusercontent.com/u/123456'
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T12:00:00Z'
        }],
        total: 1,
        updatedAt: '2024-01-01T10:00:00Z'
      };

      mockEnv.TRENDING_KV.get.mockResolvedValue(JSON.stringify(mobileCompatibleData));
      router.get('/api/trending', getTrendingHandler);

      const request = new Request('https://api.example.com/api/trending');
      const response = await router.handle(request, mockEnv, mockCtx);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      
      // Validate mobile app expected structure
      expect(data).toHaveProperty('date');
      expect(data).toHaveProperty('repositories');
      expect(data).toHaveProperty('total');
      expect(data.repositories[0]).toHaveProperty('id');
      expect(data.repositories[0]).toHaveProperty('name');
      expect(data.repositories[0]).toHaveProperty('fullName');
      expect(data.repositories[0]).toHaveProperty('description');
      expect(data.repositories[0]).toHaveProperty('url');
      expect(data.repositories[0]).toHaveProperty('stars');
      expect(data.repositories[0]).toHaveProperty('language');
      expect(data.repositories[0].author).toHaveProperty('name');
      expect(data.repositories[0].author).toHaveProperty('avatar');
      expect(data.repositories[0]).toHaveProperty('createdAt');
      expect(data.repositories[0]).toHaveProperty('updatedAt');
    });
  });
});
/**
 * Unit tests for GitHub API Client
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  GitHubApiClient, 
  GitHubClientError, 
  isValidDateFormat, 
  getYesterdayDate,
  type GitHubSearchResponse 
} from '../src/github-client';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GitHubApiClient', () => {
  let client: GitHubApiClient;
  const mockToken = 'test-token-123';

  beforeEach(() => {
    client = new GitHubApiClient(mockToken);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchTrendingRepositories', () => {
    const mockSuccessResponse: GitHubSearchResponse = {
      total_count: 2,
      incomplete_results: false,
      items: [
        {
          id: 1,
          name: 'test-repo',
          full_name: 'user/test-repo',
          description: 'A test repository',
          html_url: 'https://github.com/user/test-repo',
          stargazers_count: 100,
          language: 'TypeScript',
          owner: {
            login: 'user',
            avatar_url: 'https://github.com/user.png',
          },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T12:00:00Z',
        },
        {
          id: 2,
          name: 'another-repo',
          full_name: 'user2/another-repo',
          description: null,
          html_url: 'https://github.com/user2/another-repo',
          stargazers_count: 50,
          language: 'JavaScript',
          owner: {
            login: 'user2',
            avatar_url: 'https://github.com/user2.png',
          },
          created_at: '2024-01-01T06:00:00Z',
          updated_at: '2024-01-01T18:00:00Z',
        },
      ],
    };

    it('should successfully fetch trending repositories', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const result = await client.searchTrendingRepositories('2024-01-01');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/repositories'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Trending-Worker/1.0',
          }),
        })
      );

      expect(result).toEqual(mockSuccessResponse);
    });

    it('should construct correct search query with date and parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      await client.searchTrendingRepositories('2024-01-01', 25);

      const calledUrl = mockFetch.mock.calls[0][0] as string;
      const url = new URL(calledUrl);
      
      expect(url.searchParams.get('q')).toBe('created:>2024-01-01 stars:>10');
      expect(url.searchParams.get('sort')).toBe('stars');
      expect(url.searchParams.get('order')).toBe('desc');
      expect(url.searchParams.get('per_page')).toBe('25');
    });

    it('should handle authentication errors (401)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Bad credentials' }),
      });

      await expect(client.searchTrendingRepositories('2024-01-01'))
        .rejects.toThrow(GitHubClientError);

      try {
        await client.searchTrendingRepositories('2024-01-01');
      } catch (error) {
        expect(error).toBeInstanceOf(GitHubClientError);
        expect((error as GitHubClientError).code).toBe('AUTHENTICATION_ERROR');
        expect((error as GitHubClientError).message).toBe('Invalid or missing GitHub token');
      }
    });

    it('should handle rate limit errors (403)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => ({ 
          message: 'API rate limit exceeded',
          documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting'
        }),
      });

      await expect(client.searchTrendingRepositories('2024-01-01'))
        .rejects.toThrow(GitHubClientError);

      try {
        await client.searchTrendingRepositories('2024-01-01');
      } catch (error) {
        expect(error).toBeInstanceOf(GitHubClientError);
        expect((error as GitHubClientError).code).toBe('RATE_LIMIT_ERROR');
        expect((error as GitHubClientError).message).toBe('GitHub API rate limit exceeded');
      }
    });

    it('should handle validation errors (422)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: async () => ({ message: 'Validation Failed' }),
      });

      await expect(client.searchTrendingRepositories('invalid-date'))
        .rejects.toThrow(GitHubClientError);

      try {
        await client.searchTrendingRepositories('invalid-date');
      } catch (error) {
        expect(error).toBeInstanceOf(GitHubClientError);
        expect((error as GitHubClientError).code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle service unavailable errors (503)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: async () => ({ message: 'Service Unavailable' }),
      });

      await expect(client.searchTrendingRepositories('2024-01-01'))
        .rejects.toThrow(GitHubClientError);

      try {
        await client.searchTrendingRepositories('2024-01-01');
      } catch (error) {
        expect(error).toBeInstanceOf(GitHubClientError);
        expect((error as GitHubClientError).code).toBe('SERVICE_UNAVAILABLE');
      }
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network connection failed'));

      await expect(client.searchTrendingRepositories('2024-01-01'))
        .rejects.toThrow(GitHubClientError);

      try {
        await client.searchTrendingRepositories('2024-01-01');
      } catch (error) {
        expect(error).toBeInstanceOf(GitHubClientError);
        expect((error as GitHubClientError).code).toBe('NETWORK_ERROR');
        expect((error as GitHubClientError).message).toBe('Failed to connect to GitHub API');
      }
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => { throw new Error('Invalid JSON'); },
      });

      await expect(client.searchTrendingRepositories('2024-01-01'))
        .rejects.toThrow(GitHubClientError);
    });
  });

  describe('GitHubClientError', () => {
    it('should create error with correct properties', () => {
      const error = new GitHubClientError('TEST_ERROR', 'Test message', 'Test details');
      
      expect(error.name).toBe('GitHubClientError');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test message');
      expect(error.details).toBe('Test details');
    });

    it('should convert to JSON format', () => {
      const error = new GitHubClientError('TEST_ERROR', 'Test message', 'Test details');
      const json = error.toJSON();
      
      expect(json).toHaveProperty('error');
      expect(json.error.code).toBe('TEST_ERROR');
      expect(json.error.message).toBe('Test message');
      expect(json.error.details).toBe('Test details');
      expect(json).toHaveProperty('timestamp');
      expect(typeof json.timestamp).toBe('string');
    });
  });
});

describe('Utility Functions', () => {
  describe('isValidDateFormat', () => {
    it('should validate correct date formats', () => {
      expect(isValidDateFormat('2024-01-01')).toBe(true);
      expect(isValidDateFormat('2023-12-31')).toBe(true);
      expect(isValidDateFormat('2024-02-29')).toBe(true); // Leap year
    });

    it('should reject invalid date formats', () => {
      expect(isValidDateFormat('2024-1-1')).toBe(false);
      expect(isValidDateFormat('24-01-01')).toBe(false);
      expect(isValidDateFormat('2024/01/01')).toBe(false);
      expect(isValidDateFormat('2024-13-01')).toBe(false);
      expect(isValidDateFormat('2024-01-32')).toBe(false);
      expect(isValidDateFormat('invalid-date')).toBe(false);
      expect(isValidDateFormat('')).toBe(false);
    });
  });

  describe('getYesterdayDate', () => {
    it('should return yesterday\'s date in YYYY-MM-DD format', () => {
      const yesterday = getYesterdayDate();
      
      expect(yesterday).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(isValidDateFormat(yesterday)).toBe(true);
      
      // Verify it's actually yesterday
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - 1);
      const expected = expectedDate.toISOString().split('T')[0];
      
      expect(yesterday).toBe(expected);
    });
  });
});
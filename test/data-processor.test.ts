/**
 * Unit tests for Data Processing and Transformation Logic
 */

import { describe, it, expect } from 'vitest';
import {
  transformRepository,
  processRepositories,
  createTrendingResponse,
  validateRepository,
  cleanRepository,
  batchProcessRepositories,
  getLanguageColor,
  formatStarCount,
  type Repository,
  type ProcessingOptions,
} from '../src/data-processor';
import type { GitHubRepository } from '../src/github-client';

// Mock data for testing
const mockGitHubRepo: GitHubRepository = {
  id: 123456,
  name: 'awesome-project',
  full_name: 'user/awesome-project',
  description: 'An awesome open source project',
  html_url: 'https://github.com/user/awesome-project',
  stargazers_count: 1500,
  language: 'TypeScript',
  owner: {
    login: 'user',
    avatar_url: 'https://github.com/user.png',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T12:00:00Z',
};

const mockGitHubRepoWithNulls: GitHubRepository = {
  id: 789012,
  name: 'another-project',
  full_name: 'user2/another-project',
  description: null,
  html_url: 'https://github.com/user2/another-project',
  stargazers_count: 50,
  language: null,
  owner: {
    login: 'user2',
    avatar_url: 'https://github.com/user2.png',
  },
  created_at: '2024-01-02T00:00:00Z',
  updated_at: '2024-01-16T12:00:00Z',
};

describe('Data Processor', () => {
  describe('transformRepository', () => {
    it('should transform GitHub repository to application format', () => {
      const result = transformRepository(mockGitHubRepo);

      expect(result).toEqual({
        id: '123456',
        name: 'awesome-project',
        fullName: 'user/awesome-project',
        description: 'An awesome open source project',
        url: 'https://github.com/user/awesome-project',
        stars: 1500,
        language: 'TypeScript',
        author: {
          name: 'user',
          avatar: 'https://github.com/user.png',
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      });
    });

    it('should handle null values in GitHub repository data', () => {
      const result = transformRepository(mockGitHubRepoWithNulls);

      expect(result.description).toBe('');
      expect(result.language).toBe('Unknown');
    });

    it('should convert numeric ID to string', () => {
      const result = transformRepository(mockGitHubRepo);
      expect(typeof result.id).toBe('string');
      expect(result.id).toBe('123456');
    });
  });

  describe('processRepositories', () => {
    const mockRepos: GitHubRepository[] = [
      {
        ...mockGitHubRepo,
        id: 1,
        stargazers_count: 2000,
        language: 'TypeScript',
      },
      {
        ...mockGitHubRepo,
        id: 2,
        stargazers_count: 1000,
        language: 'JavaScript',
      },
      {
        ...mockGitHubRepo,
        id: 3,
        stargazers_count: 500,
        language: 'Python',
      },
      {
        ...mockGitHubRepo,
        id: 4,
        stargazers_count: 100,
        language: 'Java',
      },
    ];

    it('should process repositories with default options', () => {
      const result = processRepositories(mockRepos);

      expect(result).toHaveLength(4);
      expect(result[0].stars).toBe(2000); // Should be sorted by stars descending
      expect(result[1].stars).toBe(1000);
      expect(result[2].stars).toBe(500);
      expect(result[3].stars).toBe(100);
    });

    it('should filter by minimum stars', () => {
      const options: ProcessingOptions = { minStars: 800 };
      const result = processRepositories(mockRepos, options);

      expect(result).toHaveLength(2);
      expect(result.every(repo => repo.stars >= 800)).toBe(true);
    });

    it('should limit maximum repositories', () => {
      const options: ProcessingOptions = { maxRepositories: 2 };
      const result = processRepositories(mockRepos, options);

      expect(result).toHaveLength(2);
      expect(result[0].stars).toBe(2000); // Should still be sorted
      expect(result[1].stars).toBe(1000);
    });

    it('should exclude specified languages', () => {
      const options: ProcessingOptions = { excludeLanguages: ['javascript', 'python'] };
      const result = processRepositories(mockRepos, options);

      expect(result).toHaveLength(2);
      expect(result.every(repo => 
        !['JavaScript', 'Python'].includes(repo.language)
      )).toBe(true);
    });

    it('should include only specified languages', () => {
      const options: ProcessingOptions = { includeLanguages: ['typescript', 'javascript'] };
      const result = processRepositories(mockRepos, options);

      expect(result).toHaveLength(2);
      expect(result.every(repo => 
        ['TypeScript', 'JavaScript'].includes(repo.language)
      )).toBe(true);
    });

    it('should handle empty repository array', () => {
      const result = processRepositories([]);
      expect(result).toEqual([]);
    });
  });

  describe('createTrendingResponse', () => {
    it('should create trending response with correct structure', () => {
      const repositories = [transformRepository(mockGitHubRepo)];
      const date = '2024-01-01';
      
      const result = createTrendingResponse(repositories, date);

      expect(result.date).toBe(date);
      expect(result.repositories).toEqual(repositories);
      expect(result.total).toBe(1);
      expect(result.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle empty repositories array', () => {
      const result = createTrendingResponse([], '2024-01-01');

      expect(result.repositories).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('validateRepository', () => {
    const validRepo: Repository = {
      id: '123',
      name: 'test-repo',
      fullName: 'user/test-repo',
      description: 'Test repository',
      url: 'https://github.com/user/test-repo',
      stars: 100,
      language: 'TypeScript',
      author: {
        name: 'user',
        avatar: 'https://github.com/user.png',
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T12:00:00Z',
    };

    it('should validate correct repository data', () => {
      const result = validateRepository(validRepo);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect missing required fields', () => {
      const invalidRepo = { ...validRepo, id: '', name: '' };
      const result = validateRepository(invalidRepo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Repository ID is required');
      expect(result.errors).toContain('Repository name is required');
    });

    it('should validate URL format', () => {
      const invalidRepo = { ...validRepo, url: 'invalid-url' };
      const result = validateRepository(invalidRepo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid repository URL is required');
    });

    it('should validate stars as non-negative number', () => {
      const invalidRepo = { ...validRepo, stars: -10 };
      const result = validateRepository(invalidRepo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stars count must be a non-negative number');
    });

    it('should validate ISO date format', () => {
      const invalidRepo = { ...validRepo, createdAt: '2024-01-01' };
      const result = validateRepository(invalidRepo);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid created date is required');
    });
  });

  describe('cleanRepository', () => {
    it('should sanitize string fields', () => {
      const dirtyRepo: Repository = {
        id: '123',
        name: '  test-repo  ',
        fullName: 'user/test-repo   ',
        description: '  Multiple   spaces   here  ',
        url: 'https://github.com/user/test-repo',
        stars: 100.7,
        language: '  TypeScript  ',
        author: {
          name: '  user  ',
          avatar: '  https://github.com/user.png  ',
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
      };

      const result = cleanRepository(dirtyRepo);

      expect(result.name).toBe('test-repo');
      expect(result.fullName).toBe('user/test-repo');
      expect(result.description).toBe('Multiple spaces here');
      expect(result.language).toBe('TypeScript');
      expect(result.author.name).toBe('user');
      expect(result.author.avatar).toBe('https://github.com/user.png');
      expect(result.stars).toBe(100); // Should be floored
    });

    it('should handle empty language', () => {
      const repo: Repository = {
        id: '123',
        name: 'test',
        fullName: 'user/test',
        description: 'test',
        url: 'https://github.com/user/test',
        stars: 100,
        language: '',
        author: { name: 'user', avatar: 'https://github.com/user.png' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
      };

      const result = cleanRepository(repo);
      expect(result.language).toBe('Unknown');
    });
  });

  describe('batchProcessRepositories', () => {
    const mockRepos: GitHubRepository[] = [
      mockGitHubRepo,
      mockGitHubRepoWithNulls,
      {
        ...mockGitHubRepo,
        id: 999,
        name: '', // Invalid - empty name
        html_url: 'invalid-url', // Invalid URL
      },
    ];

    it('should process valid repositories and collect errors', () => {
      const result = batchProcessRepositories(mockRepos);

      expect(result.totalProcessed).toBe(3);
      expect(result.totalValid).toBe(2);
      expect(result.totalErrors).toBe(1);
      expect(result.repositories).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].repositoryId).toBe('999');
    });

    it('should apply processing options', () => {
      const options: ProcessingOptions = { minStars: 1000 };
      const result = batchProcessRepositories(mockRepos, options);

      expect(result.repositories.every(repo => repo.stars >= 1000)).toBe(true);
    });
  });

  describe('getLanguageColor', () => {
    it('should return correct colors for known languages', () => {
      expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
      expect(getLanguageColor('TypeScript')).toBe('#2b7489');
      expect(getLanguageColor('Python')).toBe('#3572A5');
    });

    it('should be case insensitive', () => {
      expect(getLanguageColor('javascript')).toBe('#f1e05a');
      expect(getLanguageColor('TYPESCRIPT')).toBe('#2b7489');
    });

    it('should handle spaces in language names', () => {
      expect(getLanguageColor('C++')).toBe('#f34b7d');
      expect(getLanguageColor('C#')).toBe('#239120');
    });

    it('should return default color for unknown languages', () => {
      expect(getLanguageColor('UnknownLanguage')).toBe('#586069');
      expect(getLanguageColor('')).toBe('#586069');
    });
  });

  describe('formatStarCount', () => {
    it('should format numbers less than 1000 as-is', () => {
      expect(formatStarCount(0)).toBe('0');
      expect(formatStarCount(42)).toBe('42');
      expect(formatStarCount(999)).toBe('999');
    });

    it('should format thousands with k suffix', () => {
      expect(formatStarCount(1000)).toBe('1.0k');
      expect(formatStarCount(1234)).toBe('1.2k');
      expect(formatStarCount(15678)).toBe('15.7k');
      expect(formatStarCount(999999)).toBe('1000.0k');
    });

    it('should format millions with M suffix', () => {
      expect(formatStarCount(1000000)).toBe('1.0M');
      expect(formatStarCount(1234567)).toBe('1.2M');
      expect(formatStarCount(15678901)).toBe('15.7M');
    });
  });
});
/**
 * Data Processing and Transformation Logic
 * Handles conversion of GitHub API data to application format
 */

import type { GitHubRepository } from './github-client';

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  name: string;
  avatar: string;
}

export interface TrendingResponse {
  date: string;
  repositories: Repository[];
  total: number;
  updatedAt: string;
}

export interface ProcessingOptions {
  maxRepositories?: number;
  minStars?: number;
  excludeLanguages?: string[];
  includeLanguages?: string[];
}

/**
 * Transform GitHub API repository data to application format
 * @param githubRepo - Raw GitHub repository data
 * @returns Transformed repository object
 */
export function transformRepository(githubRepo: GitHubRepository): Repository {
  return {
    id: githubRepo.id.toString(),
    name: githubRepo.name,
    fullName: githubRepo.full_name,
    description: githubRepo.description || '',
    url: githubRepo.html_url,
    stars: githubRepo.stargazers_count,
    language: githubRepo.language || 'Unknown',
    author: {
      name: githubRepo.owner.login,
      avatar: githubRepo.owner.avatar_url,
    },
    createdAt: githubRepo.created_at,
    updatedAt: githubRepo.updated_at,
  };
}

/**
 * Process and filter array of GitHub repositories
 * @param githubRepos - Array of raw GitHub repository data
 * @param options - Processing options for filtering and limiting
 * @returns Array of processed repositories
 */
export function processRepositories(
  githubRepos: GitHubRepository[],
  options: ProcessingOptions = {}
): Repository[] {
  const {
    maxRepositories = 50,
    minStars = 0,
    excludeLanguages = [],
    includeLanguages = [],
  } = options;

  let repositories = githubRepos
    // Transform to application format
    .map(transformRepository)
    // Filter by minimum stars
    .filter(repo => repo.stars >= minStars)
    // Filter by excluded languages
    .filter(repo => {
      if (excludeLanguages.length === 0) return true;
      return !excludeLanguages.includes(repo.language.toLowerCase());
    })
    // Filter by included languages (if specified)
    .filter(repo => {
      if (includeLanguages.length === 0) return true;
      return includeLanguages.includes(repo.language.toLowerCase());
    })
    // Sort by stars (descending)
    .sort((a, b) => b.stars - a.stars);

  // Limit number of repositories
  if (maxRepositories > 0) {
    repositories = repositories.slice(0, maxRepositories);
  }

  return repositories;
}

/**
 * Create trending response object
 * @param repositories - Processed repositories array
 * @param date - Date string in YYYY-MM-DD format
 * @returns Complete trending response object
 */
export function createTrendingResponse(
  repositories: Repository[],
  date: string
): TrendingResponse {
  return {
    date,
    repositories,
    total: repositories.length,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Validate repository data integrity
 * @param repo - Repository object to validate
 * @returns Validation result with errors if any
 */
export function validateRepository(repo: Repository): ValidationResult {
  const errors: string[] = [];

  // Required fields validation
  if (!repo.id || repo.id.trim() === '') {
    errors.push('Repository ID is required');
  }

  if (!repo.name || repo.name.trim() === '') {
    errors.push('Repository name is required');
  }

  if (!repo.fullName || repo.fullName.trim() === '') {
    errors.push('Repository full name is required');
  }

  if (!repo.url || !isValidUrl(repo.url)) {
    errors.push('Valid repository URL is required');
  }

  if (!repo.author.name || repo.author.name.trim() === '') {
    errors.push('Author name is required');
  }

  if (!repo.author.avatar || !isValidUrl(repo.author.avatar)) {
    errors.push('Valid author avatar URL is required');
  }

  // Data type validation
  if (typeof repo.stars !== 'number' || repo.stars < 0) {
    errors.push('Stars count must be a non-negative number');
  }

  // Date validation
  if (!repo.createdAt || !isValidISODate(repo.createdAt)) {
    errors.push('Valid created date is required');
  }

  if (!repo.updatedAt || !isValidISODate(repo.updatedAt)) {
    errors.push('Valid updated date is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Clean and sanitize repository data
 * @param repo - Repository object to clean
 * @returns Cleaned repository object
 */
export function cleanRepository(repo: Repository): Repository {
  return {
    ...repo,
    name: sanitizeString(repo.name),
    fullName: sanitizeString(repo.fullName),
    description: sanitizeString(repo.description),
    language: sanitizeString(repo.language) || 'Unknown',
    author: {
      name: sanitizeString(repo.author.name),
      avatar: repo.author.avatar.trim(),
    },
    stars: Math.max(0, Math.floor(repo.stars)), // Ensure non-negative integer
  };
}

/**
 * Batch process repositories with validation and cleaning
 * @param githubRepos - Array of raw GitHub repository data
 * @param options - Processing options
 * @returns Processing result with valid repositories and errors
 */
export function batchProcessRepositories(
  githubRepos: GitHubRepository[],
  options: ProcessingOptions = {}
): BatchProcessingResult {
  const processed = processRepositories(githubRepos, options);
  const results: Repository[] = [];
  const errors: ProcessingError[] = [];

  for (const repo of processed) {
    try {
      const cleaned = cleanRepository(repo);
      const validation = validateRepository(cleaned);

      if (validation.isValid) {
        results.push(cleaned);
      } else {
        errors.push({
          repositoryId: repo.id,
          repositoryName: repo.fullName,
          errors: validation.errors,
        });
      }
    } catch (error) {
      errors.push({
        repositoryId: repo.id,
        repositoryName: repo.fullName,
        errors: [`Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      });
    }
  }

  return {
    repositories: results,
    errors,
    totalProcessed: githubRepos.length,
    totalValid: results.length,
    totalErrors: errors.length,
  };
}

// Supporting interfaces and types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ProcessingError {
  repositoryId: string;
  repositoryName: string;
  errors: string[];
}

export interface BatchProcessingResult {
  repositories: Repository[];
  errors: ProcessingError[];
  totalProcessed: number;
  totalValid: number;
  totalErrors: number;
}

// Utility functions
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && dateString.includes('T');
}

function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Get language color mapping for UI display
 * @param language - Programming language name
 * @returns Hex color code for the language
 */
export function getLanguageColor(language: string): string {
  const languageColors: Record<string, string> = {
    javascript: '#f1e05a',
    typescript: '#2b7489',
    python: '#3572A5',
    java: '#b07219',
    'c++': '#f34b7d',
    'c#': '#239120',
    php: '#4F5D95',
    ruby: '#701516',
    go: '#00ADD8',
    rust: '#dea584',
    swift: '#ffac45',
    kotlin: '#F18E33',
    dart: '#00B4AB',
    scala: '#c22d40',
    shell: '#89e051',
    html: '#e34c26',
    css: '#1572B6',
    vue: '#2c3e50',
    react: '#61DAFB',
    unknown: '#586069',
  };

  const normalizedLanguage = language.toLowerCase().replace(/\s+/g, '');
  return languageColors[normalizedLanguage] || languageColors.unknown;
}

/**
 * Format star count for display (e.g., 1234 -> "1.2k")
 * @param stars - Number of stars
 * @returns Formatted string
 */
export function formatStarCount(stars: number): string {
  if (stars < 1000) {
    return stars.toString();
  } else if (stars < 1000000) {
    return `${(stars / 1000).toFixed(1)}k`;
  } else {
    return `${(stars / 1000000).toFixed(1)}M`;
  }
}
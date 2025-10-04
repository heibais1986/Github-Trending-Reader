/**
 * GitHub API Client
 * Handles GitHub Search API calls with authentication and error handling
 */

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

export interface GitHubApiError {
  message: string;
  documentation_url?: string;
}

export class GitHubApiClient {
  private readonly baseUrl = 'https://api.github.com';
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Search for trending repositories created after a specific date
   * @param date - Date in YYYY-MM-DD format
   * @param perPage - Number of results per page (max 100)
   * @returns Promise with search results
   */
  async searchTrendingRepositories(
    date: string,
    perPage: number = 50
  ): Promise<GitHubSearchResponse> {
    const query = `created:>${date} stars:>10`;
    const params = new URLSearchParams({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: perPage.toString(),
    });

    const url = `${this.baseUrl}/search/repositories?${params.toString()}`;
    
    try {
      const response = await this.makeRequest(url);
      
      if (!response.ok) {
        await this.handleApiError(response);
      }

      const data: GitHubSearchResponse = await response.json();
      return data;
    } catch (error) {
      // Re-throw GitHubClientError as-is (from handleApiError)
      if (error instanceof GitHubClientError) {
        throw error;
      }
      // Only catch actual network/fetch errors
      throw new GitHubClientError(
        'NETWORK_ERROR',
        'Failed to connect to GitHub API',
        error instanceof Error ? error.message : 'Unknown network error'
      );
    }
  }

  /**
   * Make authenticated request to GitHub API
   * @param url - API endpoint URL
   * @returns Promise with Response object
   */
  private async makeRequest(url: string): Promise<Response> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Trending-Worker/1.0',
    };

    // Add authentication if token is provided
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return fetch(url, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Handle API error responses
   * @param response - Failed response object
   */
  private async handleApiError(response: Response): Promise<never> {
    let errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;
    let errorCode = 'API_ERROR';
    let details = '';

    // Map specific HTTP status codes to error types first
    switch (response.status) {
      case 401:
        errorCode = 'AUTHENTICATION_ERROR';
        errorMessage = 'Invalid or missing GitHub token';
        break;
      case 403:
        errorCode = 'RATE_LIMIT_ERROR';
        errorMessage = 'GitHub API rate limit exceeded';
        break;
      case 422:
        errorCode = 'VALIDATION_ERROR';
        errorMessage = 'Invalid search query parameters';
        break;
      case 503:
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = 'GitHub API is temporarily unavailable';
        break;
    }

    // Try to get more detailed error information from response body
    try {
      const errorData: GitHubApiError = await response.json();
      if (errorData.message) {
        // Only override the message if we got a generic one
        if (errorCode === 'API_ERROR') {
          errorMessage = errorData.message;
        }
      }
      details = errorData.documentation_url || `HTTP ${response.status}`;
    } catch {
      // If we can't parse the error response, use the status text
      details = `HTTP ${response.status}`;
    }

    throw new GitHubClientError(errorCode, errorMessage, details);
  }
}

/**
 * Custom error class for GitHub API client errors
 */
export class GitHubClientError extends Error {
  public readonly code: string;
  public readonly details: string;

  constructor(code: string, message: string, details: string = '') {
    super(message);
    this.name = 'GitHubClientError';
    this.code = code;
    this.details = details;
  }

  /**
   * Convert error to JSON format for API responses
   */
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Utility function to validate date format (YYYY-MM-DD)
 * @param dateString - Date string to validate
 * @returns boolean indicating if date is valid
 */
export function isValidDateFormat(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 * @returns Yesterday's date string
 */
export function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}
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
   * Get trending repositories by scraping GitHub's trending page
   * @param date - Date in YYYY-MM-DD format (currently not used as GitHub trending is real-time)
   * @param perPage - Number of results to return (max 100)
   * @returns Promise with trending repositories
   */
  async searchTrendingRepositories(
    date: string,
    perPage: number = 50
  ): Promise<GitHubSearchResponse> {
    try {
      // First, try to get trending repositories from GitHub's trending page
      const trendingRepos = await this.scrapeTrendingPage();
      
      if (trendingRepos.length === 0) {
        // Fallback: Use search API with recent activity
        return await this.searchRecentlyActiveRepositories(date, perPage);
      }

      // Limit results to requested number
      const limitedRepos = trendingRepos.slice(0, perPage);
      
      return {
        total_count: limitedRepos.length,
        incomplete_results: false,
        items: limitedRepos,
      };
    } catch (error) {
      console.warn('Trending page scraping failed, falling back to search API:', error);
      // Fallback to search API
      return await this.searchRecentlyActiveRepositories(date, perPage);
    }
  }

  /**
   * Scrape GitHub's trending page to get actual trending repositories
   * @returns Promise with array of trending repositories
   */
  private async scrapeTrendingPage(): Promise<GitHubRepository[]> {
    const trendingUrl = 'https://github.com/trending';
    
    try {
      const response = await fetch(trendingUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch trending page: ${response.status}`);
      }

      const html = await response.text();
      return this.parseTrendingPageHtml(html);
    } catch (error) {
      throw new GitHubClientError(
        'SCRAPING_ERROR',
        'Failed to scrape GitHub trending page',
        error instanceof Error ? error.message : 'Unknown scraping error'
      );
    }
  }

  /**
   * Parse HTML from GitHub trending page to extract repository information
   * @param html - HTML content from trending page
   * @returns Array of repository objects
   */
  private parseTrendingPageHtml(html: string): GitHubRepository[] {
    const repositories: GitHubRepository[] = [];
    
    // Try multiple patterns to handle different HTML structures
    const patterns = [
      // Current GitHub trending page structure
      /<article[^>]*class="[^"]*Box-row[^"]*"[^>]*>(.*?)<\/article>/gs,
      // Alternative structure
      /<div[^>]*class="[^"]*Box-row[^"]*"[^>]*>(.*?)<\/div>/gs,
      // Fallback pattern
      /<li[^>]*class="[^"]*repo-list-item[^"]*"[^>]*>(.*?)<\/li>/gs,
    ];

    for (const pattern of patterns) {
      const matches = html.matchAll(pattern);
      let matchCount = 0;
      
      for (const match of matches) {
        const articleHtml = match[1];
        
        try {
          const repo = this.parseRepositoryFromArticle(articleHtml);
          if (repo) {
            repositories.push(repo);
            matchCount++;
          }
        } catch (error) {
          console.warn('Failed to parse repository from article:', error);
          // Continue with other repositories
        }
      }
      
      // If we found repositories with this pattern, use them
      if (matchCount > 0) {
        console.log(`Successfully parsed ${matchCount} repositories using pattern ${patterns.indexOf(pattern) + 1}`);
        break;
      }
    }

    // If no repositories found, try a more aggressive approach
    if (repositories.length === 0) {
      console.warn('No repositories found with standard patterns, trying aggressive parsing');
      return this.parseWithAggressiveMethod(html);
    }

    return repositories;
  }

  /**
   * Aggressive parsing method as fallback
   * @param html - HTML content
   * @returns Array of repository objects
   */
  private parseWithAggressiveMethod(html: string): GitHubRepository[] {
    const repositories: GitHubRepository[] = [];
    
    // Look for repository links in the HTML
    const repoLinkPattern = /href="\/([^"]+\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
    const matches = html.matchAll(repoLinkPattern);
    
    for (const match of matches) {
      const fullName = match[1];
      const displayName = match[2].trim();
      
      // Skip if it doesn't look like a repository path
      if (!fullName.includes('/') || fullName.split('/').length !== 2) {
        continue;
      }
      
      // Skip system paths
      if (fullName.startsWith('github/') || fullName.startsWith('settings/') || fullName.includes('?')) {
        continue;
      }
      
      const [owner, name] = fullName.split('/');
      
      // Generate basic repository object
      const repo: GitHubRepository = {
        id: this.generateRepoId(fullName),
        name,
        full_name: fullName,
        description: null,
        html_url: `https://github.com/${fullName}`,
        stargazers_count: 0,
        language: null,
        owner: {
          login: owner,
          avatar_url: `https://github.com/${owner}.png`,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      repositories.push(repo);
      
      // Limit to prevent too many results
      if (repositories.length >= 25) {
        break;
      }
    }
    
    console.log(`Aggressive parsing found ${repositories.length} repositories`);
    return repositories;
  }

  /**
   * Parse individual repository information from article HTML
   * @param articleHtml - HTML content of repository article
   * @returns Repository object or null if parsing fails
   */
  private parseRepositoryFromArticle(articleHtml: string): GitHubRepository | null {
    try {
      // Try multiple patterns to extract repository name and owner
      const namePatterns = [
        /<h2[^>]*>.*?<a[^>]*href="\/([^"]+)"[^>]*>/s,
        /<h1[^>]*>.*?<a[^>]*href="\/([^"]+)"[^>]*>/s,
        /<a[^>]*href="\/([^\/]+\/[^\/\?"]+)"[^>]*>/s,
      ];
      
      let fullName = '';
      for (const pattern of namePatterns) {
        const match = articleHtml.match(pattern);
        if (match && match[1] && match[1].includes('/')) {
          fullName = match[1];
          break;
        }
      }
      
      if (!fullName || !fullName.includes('/')) {
        return null;
      }
      
      const [owner, name] = fullName.split('/');
      if (!owner || !name) {
        return null;
      }
      
      // Extract description with multiple patterns
      const descPatterns = [
        /<p[^>]*class="[^"]*color-fg-muted[^"]*"[^>]*>(.*?)<\/p>/s,
        /<p[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)<\/p>/s,
        /<div[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)<\/div>/s,
      ];
      
      let description = null;
      for (const pattern of descPatterns) {
        const match = articleHtml.match(pattern);
        if (match && match[1]) {
          description = match[1].replace(/<[^>]*>/g, '').trim();
          if (description) break;
        }
      }
      
      // Extract language with multiple patterns
      const langPatterns = [
        /<span[^>]*itemprop="programmingLanguage"[^>]*>(.*?)<\/span>/s,
        /<span[^>]*class="[^"]*language[^"]*"[^>]*>(.*?)<\/span>/s,
        /Language:\s*<span[^>]*>(.*?)<\/span>/s,
      ];
      
      let language = null;
      for (const pattern of langPatterns) {
        const match = articleHtml.match(pattern);
        if (match && match[1]) {
          language = match[1].trim();
          if (language) break;
        }
      }
      
      // Extract stars with multiple patterns
      const starsPatterns = [
        /(\d+(?:,\d+)*)\s*stars?\s*today/i,
        /(\d+(?:,\d+)*)\s*stars?/i,
        /Stars:\s*(\d+(?:,\d+)*)/i,
        /★\s*(\d+(?:,\d+)*)/i,
      ];
      
      let starsCount = 0;
      for (const pattern of starsPatterns) {
        const match = articleHtml.match(pattern);
        if (match && match[1]) {
          starsCount = parseInt(match[1].replace(/,/g, ''));
          if (!isNaN(starsCount)) break;
        }
      }

      // Generate a pseudo-ID based on the full name
      const id = this.generateRepoId(fullName);

      return {
        id,
        name,
        full_name: fullName,
        description: description || null,
        html_url: `https://github.com/${fullName}`,
        stargazers_count: starsCount,
        language: language || null,
        owner: {
          login: owner,
          avatar_url: `https://github.com/${owner}.png`,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('Error parsing repository article:', error);
      return null;
    }
  }

  /**
   * Fallback method: Search for recently active repositories
   * @param date - Date in YYYY-MM-DD format
   * @param perPage - Number of results per page
   * @returns Promise with search results
   */
  private async searchRecentlyActiveRepositories(
    date: string,
    perPage: number = 50
  ): Promise<GitHubSearchResponse> {
    // Search for repositories with recent activity (pushed in last 7 days) and good star count
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentDate = sevenDaysAgo.toISOString().split('T')[0];
    
    const query = `pushed:>${recentDate} stars:>50`;
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
      if (error instanceof GitHubClientError) {
        throw error;
      }
      throw new GitHubClientError(
        'NETWORK_ERROR',
        'Failed to connect to GitHub API',
        error instanceof Error ? error.message : 'Unknown network error'
      );
    }
  }

  /**
   * Generate a pseudo-ID for repository based on full name
   * @param fullName - Repository full name (owner/repo)
   * @returns Numeric ID
   */
  private generateRepoId(fullName: string): number {
    // Simple hash function to generate consistent IDs
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      const char = fullName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
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
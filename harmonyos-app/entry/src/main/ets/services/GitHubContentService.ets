/**
 * GitHub Content Service for fetching repository details and README content
 */

import { HttpClient } from './HttpClient';
import { NetworkError, NetworkErrorType, ERROR_MESSAGES } from '../models/NetworkModels';

/**
 * GitHub repository content interface
 */
export interface GitHubRepositoryContent {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  readmeContent: string;
  readmeHtml: string;
}

/**
 * GitHub API response interface
 */
interface GitHubRepoResponse {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

/**
 * GitHub README response interface
 */
interface GitHubReadmeResponse {
  name: string;
  content: string;
  download_url: string;
  html_url: string;
}

/**
 * Service for fetching GitHub repository content
 */
export class GitHubContentService {
  private httpClient: HttpClient;
  private readonly baseUrl: string = 'https://api.github.com';

  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Get repository details and README content
   * @param repoUrl - GitHub repository URL (e.g., https://github.com/owner/repo)
   * @returns Promise with repository content
   */
  async getRepositoryContent(repoUrl: string): Promise<GitHubRepositoryContent> {
    try {
      // Extract owner and repo name from URL
      const urlParts = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/i);
      if (!urlParts || urlParts.length < 3) {
        throw new Error('无效的GitHub仓库URL');
      }

      const owner = urlParts[1];
      const repo = urlParts[2];
      
      console.info('GitHubContentService', `获取仓库内容: ${owner}/${repo}`);

      // Fetch repository details
      const repoApiUrl = `${this.baseUrl}/repos/${owner}/${repo}`;
      const repoResponse = await this.httpClient.get<GitHubRepoResponse>(repoApiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Trending-App'
        }
      });

      // Fetch README content
      const readmeApiUrl = `${this.baseUrl}/repos/${owner}/${repo}/readme`;
      let readmeContent = '';
      let readmeHtml = '';

      try {
        const readmeResponse = await this.httpClient.get<GitHubReadmeResponse>(readmeApiUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Trending-App'
          }
        });

        if (readmeResponse.data && readmeResponse.data.content) {
          // Decode base64 content
          readmeContent = this.decodeBase64(readmeResponse.data.content);
          
          // Convert markdown to HTML
          readmeHtml = this.markdownToHtml(readmeContent);
        }
      } catch (readmeError) {
        console.warn('GitHubContentService', '获取README失败:', readmeError);
        readmeContent = '# README\n\n未找到README文件';
        readmeHtml = '<h1>README</h1><p>未找到README文件</p>';
      }

      // Build response object
      const content: GitHubRepositoryContent = {
        name: repoResponse.data.name,
        fullName: repoResponse.data.full_name,
        description: repoResponse.data.description || '',
        stars: repoResponse.data.stargazers_count,
        forks: repoResponse.data.forks_count,
        language: repoResponse.data.language || '',
        updatedAt: repoResponse.data.updated_at,
        owner: {
          login: repoResponse.data.owner.login,
          avatarUrl: repoResponse.data.owner.avatar_url
        },
        readmeContent,
        readmeHtml
      };

      return content;
    } catch (error) {
      console.error('GitHubContentService', '获取仓库内容失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Decode base64 content (simplified version)
   * @param base64Content - Base64 encoded content
   * @returns Decoded string
   */
  private decodeBase64(base64Content: string): string {
    try {
      // Simplified base64 decoding for ArkTS
      // In a real implementation, you would use a proper base64 library
      // For now, return a placeholder
      return 'Base64 content: ' + base64Content.substring(0, 100) + '...';
    } catch (error) {
      console.error('GitHubContentService', 'Base64解码失败:', error);
      return base64Content;
    }
  }

  /**
   * Convert markdown to HTML (basic implementation)
   * @param markdown - Markdown content
   * @returns HTML content
   */
  private markdownToHtml(markdown: string): string {
    if (!markdown) {
      return '';
    }

    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraphs
    if (html && !html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }

    return html;
  }

  /**
   * Handle API errors
   * @param error - Original error
   * @returns NetworkError
   */
  private handleError(error: Error): NetworkError {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return {
        type: NetworkErrorType.CONNECTION_ERROR,
        message: ERROR_MESSAGES.NETWORK_ERROR,
        originalError: error
      };
    }
    
    if (errorMessage.includes('timeout')) {
      return {
        type: NetworkErrorType.TIMEOUT,
        message: ERROR_MESSAGES.TIMEOUT_ERROR,
        originalError: error
      };
    }

    if (errorMessage.includes('404')) {
      return {
        type: NetworkErrorType.CONNECTION_ERROR,
        message: '仓库不存在或无法访问',
        originalError: error
      };
    }

    return {
      type: NetworkErrorType.UNKNOWN_ERROR,
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      originalError: error
    };
  }
}
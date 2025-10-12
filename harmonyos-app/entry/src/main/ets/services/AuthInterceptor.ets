/**
 * Authentication and request header interceptor for HarmonyOS
 * Adds necessary headers for GitHub official API requests including:
 * - User-Agent: Required by GitHub API
 * - Authorization: GitHub Token authentication (if configured)
 * - Accept: Specify API version
 */
import { RequestConfig } from '../models/NetworkModels';

export class AuthInterceptor {
  private static readonly GITHUB_TOKEN_HEADER = 'Authorization';
  private static readonly TOKEN_PREFIX = 'token ';
  private static readonly GITHUB_API_HOST = 'api.github.com';

  /**
   * Intercept and modify HTTP request configuration
   * @param requestConfig - Original request configuration
   * @returns Modified request configuration with authentication headers
   */
  static interceptRequest(requestConfig: RequestConfig): RequestConfig {
    const modifiedConfig: RequestConfig = {
      url: requestConfig.url,
      method: requestConfig.method,
      headers: requestConfig.headers ? AuthInterceptor.mergeHeaders({}, requestConfig.headers) : ({} as Record<string, string>),
      timeout: requestConfig.timeout,
      retryCount: requestConfig.retryCount
    };
    const urlParts = requestConfig.url.split('/');
    const host = urlParts.length > 2 ? urlParts[2] : '';

    // Apply different headers based on the target host
    if (host === AuthInterceptor.GITHUB_API_HOST) {
      // For GitHub API, inject dedicated headers
      const headers = modifiedConfig.headers || {};
      modifiedConfig.headers = AuthInterceptor.mergeHeaders(headers, {
        'User-Agent': 'GitHubTrending-HarmonyOS/1.0',
        'Accept': 'application/vnd.github.v3+json'
      });

      // Add authentication token if available
      const githubToken = AuthInterceptor.getGitHubToken();
      if (githubToken) {
        const currentHeaders = modifiedConfig.headers || {};
        const authHeaders: Record<string, string> = {};
        authHeaders[AuthInterceptor.GITHUB_TOKEN_HEADER] = AuthInterceptor.TOKEN_PREFIX + githubToken;
        modifiedConfig.headers = AuthInterceptor.mergeHeaders(currentHeaders, authHeaders);
      }
    } else {
      // For other domains, avoid injecting GitHub-specific headers
      // Add generic User-Agent for compatibility
      const headers = modifiedConfig.headers || {};
      modifiedConfig.headers = AuthInterceptor.mergeHeaders(headers, {
        'User-Agent': 'Mozilla/5.0 (HarmonyOS) GitHubTrending/1.0'
      });
    }

    return modifiedConfig;
  }

  /**
   * Merge headers from multiple sources
   * @param baseHeaders - Base headers object
   * @param additionalHeaders - Additional headers to merge
   * @returns Merged headers object
   */
  private static mergeHeaders(baseHeaders: Record<string, string>, additionalHeaders?: Record<string, string>): Record<string, string> {
    const merged: Record<string, string> = {};

    // Copy base headers
    const baseKeys = Object.keys(baseHeaders);
    for (let i = 0; i < baseKeys.length; i++) {
      const key = baseKeys[i];
      merged[key] = baseHeaders[key];
    }

    // Merge additional headers
    if (additionalHeaders) {
      const additionalKeys = Object.keys(additionalHeaders);
      for (let i = 0; i < additionalKeys.length; i++) {
        const key = additionalKeys[i];
        merged[key] = additionalHeaders[key];
      }
    }

    return merged;
  }

  /**
   * Get GitHub authentication token
   * Priority: Environment variables > System properties > Configuration
   * @returns GitHub token or empty string if not configured
   */
  private static getGitHubToken(): string {
    try {
      // In HarmonyOS, you might get tokens from:
      // - Environment variables (if supported)
      // - App preferences/settings
      // - Secure storage

      // For now, return empty string (no authentication)
      // In a real implementation, you would retrieve from secure storage
      return '';
    } catch (error) {
      console.error('Failed to get GitHub token:', error);
      return '';
    }
  }

  /**
   * Check if a URL requires authentication
   * @param url - URL to check
   * @returns true if authentication is required
   */
  static requiresAuthentication(url: string): boolean {
    try {
      const urlParts = url.split('/');
      const host = urlParts.length > 2 ? urlParts[2] : '';
      return host === AuthInterceptor.GITHUB_API_HOST;
    } catch (error) {
      console.error('Failed to parse URL for authentication check:', error);
      return false;
    }
  }

  /**
   * Validate authentication configuration
   * @returns true if authentication is properly configured
   */
  static isAuthenticationConfigured(): boolean {
    return AuthInterceptor.getGitHubToken().length > 0;
  }
}


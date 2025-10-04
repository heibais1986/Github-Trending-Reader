/**
 * API constants and configuration for the GitHub Trending app
 */

/**
 * API endpoints configuration
 */
export class ApiEndpoints {
  // Base URL for the API (should be configured based on environment)
  static readonly BASE_URL = 'https://your-domain.com';
  
  // API endpoints
  static readonly TRENDING_TODAY = '/api/trending';
  static readonly TRENDING_BY_DATE = '/api/trending';
  
  /**
   * Get the full URL for trending repositories
   * @param date - Optional date parameter (YYYY-MM-DD format)
   * @returns Full API URL
   */
  static getTrendingUrl(date?: string): string {
    const baseUrl = `${this.BASE_URL}${this.TRENDING_TODAY}`;
    return date ? `${baseUrl}?date=${date}` : baseUrl;
  }
}

/**
 * HTTP status codes
 */
export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

/**
 * API error codes
 */
export enum ApiErrorCode {
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

/**
 * Network timeout configurations (in milliseconds)
 */
export const NETWORK_TIMEOUTS = {
  DEFAULT: 10000,      // 10 seconds
  LONG_REQUEST: 30000, // 30 seconds
  SHORT_REQUEST: 5000  // 5 seconds
} as const;

/**
 * Cache configurations
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL: 3600000, // 1 hour in milliseconds
  MAX_CACHE_SIZE: 50,   // Maximum number of cached responses
  CACHE_KEY_PREFIX: 'github_trending_'
} as const;

/**
 * Date format constants
 */
export const DATE_FORMATS = {
  API_DATE: 'YYYY-MM-DD',
  DISPLAY_DATE: 'YYYY年MM月DD日',
  ISO_DATE: 'YYYY-MM-DDTHH:mm:ss.sssZ'
} as const;

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器暂时不可用，请稍后重试',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  PARSE_ERROR: '数据格式错误，请稍后重试',
  NOT_FOUND: '未找到相关数据',
  UNKNOWN_ERROR: '发生未知错误，请稍后重试'
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  DATA_LOADED: '数据加载成功',
  DATA_REFRESHED: '数据已刷新'
} as const;

/**
 * Loading messages
 */
export const LOADING_MESSAGES = {
  LOADING_DATA: '正在加载数据...',
  REFRESHING_DATA: '正在刷新数据...'
} as const;
/**
 * API constants and configuration for the GitHub Trending app
 */

/**
 * API endpoints configuration
 */
export class ApiEndpoints {
  static readonly BASE_URL: string = 'https://api.github.com';
  
  /**
   * Get trending repositories URL
   * @param date - Optional date parameter (YYYY-MM-DD format)
   */
  static getTrendingUrl(date?: string): string {
    if (date) {
      return `${ApiEndpoints.BASE_URL}/search/repositories?q=created:${date}&sort=stars&order=desc&per_page=30`;
    }
    return `${ApiEndpoints.BASE_URL}/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=30`;
  }
}

/**
 * HTTP status codes enumeration
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

/**
 * API error codes enumeration
 */
export enum ApiErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR'
}

/**
 * Network timeout configurations
 */
export const NETWORK_TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  VERY_LONG: 60000
};

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL: 300000, // 5 minutes
  SHORT_TTL: 60000,    // 1 minute
  LONG_TTL: 1800000,   // 30 minutes
  MAX_CACHE_SIZE: 100
};

/**
 * Date format constants
 */
export const DATE_FORMATS = {
  API_DATE: 'YYYY-MM-DD',
  DISPLAY_DATE: 'MMM DD, YYYY',
  FULL_DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'HH:mm:ss'
};

/**
 * Error message constants
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  PARSE_ERROR: '数据解析失败',
  UNKNOWN_ERROR: '未知错误发生',
  VALIDATION_ERROR: '数据验证失败',
  AUTH_ERROR: '认证失败，请检查访问权限',
  RATE_LIMIT_ERROR: '请求频率过高，请稍后重试'
};

/**
 * Success message constants
 */
export const SUCCESS_MESSAGES = {
  DATA_LOADED: '数据加载成功',
  CACHE_UPDATED: '缓存已更新',
  REQUEST_COMPLETED: '请求已完成'
};

/**
 * Loading message constants
 */
export const LOADING_MESSAGES = {
  LOADING_REPOSITORIES: '正在加载仓库数据...',
  FETCHING_TRENDING: '正在获取热门数据...',
  UPDATING_CACHE: '正在更新缓存...',
  VALIDATING_DATA: '正在验证数据...'
};
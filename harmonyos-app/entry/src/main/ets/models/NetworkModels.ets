/**
 * Network request and response models for the GitHub Trending app
 */

import { Repository, RepositoryOwner, createRepository, createRepositoryOwner } from './Repository';
import { TrendingResponse, DataValidator } from './TrendingResponse';

/**
 * API endpoints configuration interface
 */
interface ApiEndpointsConfig {
  BASE_URL: string;
  getTrendingUrl: (date?: string) => string;
}

/**
 * API endpoints configuration
 */
export const ApiEndpoints: ApiEndpointsConfig = {
  BASE_URL: 'https://reddit-trending-api.workers.dev',
  getTrendingUrl: (date?: string): string => {
    const baseUrl = `${ApiEndpoints.BASE_URL}/api/trending`;
    return date ? `${baseUrl}?date=${date}` : baseUrl;
  }
};

/**
 * HTTP status codes interface
 */
interface HttpStatusCodeType {
  OK: number;
  BAD_REQUEST: number;
  UNAUTHORIZED: number;
  FORBIDDEN: number;
  NOT_FOUND: number;
  INTERNAL_SERVER_ERROR: number;
  BAD_GATEWAY: number;
  SERVICE_UNAVAILABLE: number;
  GATEWAY_TIMEOUT: number;
}

/**
 * HTTP status codes
 */
export const HttpStatusCode: HttpStatusCodeType = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

/**
 * Error messages interface
 */
interface ErrorMessagesType {
  NETWORK_ERROR: string;
  TIMEOUT_ERROR: string;
  PARSE_ERROR: string;
  UNKNOWN_ERROR: string;
}

/**
 * Error messages
 */
export const ERROR_MESSAGES: ErrorMessagesType = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  PARSE_ERROR: '数据解析失败，服务器返回格式错误',
  UNKNOWN_ERROR: '未知错误，请稍后重试'
};

/**
 * HTTP request configuration interface
 */
export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  retryCount?: number;
}

/**
 * HTTP response wrapper interface
 */
export interface HttpResponse<T = object> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Network error types enumeration
 */
export enum NetworkErrorType {
  TIMEOUT = 'TIMEOUT',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Network error interface
 */
export interface NetworkError {
  type: NetworkErrorType;
  message: string;
  statusCode?: number;
  originalError?: Error;
}

/**
 * Loading state enumeration
 */
export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

/**
 * Application state interface for data management
 */
export interface AppState {
  repositories: Repository[];
  loadingState: LoadingState;
  error: NetworkError | null;
  lastUpdated: string | null;
  selectedDate: string | null;
}

/**
 * Network retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

/**
 * Default configurations
 */
export const DEFAULT_REQUEST_CONFIG: Partial<RequestConfig> = {
  timeout: 10000, // 10 seconds
  retryCount: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  backoffMultiplier: 2
};



/**
 * Initial application state
 */
export const INITIAL_APP_STATE: AppState = {
  repositories: [],
  loadingState: LoadingState.IDLE,
  error: null,
  lastUpdated: null,
  selectedDate: null
};

// Re-export types from other modules for convenience
export type { Repository, RepositoryOwner } from './Repository';
export type { TrendingResponse, ApiError } from './TrendingResponse';
export { createRepository, createRepositoryOwner } from './Repository';
export { DataValidator } from './TrendingResponse';
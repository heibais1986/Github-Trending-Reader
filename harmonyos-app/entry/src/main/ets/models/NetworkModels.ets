/**
 * Network request and response models for the GitHub Trending app
 */

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
export interface HttpResponse<T = any> {
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

import { Repository } from './Repository';
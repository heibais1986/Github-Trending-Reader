/**
 * Network service for GitHub Trending API interactions
 */

import { HttpClient } from './HttpClient';
import {
  TrendingResponse,
  Repository,
  NetworkError,
  NetworkErrorType,
  HttpResponse,
  DataValidator,
  ApiEndpoints,
  HttpStatusCode,
  ERROR_MESSAGES
} from '../models';

/**
 * Network service class for API interactions
 */
export class NetworkService {
  private httpClient: HttpClient;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.httpClient = new HttpClient();
    this.baseUrl = baseUrl || ApiEndpoints.BASE_URL;
  }

  /**
   * Get trending repositories for today
   * @returns Promise with trending repositories response
   */
  async getTrendingRepositories(): Promise<TrendingResponse> {
    try {
      const url = ApiEndpoints.getTrendingUrl();
      const response = await this.httpClient.get<TrendingResponse>(url);
      
      // Validate response data
      if (!DataValidator.validateTrendingResponse(response.data)) {
        throw this.createNetworkError(
          NetworkErrorType.PARSE_ERROR,
          ERROR_MESSAGES.PARSE_ERROR
        );
      }

      return response.data;
    } catch (error) {
      throw this.handleNetworkError(error);
    }
  }

  /**
   * Get trending repositories for a specific date
   * @param date - Date in YYYY-MM-DD format
   * @returns Promise with trending repositories response
   */
  async getTrendingRepositoriesByDate(date: string): Promise<TrendingResponse> {
    try {
      // Validate date format
      if (!this.isValidDateFormat(date)) {
        throw this.createNetworkError(
          NetworkErrorType.PARSE_ERROR,
          '日期格式无效，请使用 YYYY-MM-DD 格式'
        );
      }

      const url = ApiEndpoints.getTrendingUrl(date);
      const response = await this.httpClient.get<TrendingResponse>(url);
      
      // Validate response data
      if (!DataValidator.validateTrendingResponse(response.data)) {
        throw this.createNetworkError(
          NetworkErrorType.PARSE_ERROR,
          ERROR_MESSAGES.PARSE_ERROR
        );
      }

      return response.data;
    } catch (error) {
      throw this.handleNetworkError(error);
    }
  }

  /**
   * Check if the API service is available
   * @returns Promise with boolean indicating service availability
   */
  async checkServiceHealth(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/health`;
      const response = await this.httpClient.get(url, { timeout: 5000 });
      return response.status === HttpStatusCode.OK;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle network errors and convert them to user-friendly messages
   * @param error - Original error
   * @returns NetworkError with user-friendly message
   */
  private handleNetworkError(error: any): NetworkError {
    if (error instanceof NetworkError) {
      return error;
    }

    // Handle different types of errors
    if (error.statusCode) {
      switch (error.statusCode) {
        case HttpStatusCode.NOT_FOUND:
          return this.createNetworkError(
            NetworkErrorType.SERVER_ERROR,
            ERROR_MESSAGES.NOT_FOUND,
            error.statusCode
          );
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
        case HttpStatusCode.BAD_GATEWAY:
        case HttpStatusCode.SERVICE_UNAVAILABLE:
          return this.createNetworkError(
            NetworkErrorType.SERVER_ERROR,
            ERROR_MESSAGES.SERVER_ERROR,
            error.statusCode
          );
        case HttpStatusCode.GATEWAY_TIMEOUT:
          return this.createNetworkError(
            NetworkErrorType.TIMEOUT,
            ERROR_MESSAGES.TIMEOUT_ERROR,
            error.statusCode
          );
        default:
          return this.createNetworkError(
            NetworkErrorType.SERVER_ERROR,
            ERROR_MESSAGES.SERVER_ERROR,
            error.statusCode
          );
      }
    }

    // Handle timeout errors
    if (error.message && error.message.includes('timeout')) {
      return this.createNetworkError(
        NetworkErrorType.TIMEOUT,
        ERROR_MESSAGES.TIMEOUT_ERROR
      );
    }

    // Handle connection errors
    if (error.message && (error.message.includes('network') || error.message.includes('connection'))) {
      return this.createNetworkError(
        NetworkErrorType.CONNECTION_ERROR,
        ERROR_MESSAGES.NETWORK_ERROR
      );
    }

    // Default to unknown error
    return this.createNetworkError(
      NetworkErrorType.UNKNOWN_ERROR,
      ERROR_MESSAGES.UNKNOWN_ERROR
    );
  }

  /**
   * Create a NetworkError object
   * @param type - Error type
   * @param message - Error message
   * @param statusCode - Optional HTTP status code
   * @param originalError - Optional original error
   * @returns NetworkError object
   */
  private createNetworkError(
    type: NetworkErrorType,
    message: string,
    statusCode?: number,
    originalError?: Error
  ): NetworkError {
    return {
      type,
      message,
      statusCode,
      originalError
    };
  }

  /**
   * Validate date format (YYYY-MM-DD)
   * @param date - Date string to validate
   * @returns true if valid, false otherwise
   */
  private isValidDateFormat(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }

    // Check if the date is actually valid
    const parsedDate = new Date(date);
    const [year, month, day] = date.split('-').map(Number);
    
    return parsedDate.getFullYear() === year &&
           parsedDate.getMonth() === month - 1 &&
           parsedDate.getDate() === day;
  }

  /**
   * Format date to API format (YYYY-MM-DD)
   * @param date - Date object
   * @returns Formatted date string
   */
  static formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get today's date in API format
   * @returns Today's date in YYYY-MM-DD format
   */
  static getTodayDate(): string {
    return this.formatDateForApi(new Date());
  }

  /**
   * Get yesterday's date in API format
   * @returns Yesterday's date in YYYY-MM-DD format
   */
  static getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.formatDateForApi(yesterday);
  }
}
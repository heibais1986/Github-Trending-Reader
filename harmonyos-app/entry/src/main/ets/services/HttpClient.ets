/**
 * HTTP client wrapper for network requests in HarmonyOS
 */

import http from '@ohos.net.http';
import {
  RequestConfig,
  HttpResponse,
  NetworkError,
  NetworkErrorType,
  RetryConfig,
  DEFAULT_REQUEST_CONFIG,
  DEFAULT_RETRY_CONFIG,
  NETWORK_TIMEOUTS
} from '../models/NetworkModels';

/**
 * HTTP client class for making network requests
 */
export class HttpClient {
  private retryConfig: RetryConfig;

  constructor(retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG) {
    this.retryConfig = retryConfig;
  }

  /**
   * Make a GET request
   * @param url - Request URL
   * @param config - Optional request configuration
   * @returns Promise with HTTP response
   */
  async get<T>(url: string, config?: Partial<RequestConfig>): Promise<HttpResponse<T>> {
    const requestConfig: RequestConfig = {
      url,
      method: 'GET',
      ...DEFAULT_REQUEST_CONFIG,
      ...config
    };

    return this.executeRequest<T>(requestConfig);
  }

  /**
   * Make a POST request
   * @param url - Request URL
   * @param data - Request body data
   * @param config - Optional request configuration
   * @returns Promise with HTTP response
   */
  async post<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<HttpResponse<T>> {
    const requestConfig: RequestConfig = {
      url,
      method: 'POST',
      ...DEFAULT_REQUEST_CONFIG,
      ...config
    };

    return this.executeRequestWithData<T>(requestConfig, data);
  }

  /**
   * Execute HTTP request with retry mechanism
   * @param config - Request configuration
   * @returns Promise with HTTP response
   */
  private async executeRequest<T>(config: RequestConfig): Promise<HttpResponse<T>> {
    let lastError: NetworkError | null = null;
    
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await this.makeHttpRequest<T>(config);
        return response;
      } catch (error) {
        lastError = error as NetworkError;
        
        // Don't retry on client errors (4xx)
        if (lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500) {
          throw lastError;
        }
        
        // If this is the last attempt, throw the error
        if (attempt === this.retryConfig.maxRetries) {
          throw lastError;
        }
        
        // Wait before retrying
        const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  /**
   * Execute HTTP request with data payload
   * @param config - Request configuration
   * @param data - Request body data
   * @returns Promise with HTTP response
   */
  private async executeRequestWithData<T>(config: RequestConfig, data?: any): Promise<HttpResponse<T>> {
    // For POST requests, we'll implement this when needed
    // For now, focus on GET requests for the trending API
    throw new Error('POST requests not implemented yet');
  }

  /**
   * Make the actual HTTP request using HarmonyOS http module
   * @param config - Request configuration
   * @returns Promise with HTTP response
   */
  private async makeHttpRequest<T>(config: RequestConfig): Promise<HttpResponse<T>> {
    return new Promise((resolve, reject) => {
      const httpRequest = http.createHttp();
      
      const requestOptions: http.HttpRequestOptions = {
        method: config.method as http.RequestMethod,
        header: config.headers || {},
        connectTimeout: config.timeout || NETWORK_TIMEOUTS.DEFAULT,
        readTimeout: config.timeout || NETWORK_TIMEOUTS.DEFAULT
      };

      httpRequest.request(config.url, requestOptions)
        .then((response: http.HttpResponse) => {
          try {
            // Parse response data
            let parsedData: T;
            if (typeof response.result === 'string') {
              parsedData = JSON.parse(response.result) as T;
            } else {
              parsedData = response.result as T;
            }

            const httpResponse: HttpResponse<T> = {
              data: parsedData,
              status: response.responseCode,
              statusText: this.getStatusText(response.responseCode),
              headers: response.header || {}
            };

            // Check if response indicates an error
            if (response.responseCode >= 400) {
              const error: NetworkError = {
                type: this.getErrorTypeFromStatus(response.responseCode),
                message: `HTTP ${response.responseCode}: ${this.getStatusText(response.responseCode)}`,
                statusCode: response.responseCode
              };
              reject(error);
            } else {
              resolve(httpResponse);
            }
          } catch (parseError) {
            const error: NetworkError = {
              type: NetworkErrorType.PARSE_ERROR,
              message: 'Failed to parse response data',
              originalError: parseError as Error
            };
            reject(error);
          } finally {
            httpRequest.destroy();
          }
        })
        .catch((error) => {
          const networkError: NetworkError = {
            type: NetworkErrorType.CONNECTION_ERROR,
            message: 'Network request failed',
            originalError: error
          };
          reject(networkError);
          httpRequest.destroy();
        });
    });
  }

  /**
   * Get HTTP status text from status code
   * @param statusCode - HTTP status code
   * @returns Status text
   */
  private getStatusText(statusCode: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout'
    };
    
    return statusTexts[statusCode] || 'Unknown Status';
  }

  /**
   * Get network error type from HTTP status code
   * @param statusCode - HTTP status code
   * @returns Network error type
   */
  private getErrorTypeFromStatus(statusCode: number): NetworkErrorType {
    if (statusCode >= 500) {
      return NetworkErrorType.SERVER_ERROR;
    } else if (statusCode === 408 || statusCode === 504) {
      return NetworkErrorType.TIMEOUT;
    } else {
      return NetworkErrorType.CONNECTION_ERROR;
    }
  }

  /**
   * Sleep utility function for retry delays
   * @param ms - Milliseconds to sleep
   * @returns Promise that resolves after the delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
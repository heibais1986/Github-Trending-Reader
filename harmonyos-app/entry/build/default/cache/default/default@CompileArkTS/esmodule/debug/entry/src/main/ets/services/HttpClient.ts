import http from "@ohos:net.http";
import { NetworkErrorType, DEFAULT_REQUEST_CONFIG, DEFAULT_RETRY_CONFIG } from "@bundle:com.github.trending/entry/ets/models/NetworkModels";
import type { RequestConfig, HttpResponse, NetworkError, RetryConfig } from "@bundle:com.github.trending/entry/ets/models/NetworkModels";
/**
 * HTTP status text mapping interface
 */
interface HttpStatusText {
    statusCode: number;
    text: string;
}
/**
 * Request configuration interface for object literals
 */
interface RequestConfigOptions {
    url: string;
    method: string;
    timeout: number;
    retryCount: number;
    headers: Record<string, string>;
}
/**
 * Error data interface for JSON parsing
 */
interface ErrorData {
    type: NetworkErrorType;
    message: string;
    statusCode?: number;
}
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
        const customHeaders: Record<string, string> = config?.headers ? config.headers as Record<string, string> : {};
        const defaultHeaders: Record<string, string> = DEFAULT_REQUEST_CONFIG.headers || {};
        const mergedHeaders: Record<string, string> = this.mergeHeaders(defaultHeaders, customHeaders);
        const defaultTimeout: number = DEFAULT_REQUEST_CONFIG.timeout || 10000;
        const defaultRetryCount: number = DEFAULT_REQUEST_CONFIG.retryCount || 3;
        const timeoutValue: number = config?.timeout !== undefined ? config.timeout as number : defaultTimeout;
        const retryCountValue: number = config?.retryCount !== undefined ? config.retryCount as number : defaultRetryCount;
        const requestConfig: RequestConfig = {
            url: url,
            method: 'GET' as 'GET',
            timeout: timeoutValue,
            retryCount: retryCountValue,
            headers: mergedHeaders
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
    async post<T>(url: string, data?: Record<string, string | number | boolean>, config?: Partial<RequestConfig>): Promise<HttpResponse<T>> {
        const customHeaders: Record<string, string> = config?.headers ? config.headers as Record<string, string> : {};
        const defaultHeaders: Record<string, string> = DEFAULT_REQUEST_CONFIG.headers || {};
        const mergedHeaders: Record<string, string> = this.mergeHeaders(defaultHeaders, customHeaders);
        const defaultTimeout: number = DEFAULT_REQUEST_CONFIG.timeout || 10000;
        const defaultRetryCount: number = DEFAULT_REQUEST_CONFIG.retryCount || 3;
        const timeoutValue: number = config?.timeout !== undefined ? config.timeout as number : defaultTimeout;
        const retryCountValue: number = config?.retryCount !== undefined ? config.retryCount as number : defaultRetryCount;
        const requestConfig: RequestConfig = {
            url: url,
            method: 'POST' as 'POST',
            timeout: timeoutValue,
            retryCount: retryCountValue,
            headers: mergedHeaders
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
            }
            catch (error) {
                const errorObj = error as Error;
                let errorData: ErrorData;
                try {
                    errorData = JSON.parse(errorObj.message || '{}') as ErrorData;
                }
                catch (parseError) {
                    const fallbackError: ErrorData = { type: NetworkErrorType.UNKNOWN_ERROR, message: 'Parse error' };
                    errorData = fallbackError;
                }
                lastError = {
                    type: errorData.type as NetworkErrorType,
                    message: errorData.message as string,
                    statusCode: errorData.statusCode as number,
                    originalError: errorObj
                };
                // Don't retry on client errors (4xx)
                if (lastError && lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500) {
                    throw errorObj;
                }
                // If this is the last attempt, throw the error
                if (attempt === this.retryConfig.maxRetries) {
                    throw errorObj;
                }
                // Wait before retrying
                const backoffMultiplier = this.retryConfig.backoffMultiplier;
                let delay = this.retryConfig.retryDelay;
                for (let i = 0; i < attempt; i++) {
                    delay = delay * backoffMultiplier;
                }
                await this.sleep(delay);
            }
        }
        const finalError: NetworkError = lastError || {
            type: NetworkErrorType.UNKNOWN_ERROR,
            message: 'Request failed after all retry attempts'
        };
        throw new Error(JSON.stringify(finalError));
    }
    /**
     * Execute HTTP request with data payload
     * @param config - Request configuration
     * @param data - Request body data
     * @returns Promise with HTTP response
     */
    private async executeRequestWithData<T>(config: RequestConfig, data?: Record<string, string | number | boolean>): Promise<HttpResponse<T>> {
        // For POST requests, we'll implement this when needed
        // For now, focus on GET requests for the trending API
        const errorObj: NetworkError = {
            type: NetworkErrorType.UNKNOWN_ERROR,
            message: 'POST requests not implemented yet'
        };
        const error = new Error(JSON.stringify(errorObj));
        return Promise.reject(error);
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
                header: config.headers,
                connectTimeout: config.timeout || 10000,
                readTimeout: config.timeout || 10000
            };
            httpRequest.request(config.url, requestOptions)
                .then((response: http.HttpResponse) => {
                try {
                    // Parse response data
                    let parsedData: T;
                    if (typeof response.result === 'string') {
                        parsedData = JSON.parse(response.result) as T;
                    }
                    else {
                        parsedData = response.result as T;
                    }
                    const httpResponse: HttpResponse<T> = {
                        data: parsedData,
                        status: response.responseCode,
                        statusText: this.getStatusText(response.responseCode),
                        headers: response.header ? response.header as Record<string, string> : {}
                    };
                    // Check if response indicates an error
                    if (response.responseCode >= 400) {
                        const error: NetworkError = {
                            type: this.getErrorTypeFromStatus(response.responseCode),
                            message: `HTTP ${response.responseCode}: ${this.getStatusText(response.responseCode)}`,
                            statusCode: response.responseCode
                        };
                        reject(new Error(JSON.stringify(error)));
                    }
                    else {
                        resolve(httpResponse);
                    }
                }
                catch (parseError) {
                    const error: NetworkError = {
                        type: NetworkErrorType.PARSE_ERROR,
                        message: 'Failed to parse response data',
                        originalError: parseError as Error
                    };
                    reject(new Error(JSON.stringify(error)));
                }
                finally {
                    httpRequest.destroy();
                }
            })
                .catch((error: Error) => {
                const networkError: NetworkError = {
                    type: NetworkErrorType.CONNECTION_ERROR,
                    message: 'Network request failed',
                    originalError: error
                };
                reject(new Error(JSON.stringify(networkError)));
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
        const statusTexts: HttpStatusText[] = [
            { statusCode: 200, text: 'OK' },
            { statusCode: 400, text: 'Bad Request' },
            { statusCode: 401, text: 'Unauthorized' },
            { statusCode: 403, text: 'Forbidden' },
            { statusCode: 404, text: 'Not Found' },
            { statusCode: 500, text: 'Internal Server Error' },
            { statusCode: 502, text: 'Bad Gateway' },
            { statusCode: 503, text: 'Service Unavailable' },
            { statusCode: 504, text: 'Gateway Timeout' }
        ];
        const statusText = statusTexts.find(item => item.statusCode === statusCode);
        return statusText ? statusText.text : 'Unknown Status';
    }
    /**
     * Get network error type from HTTP status code
     * @param statusCode - HTTP status code
     * @returns Network error type
     */
    private getErrorTypeFromStatus(statusCode: number): NetworkErrorType {
        if (statusCode >= 500) {
            return NetworkErrorType.SERVER_ERROR;
        }
        else if (statusCode === 408 || statusCode === 504) {
            return NetworkErrorType.TIMEOUT;
        }
        else {
            return NetworkErrorType.CONNECTION_ERROR;
        }
    }
    /**
     * Sleep utility function for retry delays
     * @param ms - Milliseconds to sleep
     * @returns Promise that resolves after the delay
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => {
            // ArkTS-compatible delay implementation
            const start = this.getCurrentTime();
            while (this.getCurrentTime() - start < ms) {
                // Busy wait - this is a simple implementation for ArkTS compatibility
            }
            resolve();
        });
    }
    /**
     * Get current time in milliseconds (ArkTS compatible)
     * @returns Current time in milliseconds
     */
    private getCurrentTime(): number {
        // Use system time API for ArkTS compatibility
        // This is a placeholder implementation
        const time = new Date().getTime();
        return time;
    }
    /**
     * Merge headers from default and custom configurations
     * @param defaultHeaders - Default headers
     * @param customHeaders - Custom headers to merge
     * @returns Merged headers object
     */
    private mergeHeaders(defaultHeaders: Record<string, string>, customHeaders?: Record<string, string>): Record<string, string> {
        // Always create a new object to ensure type safety
        const mergedHeaders: Record<string, string> = {};
        // Copy default headers
        const defaultKeys = Object.keys(defaultHeaders);
        for (let i = 0; i < defaultKeys.length; i++) {
            const key = defaultKeys[i];
            mergedHeaders[key] = defaultHeaders[key];
        }
        // Override with custom headers if provided
        if (customHeaders) {
            const customKeys = Object.keys(customHeaders);
            for (let i = 0; i < customKeys.length; i++) {
                const key = customKeys[i];
                mergedHeaders[key] = customHeaders[key];
            }
        }
        return mergedHeaders;
    }
}

import { HttpClient } from "@bundle:com.github.trending/entry/ets/services/HttpClient";
import { AuthInterceptor } from "@bundle:com.github.trending/entry/ets/services/AuthInterceptor";
import { NetworkErrorType, DataValidator, ApiEndpoints, HttpStatusCode, ERROR_MESSAGES, createRepository, createRepositoryOwner } from "@bundle:com.github.trending/entry/ets/models/NetworkModels";
import type { TrendingResponse, Repository, NetworkError, RequestConfig } from "@bundle:com.github.trending/entry/ets/models/NetworkModels";
/**
 * GitHub query parameters interface
 */
interface GitHubQueryParams {
    q: string;
    sort: string;
    order: string;
    per_page: string;
}
/**
 * String entry interface for Object.entries mapping
 */
interface StringEntry {
    key: string;
    value: string;
}
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
                const error = this.createNetworkError(NetworkErrorType.PARSE_ERROR, ERROR_MESSAGES.PARSE_ERROR);
                return Promise.reject(new Error(JSON.stringify(error)));
            }
            return response.data;
        }
        catch (error) {
            const handledError = this.handleNetworkError(error as Error);
            return Promise.reject(new Error(JSON.stringify(handledError)));
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
                const error = this.createNetworkError(NetworkErrorType.PARSE_ERROR, '日期格式无效，请使用 YYYY-MM-DD 格式');
                return Promise.reject(new Error(JSON.stringify(error)));
            }
            const url = ApiEndpoints.getTrendingUrl(date);
            const response = await this.httpClient.get<TrendingResponse>(url);
            // Validate response data
            if (!DataValidator.validateTrendingResponse(response.data)) {
                const parseError = this.createNetworkError(NetworkErrorType.PARSE_ERROR, ERROR_MESSAGES.PARSE_ERROR);
                return Promise.reject(new Error(JSON.stringify(parseError)));
            }
            return response.data;
        }
        catch (error) {
            const handledError = this.handleNetworkError(error as Error);
            return Promise.reject(new Error(JSON.stringify(handledError)));
        }
    }
    /**
     * Check if the API service is available
     * @returns Promise with boolean indicating service availability
     */
    async checkServiceHealth(): Promise<boolean> {
        try {
            const url = `${this.baseUrl}/health`;
            const response = await this.httpClient.get<Record<string, object>>(url, { timeout: 5000 });
            return response.status === HttpStatusCode.OK;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Handle network errors and convert them to user-friendly messages
     * @param error - Original error
     * @returns NetworkError with user-friendly message
     */
    private handleNetworkError(error: Error): NetworkError {
        // Check if error message contains JSON data (NetworkError format)
        const errorMessage = error.message;
        if (errorMessage && errorMessage.includes('{') && errorMessage.includes('}')) {
            try {
                // Try to parse as NetworkError JSON
                const parsedError = JSON.parse(errorMessage) as Record<string, string | number | boolean>;
                if (parsedError.type && parsedError.message) {
                    const networkError: NetworkError = {
                        type: parsedError.type as NetworkErrorType,
                        message: parsedError.message as string,
                        statusCode: parsedError.statusCode as number,
                        originalError: error
                    };
                    return networkError;
                }
            }
            catch (parseError) {
                // If parsing fails, continue to default error handling
            }
        }
        // Handle different types of errors
        if (error.message) {
            // Handle timeout errors
            if (error.message.includes('timeout')) {
                return this.createNetworkError(NetworkErrorType.TIMEOUT, ERROR_MESSAGES.TIMEOUT_ERROR);
            }
            // Handle connection errors
            if (error.message.includes('network') || error.message.includes('connection')) {
                return this.createNetworkError(NetworkErrorType.CONNECTION_ERROR, ERROR_MESSAGES.NETWORK_ERROR);
            }
        }
        // Default to generic error
        return this.createNetworkError(NetworkErrorType.UNKNOWN_ERROR, ERROR_MESSAGES.UNKNOWN_ERROR);
    }
    /**
     * Create a NetworkError object
     * @param type - Error type
     * @param message - Error message
     * @param statusCode - Optional HTTP status code
     * @param originalError - Optional original error
     * @returns NetworkError object
     */
    private createNetworkError(type: NetworkErrorType, message: string, statusCode?: number, originalError?: Error): NetworkError {
        const networkError: NetworkError = {
            type,
            message,
            statusCode,
            originalError
        };
        return networkError;
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
        const dateParts = date.split('-');
        const year = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const day = Number(dateParts[2]);
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
        return NetworkService.formatDateForApi(new Date());
    }
    /**
     * Get yesterday's date in API format
     * @returns Yesterday's date in YYYY-MM-DD format
     */
    static getYesterdayDate(): string {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return NetworkService.formatDateForApi(yesterday);
    }
    /**
     * Get trending repositories from GitHub official API
     * @param query - Search query parameters
     * @returns Promise with trending repositories response
     */
    async getTrendingFromGitHubOfficial(query: Record<string, string> = {}): Promise<TrendingResponse> {
        try {
            const defaultQuery: GitHubQueryParams = {
                q: 'stars:>1 created:2024-01-01',
                sort: 'stars',
                order: 'desc',
                per_page: '30'
            };
            // Merge with custom query
            const finalQuery: GitHubQueryParams = {
                q: defaultQuery.q,
                sort: defaultQuery.sort,
                order: defaultQuery.order,
                per_page: defaultQuery.per_page
            };
            // Override with custom query values
            if (query.q !== undefined) {
                finalQuery.q = query.q;
            }
            if (query.sort !== undefined) {
                finalQuery.sort = query.sort;
            }
            if (query.order !== undefined) {
                finalQuery.order = query.order;
            }
            if (query.per_page !== undefined) {
                finalQuery.per_page = query.per_page;
            }
            const entries: StringEntry[] = [
                { key: 'q', value: finalQuery.q },
                { key: 'sort', value: finalQuery.sort },
                { key: 'order', value: finalQuery.order },
                { key: 'per_page', value: finalQuery.per_page }
            ];
            const queryString = entries
                .map((entry: StringEntry) => {
                return `${entry.key}=${encodeURIComponent(entry.value)}`;
            })
                .join('&');
            const url = `https://api.github.com/search/repositories?${queryString}`;
            const requestConfig: RequestConfig = {
                url,
                method: 'GET',
                timeout: 15000,
                retryCount: 3,
                headers: {}
            };
            // Apply authentication interceptor
            const interceptedConfig = AuthInterceptor.interceptRequest(requestConfig);
            const response = await this.httpClient.get<object>(interceptedConfig.url, {
                headers: interceptedConfig.headers || {},
                timeout: interceptedConfig.timeout || 15000
            });
            // Validate and convert response
            const responseData = response.data as Record<string, object>;
            if (!responseData || typeof responseData !== 'object') {
                const parseError = this.createNetworkError(NetworkErrorType.PARSE_ERROR, ERROR_MESSAGES.PARSE_ERROR);
                return Promise.reject(new Error(JSON.stringify(parseError)));
            }
            const trendingResponse = this.convertGitHubSearchToTrendingResponse(responseData);
            // Validate converted response
            if (!DataValidator.validateTrendingResponse(trendingResponse)) {
                const parseError = this.createNetworkError(NetworkErrorType.PARSE_ERROR, ERROR_MESSAGES.PARSE_ERROR);
                return Promise.reject(new Error(JSON.stringify(parseError)));
            }
            return trendingResponse;
        }
        catch (error) {
            const handledError = this.handleNetworkError(error as Error);
            return Promise.reject(new Error(JSON.stringify(handledError)));
        }
    }
    /**
     * Get trending repositories from zread.ai API
     * @returns Promise with trending repositories response
     */
    async getTrendingFromZRead(): Promise<TrendingResponse> {
        try {
            const url = 'https://zread.ai/api/trending';
            const response = await this.httpClient.get<object>(url, {});
            // Validate response structure
            const responseData = response.data as Record<string, object>;
            if (!responseData || typeof responseData !== 'object' ||
                !responseData.data || !Array.isArray(responseData.data)) {
                const parseError = this.createNetworkError(NetworkErrorType.PARSE_ERROR, ERROR_MESSAGES.PARSE_ERROR);
                return Promise.reject(new Error(JSON.stringify(parseError)));
            }
            // Convert zread.ai repositories to standard format
            const allRepositories: Repository[] = [];
            const dataArray = responseData.data as Array<Record<string, object>>;
            for (const section of dataArray) {
                if (section.repos && Array.isArray(section.repos)) {
                    const reposArray = section.repos as Array<Record<string, object>>;
                    for (const zReadRepo of reposArray) {
                        const repository = this.convertZReadRepositoryToRepository(zReadRepo);
                        allRepositories.push(repository);
                    }
                }
            }
            const trendingResponse: TrendingResponse = {
                date: NetworkService.getTodayDate(),
                repositories: allRepositories,
                total: allRepositories.length
            };
            // Validate converted response
            if (!DataValidator.validateTrendingResponse(trendingResponse)) {
                const parseError = this.createNetworkError(NetworkErrorType.PARSE_ERROR, ERROR_MESSAGES.PARSE_ERROR);
                return Promise.reject(new Error(JSON.stringify(parseError)));
            }
            return trendingResponse;
        }
        catch (error) {
            const handledError = this.handleNetworkError(error as Error);
            return Promise.reject(new Error(JSON.stringify(handledError)));
        }
    }
    /**
     * Get trending repositories with fallback strategy
     * Tries multiple data sources in order of preference
     * @returns Promise with trending repositories response
     */
    async getTrendingWithFallback(): Promise<TrendingResponse> {
        const errors: string[] = [];
        // Try zread.ai first (usually faster and more comprehensive)
        try {
            return await this.getTrendingFromZRead();
        }
        catch (error) {
            const errorMessage = `zread.ai API failed: ${error}`;
            errors.push(errorMessage);
        }
        // Fallback to GitHub official API
        try {
            return await this.getTrendingFromGitHubOfficial();
        }
        catch (error) {
            const errorMessage = `GitHub API failed: ${error}`;
            errors.push(errorMessage);
        }
        // If all sources fail, return comprehensive error
        const finalError = this.createNetworkError(NetworkErrorType.UNKNOWN_ERROR, `所有数据源都不可用: ${errors.join('; ')}`);
        return Promise.reject(new Error(JSON.stringify(finalError)));
    }
    /**
     * Convert GitHub search response to trending response
     * @param gitHubResponse - GitHub search response
     * @returns TrendingResponse
     */
    private convertGitHubSearchToTrendingResponse(gitHubResponse: Record<string, object>): TrendingResponse {
        const items = gitHubResponse.items;
        const repositories: Repository[] = [];
        if (items && Array.isArray(items)) {
            const itemsArray = items as Array<Record<string, object>>;
            for (const item of itemsArray) {
                const itemRecord = item as Record<string, object>;
                const ownerRecord = itemRecord.owner as Record<string, object>;
                const repository: Repository = createRepository({
                    id: String(itemRecord.id || '0'),
                    name: String(itemRecord.name || ''),
                    fullName: String(itemRecord.full_name || ''),
                    description: String(itemRecord.description || ''),
                    url: String(itemRecord.html_url || ''),
                    stars: Number(itemRecord.stargazers_count || 0),
                    language: String(itemRecord.language || ''),
                    owner: createRepositoryOwner({
                        id: String(ownerRecord?.id || '0'),
                        login: String(ownerRecord?.login || ''),
                        avatarUrl: String(ownerRecord?.avatar_url || ''),
                        url: String(ownerRecord?.html_url || '')
                    })
                });
                repositories.push(repository);
            }
        }
        return {
            date: NetworkService.getTodayDate(),
            repositories: repositories,
            total: repositories.length
        };
    }
    /**
     * Convert zread.ai repository to standard repository format
     * @param zReadRepo - zread.ai repository data
     * @returns Repository
     */
    private convertZReadRepositoryToRepository(zReadRepo: Record<string, object>): Repository {
        const ownerRecord = zReadRepo.owner as Record<string, object>;
        const repository: Repository = createRepository({
            id: String(zReadRepo.id || '0'),
            name: String(zReadRepo.name || ''),
            fullName: String(zReadRepo.full_name || ''),
            description: String(zReadRepo.description || ''),
            url: String(zReadRepo.html_url || ''),
            stars: Number(zReadRepo.stargazers_count || 0),
            language: String(zReadRepo.language || ''),
            owner: createRepositoryOwner({
                id: String(ownerRecord?.id || '0'),
                login: String(ownerRecord?.login || ''),
                avatarUrl: String(ownerRecord?.avatar_url || ''),
                url: String(ownerRecord?.html_url || '')
            })
        });
        return repository;
    }
}

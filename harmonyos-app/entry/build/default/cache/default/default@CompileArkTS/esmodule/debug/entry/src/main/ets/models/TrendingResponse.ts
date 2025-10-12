import type { Repository, RepositoryOwner } from "@bundle:com.github.trending/entry/ets/models/Repository";
/**
 * Trending response interface
 */
export interface TrendingResponse {
    date: string;
    repositories: Repository[];
    total: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
}
/**
 * API error interface
 */
export interface ApiError {
    code: string;
    message: string;
    details?: string;
    timestamp: string;
}
/**
 * Data validator class
 */
export class DataValidator {
    /**
     * Validate trending response
     */
    static validateTrendingResponse(response: TrendingResponse): boolean {
        if (!response || typeof response !== 'object') {
            return false;
        }
        if (!response.date || typeof response.date !== 'string') {
            return false;
        }
        if (!Array.isArray(response.repositories)) {
            return false;
        }
        // Validate each repository
        for (const repo of response.repositories) {
            if (!TypeGuards.isRepository(repo)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Validate repository object
     */
    static validateRepository(repository: Repository): boolean {
        return TypeGuards.isRepository(repository);
    }
    /**
     * Validate API error
     */
    static validateApiError(error: ApiError): boolean {
        if (!error || typeof error !== 'object') {
            return false;
        }
        if (!error.code || typeof error.code !== 'string') {
            return false;
        }
        if (!error.message || typeof error.message !== 'string') {
            return false;
        }
        return true;
    }
}
/**
 * Type guards for runtime type checking
 */
export class TypeGuards {
    /**
     * Type guard for Repository
     */
    static isRepository(obj: object): boolean {
        if (!obj || typeof obj !== 'object') {
            return false;
        }
        const repository = obj as Repository;
        // Check required fields using explicit property access
        const id = repository.id;
        const name = repository.name;
        const fullName = repository.fullName;
        const url = repository.url;
        const stars = repository.stars;
        const language = repository.language;
        const owner = repository.owner;
        if (id === undefined || id === null || typeof id !== 'string') {
            return false;
        }
        if (name === undefined || name === null || typeof name !== 'string') {
            return false;
        }
        if (fullName === undefined || fullName === null || typeof fullName !== 'string') {
            return false;
        }
        if (url === undefined || url === null || typeof url !== 'string') {
            return false;
        }
        if (stars === undefined || stars === null || typeof stars !== 'number') {
            return false;
        }
        if (language === undefined || language === null || typeof language !== 'string') {
            return false;
        }
        if (owner === undefined || owner === null || typeof owner !== 'object') {
            return false;
        }
        // Validate owner object using type guard
        return TypeGuards.isRepositoryOwner(owner);
    }
    /**
     * Type guard for RepositoryOwner
     */
    static isRepositoryOwner(obj: object): boolean {
        if (!obj || typeof obj !== 'object') {
            return false;
        }
        const owner = obj as RepositoryOwner;
        const ownerId = owner.id;
        const ownerLogin = owner.login;
        const ownerAvatarUrl = owner.avatarUrl;
        const ownerUrl = owner.url;
        if (ownerId === undefined || ownerId === null || typeof ownerId !== 'string') {
            return false;
        }
        if (ownerLogin === undefined || ownerLogin === null || typeof ownerLogin !== 'string') {
            return false;
        }
        if (ownerAvatarUrl === undefined || ownerAvatarUrl === null || typeof ownerAvatarUrl !== 'string') {
            return false;
        }
        if (ownerUrl === undefined || ownerUrl === null || typeof ownerUrl !== 'string') {
            return false;
        }
        return true;
    }
    /**
     * Type guard for TrendingResponse
     */
    static isTrendingResponse(obj: object): boolean {
        if (!obj || typeof obj !== 'object') {
            return false;
        }
        const response = obj as TrendingResponse;
        const date = response.date;
        const repositories = response.repositories;
        if (!date || typeof date !== 'string') {
            return false;
        }
        if (!Array.isArray(repositories)) {
            return false;
        }
        // Validate at least one repository
        if (repositories.length > 0) {
            const firstRepo = repositories[0];
            if (firstRepo && typeof firstRepo === 'object' && !TypeGuards.isRepository(firstRepo)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Type guard for ApiError
     */
    static isApiError(obj: object): boolean {
        if (!obj || typeof obj !== 'object') {
            return false;
        }
        const error = obj as ApiError;
        const code = error.code;
        const message = error.message;
        if (!code || typeof code !== 'string') {
            return false;
        }
        if (!message || typeof message !== 'string') {
            return false;
        }
        return true;
    }
}
/**
 * Factory function to create TrendingResponse
 */
export function createTrendingResponse(data: Partial<TrendingResponse> = {}): TrendingResponse {
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return {
        date: data.date || now,
        repositories: data.repositories || [],
        total: data.total || 0,
        page: data.page || 1,
        perPage: data.perPage || 30,
        totalPages: data.totalPages || 1
    };
}
/**
 * Factory function to create ApiError
 */
export function createApiError(data: Partial<ApiError> = {}): ApiError {
    return {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'An error occurred',
        details: data.details,
        timestamp: data.timestamp || new Date().toISOString()
    };
}
export { createRepository } from "@bundle:com.github.trending/entry/ets/models/Repository";
export { createRepositoryOwner } from "@bundle:com.github.trending/entry/ets/models/Repository";

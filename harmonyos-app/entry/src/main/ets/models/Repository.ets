/**
 * Repository data model representing a GitHub repository
 */
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  author: Author;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Author data model representing a GitHub repository owner
 */
export interface Author {
  name: string;
  avatar: string;
}

/**
 * API response interface for trending repositories
 */
export interface TrendingResponse {
  date: string;
  repositories: Repository[];
  total: number;
}

/**
 * API error response interface
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
}

/**
 * Data validation utility class
 */
export class DataValidator {
  /**
   * Validates if a repository object has all required fields
   * @param repo - Repository object to validate
   * @returns true if valid, false otherwise
   */
  static validateRepository(repo: any): repo is Repository {
    if (!repo || typeof repo !== 'object') {
      return false;
    }

    const requiredFields = ['id', 'name', 'fullName', 'description', 'url', 'stars', 'language', 'author'];
    
    for (const field of requiredFields) {
      if (!(field in repo)) {
        return false;
      }
    }

    // Validate field types
    if (typeof repo.id !== 'string' ||
        typeof repo.name !== 'string' ||
        typeof repo.fullName !== 'string' ||
        typeof repo.description !== 'string' ||
        typeof repo.url !== 'string' ||
        typeof repo.stars !== 'number' ||
        typeof repo.language !== 'string') {
      return false;
    }

    // Validate author object
    if (!this.validateAuthor(repo.author)) {
      return false;
    }

    return true;
  }

  /**
   * Validates if an author object has all required fields
   * @param author - Author object to validate
   * @returns true if valid, false otherwise
   */
  static validateAuthor(author: any): author is Author {
    if (!author || typeof author !== 'object') {
      return false;
    }

    return typeof author.name === 'string' && typeof author.avatar === 'string';
  }

  /**
   * Validates if a trending response has the correct structure
   * @param response - TrendingResponse object to validate
   * @returns true if valid, false otherwise
   */
  static validateTrendingResponse(response: any): response is TrendingResponse {
    if (!response || typeof response !== 'object') {
      return false;
    }

    if (typeof response.date !== 'string' ||
        typeof response.total !== 'number' ||
        !Array.isArray(response.repositories)) {
      return false;
    }

    // Validate each repository in the array
    for (const repo of response.repositories) {
      if (!this.validateRepository(repo)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validates if an API error response has the correct structure
   * @param error - ApiError object to validate
   * @returns true if valid, false otherwise
   */
  static validateApiError(error: any): error is ApiError {
    if (!error || typeof error !== 'object') {
      return false;
    }

    if (!error.error || typeof error.error !== 'object') {
      return false;
    }

    return typeof error.error.code === 'string' &&
           typeof error.error.message === 'string' &&
           typeof error.timestamp === 'string';
  }
}

/**
 * Type guard functions for runtime type checking
 */
export class TypeGuards {
  /**
   * Type guard for Repository interface
   */
  static isRepository(obj: any): obj is Repository {
    return DataValidator.validateRepository(obj);
  }

  /**
   * Type guard for Author interface
   */
  static isAuthor(obj: any): obj is Author {
    return DataValidator.validateAuthor(obj);
  }

  /**
   * Type guard for TrendingResponse interface
   */
  static isTrendingResponse(obj: any): obj is TrendingResponse {
    return DataValidator.validateTrendingResponse(obj);
  }

  /**
   * Type guard for ApiError interface
   */
  static isApiError(obj: any): obj is ApiError {
    return DataValidator.validateApiError(obj);
  }
}
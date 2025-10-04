/**
 * Service manager for centralized service access and configuration
 */

import { NetworkService } from './NetworkService';
import { HttpClient } from './HttpClient';
import { RetryConfig, DEFAULT_RETRY_CONFIG } from '../models/NetworkModels';

/**
 * Service manager class for managing application services
 */
export class ServiceManager {
  private static instance: ServiceManager;
  private networkService: NetworkService | null = null;
  private httpClient: HttpClient | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance of ServiceManager
   * @returns ServiceManager instance
   */
  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * Initialize services with configuration
   * @param config - Service configuration
   */
  initialize(config?: ServiceConfig): void {
    const serviceConfig = { ...DEFAULT_SERVICE_CONFIG, ...config };
    
    // Initialize HTTP client with retry configuration
    this.httpClient = new HttpClient(serviceConfig.retryConfig);
    
    // Initialize network service with base URL
    this.networkService = new NetworkService(serviceConfig.baseUrl);
  }

  /**
   * Get network service instance
   * @returns NetworkService instance
   */
  getNetworkService(): NetworkService {
    if (!this.networkService) {
      throw new Error('ServiceManager not initialized. Call initialize() first.');
    }
    return this.networkService;
  }

  /**
   * Get HTTP client instance
   * @returns HttpClient instance
   */
  getHttpClient(): HttpClient {
    if (!this.httpClient) {
      throw new Error('ServiceManager not initialized. Call initialize() first.');
    }
    return this.httpClient;
  }

  /**
   * Reset all services (useful for testing)
   */
  reset(): void {
    this.networkService = null;
    this.httpClient = null;
  }

  /**
   * Check if services are initialized
   * @returns true if initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.networkService !== null && this.httpClient !== null;
  }
}

/**
 * Service configuration interface
 */
export interface ServiceConfig {
  baseUrl?: string;
  retryConfig?: RetryConfig;
  enableLogging?: boolean;
}

/**
 * Default service configuration
 */
export const DEFAULT_SERVICE_CONFIG: ServiceConfig = {
  baseUrl: 'https://your-domain.com',
  retryConfig: DEFAULT_RETRY_CONFIG,
  enableLogging: false
};

/**
 * Convenience function to get network service
 * @returns NetworkService instance
 */
export function getNetworkService(): NetworkService {
  return ServiceManager.getInstance().getNetworkService();
}

/**
 * Convenience function to get HTTP client
 * @returns HttpClient instance
 */
export function getHttpClient(): HttpClient {
  return ServiceManager.getInstance().getHttpClient();
}

/**
 * Initialize services with default or custom configuration
 * @param config - Optional service configuration
 */
export function initializeServices(config?: ServiceConfig): void {
  ServiceManager.getInstance().initialize(config);
}
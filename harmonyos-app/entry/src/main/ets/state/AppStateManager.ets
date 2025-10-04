/**
 * Application state manager for centralized state management
 * Implements reactive state management with loading and error handling
 */

import { Repository, TrendingResponse, NetworkError } from '../models';
import { LoadingState, AppState, INITIAL_APP_STATE } from '../models/NetworkModels';
import { NetworkService } from '../services/NetworkService';

/**
 * State change listener interface
 */
export interface StateChangeListener {
  onStateChanged(newState: AppState): void;
}

/**
 * Application state manager class
 * Provides centralized state management with reactive updates
 */
export class AppStateManager {
  private static instance: AppStateManager;
  private currentState: AppState;
  private listeners: Set<StateChangeListener> = new Set();
  private networkService: NetworkService;

  private constructor() {
    this.currentState = { ...INITIAL_APP_STATE };
    this.networkService = new NetworkService();
  }

  /**
   * Get singleton instance of AppStateManager
   */
  static getInstance(): AppStateManager {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  /**
   * Get current application state
   */
  getState(): AppState {
    return { ...this.currentState };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Update state and notify listeners
   */
  private setState(newState: Partial<AppState>): void {
    const previousState = { ...this.currentState };
    this.currentState = { ...this.currentState, ...newState };
    
    // Notify all listeners of state change
    this.listeners.forEach(listener => {
      try {
        listener.onStateChanged(this.currentState);
      } catch (error) {
        console.error('Error in state change listener:', error);
      }
    });
  }

  /**
   * Load trending repositories
   */
  async loadTrendingRepositories(date?: string): Promise<void> {
    try {
      // Set loading state
      this.setState({
        loadingState: LoadingState.LOADING,
        error: null
      });

      // Fetch data from network service
      const response: TrendingResponse = date 
        ? await this.networkService.getTrendingRepositoriesByDate(date)
        : await this.networkService.getTrendingRepositories();

      // Update state with successful response
      this.setState({
        repositories: response.repositories,
        loadingState: LoadingState.SUCCESS,
        error: null,
        lastUpdated: new Date().toLocaleString('zh-CN'),
        selectedDate: date || null
      });

    } catch (error) {
      console.error('Failed to load trending repositories:', error);
      
      // Update state with error
      this.setState({
        loadingState: LoadingState.ERROR,
        error: error as NetworkError
      });

      // Re-throw error for component-level handling if needed
      throw error;
    }
  }

  /**
   * Refresh current data
   */
  async refresh(): Promise<void> {
    const currentDate = this.currentState.selectedDate;
    await this.loadTrendingRepositories(currentDate || undefined);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.setState({
      error: null
    });
  }

  /**
   * Reset state to initial values
   */
  reset(): void {
    this.setState({ ...INITIAL_APP_STATE });
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.currentState.loadingState === LoadingState.LOADING;
  }

  /**
   * Check if there's an error
   */
  hasError(): boolean {
    return this.currentState.error !== null;
  }

  /**
   * Check if data is available
   */
  hasData(): boolean {
    return this.currentState.repositories.length > 0;
  }

  /**
   * Get repositories
   */
  getRepositories(): Repository[] {
    return [...this.currentState.repositories];
  }

  /**
   * Get current error
   */
  getError(): NetworkError | null {
    return this.currentState.error;
  }

  /**
   * Get loading state
   */
  getLoadingState(): LoadingState {
    return this.currentState.loadingState;
  }

  /**
   * Get last updated timestamp
   */
  getLastUpdated(): string | null {
    return this.currentState.lastUpdated;
  }

  /**
   * Get selected date
   */
  getSelectedDate(): string | null {
    return this.currentState.selectedDate;
  }

  /**
   * Set selected date for filtering
   */
  setSelectedDate(date: string | null): void {
    this.setState({
      selectedDate: date
    });
  }

  /**
   * Check network service health
   */
  async checkServiceHealth(): Promise<boolean> {
    try {
      return await this.networkService.checkServiceHealth();
    } catch (error) {
      console.error('Service health check failed:', error);
      return false;
    }
  }
}
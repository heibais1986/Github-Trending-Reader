/**
 * State hooks for reactive state management in HarmonyOS components
 * Provides easy integration between AppStateManager and UI components
 */

import { AppStateManager, StateChangeListener } from './AppStateManager';
import { AppState, LoadingState } from '../models/NetworkModels';
import { Repository, NetworkError } from '../models';

/**
 * State hook result interface
 */
export interface UseAppStateResult {
  state: AppState;
  actions: AppStateActions;
}

/**
 * Available state actions interface
 */
export interface AppStateActions {
  loadTrendingRepositories: (date?: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
  setSelectedDate: (date: string | null) => void;
  checkServiceHealth: () => Promise<boolean>;
}

/**
 * Component state interface for reactive updates
 */
export interface ComponentState {
  repositories: Repository[];
  loadingState: LoadingState;
  error: NetworkError | null;
  lastUpdated: string | null;
  selectedDate: string | null;
  isRefreshing: boolean;
}

/**
 * State hook class for component integration
 */
export class StateHook implements StateChangeListener {
  private stateManager: AppStateManager;
  private componentState: ComponentState;
  private updateCallback: (state: ComponentState) => void;

  constructor(updateCallback: (state: ComponentState) => void) {
    this.stateManager = AppStateManager.getInstance();
    this.updateCallback = updateCallback;
    
    // Initialize component state from app state
    const appState = this.stateManager.getState();
    this.componentState = {
      ...appState,
      isRefreshing: false
    };

    // Subscribe to state changes
    this.stateManager.subscribe(this);
  }

  /**
   * Handle state changes from AppStateManager
   */
  onStateChanged(newState: AppState): void {
    this.componentState = {
      ...newState,
      isRefreshing: this.componentState.isRefreshing
    };
    
    // Notify component of state change
    this.updateCallback(this.componentState);
  }

  /**
   * Get current component state
   */
  getState(): ComponentState {
    return { ...this.componentState };
  }

  /**
   * Load trending repositories with refresh state management
   */
  async loadTrendingRepositories(date?: string): Promise<void> {
    try {
      await this.stateManager.loadTrendingRepositories(date);
    } catch (error) {
      // Error is already handled by state manager
      console.error('Load repositories failed:', error);
    }
  }

  /**
   * Refresh data with refresh state management
   */
  async refresh(): Promise<void> {
    if (this.componentState.isRefreshing) {
      return;
    }

    try {
      this.setRefreshing(true);
      await this.stateManager.refresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      this.setRefreshing(false);
    }
  }

  /**
   * Set refreshing state
   */
  private setRefreshing(isRefreshing: boolean): void {
    this.componentState.isRefreshing = isRefreshing;
    this.updateCallback(this.componentState);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.stateManager.clearError();
  }

  /**
   * Reset state
   */
  reset(): void {
    this.stateManager.reset();
  }

  /**
   * Set selected date
   */
  setSelectedDate(date: string | null): void {
    this.stateManager.setSelectedDate(date);
  }

  /**
   * Check service health
   */
  async checkServiceHealth(): Promise<boolean> {
    return await this.stateManager.checkServiceHealth();
  }

  /**
   * Cleanup subscription
   */
  destroy(): void {
    // Note: In a real implementation, we would need to unsubscribe
    // For now, we'll rely on the component lifecycle
  }
}

/**
 * Factory function to create state hook for components
 */
export function createStateHook(updateCallback: (state: ComponentState) => void): StateHook {
  return new StateHook(updateCallback);
}

/**
 * Utility functions for state management
 */
export class StateUtils {
  /**
   * Check if state indicates loading
   */
  static isLoading(state: ComponentState): boolean {
    return state.loadingState === LoadingState.LOADING;
  }

  /**
   * Check if state has error
   */
  static hasError(state: ComponentState): boolean {
    return state.error !== null;
  }

  /**
   * Check if state has data
   */
  static hasData(state: ComponentState): boolean {
    return state.repositories.length > 0;
  }

  /**
   * Check if currently refreshing
   */
  static isRefreshing(state: ComponentState): boolean {
    return state.isRefreshing;
  }

  /**
   * Get user-friendly error message
   */
  static getErrorMessage(state: ComponentState): string {
    if (!state.error) {
      return '';
    }
    return state.error.message || '未知错误';
  }

  /**
   * Check if should show loading indicator
   */
  static shouldShowLoading(state: ComponentState): boolean {
    return this.isLoading(state) && !this.hasData(state);
  }

  /**
   * Check if should show error view
   */
  static shouldShowError(state: ComponentState): boolean {
    return this.hasError(state) && !this.hasData(state);
  }

  /**
   * Check if should show content
   */
  static shouldShowContent(state: ComponentState): boolean {
    return this.hasData(state) || (!this.isLoading(state) && !this.hasError(state));
  }
}
/**
 * Performance optimization utilities for smooth UI interactions
 * Provides debouncing, throttling, and animation optimization
 */

/**
 * Debounce function type
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Throttle function type
 */
export type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Performance optimizer class
 */
export class PerformanceOptimizer {
  private static debounceTimers: Map<string, number> = new Map();
  private static throttleTimers: Map<string, number> = new Map();

  /**
   * Debounce function execution
   * @param func - Function to debounce
   * @param delay - Delay in milliseconds
   * @param key - Unique key for the debounced function
   * @returns Debounced function
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    key: string
  ): DebouncedFunction<T> {
    return (...args: Parameters<T>) => {
      // Clear existing timer
      const existingTimer = this.debounceTimers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        func(...args);
        this.debounceTimers.delete(key);
      }, delay);

      this.debounceTimers.set(key, timer);
    };
  }

  /**
   * Throttle function execution
   * @param func - Function to throttle
   * @param delay - Delay in milliseconds
   * @param key - Unique key for the throttled function
   * @returns Throttled function
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    key: string
  ): ThrottledFunction<T> {
    return (...args: Parameters<T>) => {
      const existingTimer = this.throttleTimers.get(key);
      if (existingTimer) {
        return; // Function is already scheduled
      }

      // Execute immediately
      func(...args);

      // Set timer to prevent further executions
      const timer = setTimeout(() => {
        this.throttleTimers.delete(key);
      }, delay);

      this.throttleTimers.set(key, timer);
    };
  }

  /**
   * Create optimized scroll handler
   * @param onScroll - Scroll handler function
   * @param key - Unique key for the scroll handler
   * @returns Optimized scroll handler
   */
  static createOptimizedScrollHandler(
    onScroll: (scrollOffset: number) => void,
    key: string = 'default-scroll'
  ): (scrollOffset: number) => void {
    return this.throttle(onScroll, 16, key); // ~60fps
  }

  /**
   * Create optimized search handler
   * @param onSearch - Search handler function
   * @param delay - Debounce delay (default: 300ms)
   * @param key - Unique key for the search handler
   * @returns Optimized search handler
   */
  static createOptimizedSearchHandler(
    onSearch: (query: string) => void,
    delay: number = 300,
    key: string = 'default-search'
  ): (query: string) => void {
    return this.debounce(onSearch, delay, key);
  }

  /**
   * Create optimized refresh handler
   * @param onRefresh - Refresh handler function
   * @param delay - Throttle delay (default: 1000ms)
   * @param key - Unique key for the refresh handler
   * @returns Optimized refresh handler
   */
  static createOptimizedRefreshHandler(
    onRefresh: () => void,
    delay: number = 1000,
    key: string = 'default-refresh'
  ): () => void {
    return this.throttle(onRefresh, delay, key);
  }

  /**
   * Cleanup all timers for a specific key
   * @param key - Key to cleanup
   */
  static cleanup(key: string): void {
    const debounceTimer = this.debounceTimers.get(key);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      this.debounceTimers.delete(key);
    }

    const throttleTimer = this.throttleTimers.get(key);
    if (throttleTimer) {
      clearTimeout(throttleTimer);
      this.throttleTimers.delete(key);
    }
  }

  /**
   * Cleanup all timers
   */
  static cleanupAll(): void {
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.throttleTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
    this.throttleTimers.clear();
  }
}

/**
 * Animation optimization utilities
 */
export class AnimationOptimizer {
  /**
   * Get optimized animation configuration for list items
   */
  static getListItemAnimation(): AnimateParam {
    return {
      duration: 200,
      curve: Curve.EaseInOut,
      playMode: PlayMode.Normal
    };
  }

  /**
   * Get optimized animation configuration for button press
   */
  static getButtonPressAnimation(): AnimateParam {
    return {
      duration: 150,
      curve: Curve.EaseOut,
      playMode: PlayMode.Normal
    };
  }

  /**
   * Get optimized animation configuration for loading states
   */
  static getLoadingAnimation(): AnimateParam {
    return {
      duration: 1000,
      curve: Curve.Linear,
      iterations: -1,
      playMode: PlayMode.Normal
    };
  }

  /**
   * Get optimized animation configuration for fade transitions
   */
  static getFadeAnimation(duration: number = 300): AnimateParam {
    return {
      duration,
      curve: Curve.EaseInOut,
      playMode: PlayMode.Normal
    };
  }

  /**
   * Get optimized animation configuration for scale transitions
   */
  static getScaleAnimation(duration: number = 200): AnimateParam {
    return {
      duration,
      curve: Curve.EaseOut,
      playMode: PlayMode.Normal
    };
  }
}

/**
 * UI responsiveness utilities
 */
export class ResponsivenessUtils {
  private static deviceInfo: DeviceInfo | null = null;
  private static performanceLevel: 'low' | 'medium' | 'high' = 'medium';

  /**
   * Initialize device performance detection
   */
  static initialize(): void {
    try {
      // Get device information for performance optimization
      this.detectPerformanceLevel();
    } catch (error) {
      console.warn('Failed to detect device performance level:', error);
    }
  }

  /**
   * Detect device performance level
   */
  private static detectPerformanceLevel(): void {
    // Placeholder implementation - in real app, you would use device APIs
    // to detect RAM, CPU, and other performance indicators
    this.performanceLevel = 'medium';
  }

  /**
   * Check if device is in low performance mode
   */
  static isLowPerformanceMode(): boolean {
    return this.performanceLevel === 'low';
  }

  /**
   * Check if device is in high performance mode
   */
  static isHighPerformanceMode(): boolean {
    return this.performanceLevel === 'high';
  }

  /**
   * Get optimized list item height based on device performance
   */
  static getOptimizedListItemHeight(): number {
    switch (this.performanceLevel) {
      case 'low':
        return 80;
      case 'high':
        return 140;
      default:
        return 120;
    }
  }

  /**
   * Get optimized animation duration based on device performance
   */
  static getOptimizedAnimationDuration(baseDuration: number): number {
    switch (this.performanceLevel) {
      case 'low':
        return baseDuration * 0.5;
      case 'high':
        return baseDuration * 1.2;
      default:
        return baseDuration;
    }
  }

  /**
   * Get optimized shadow configuration based on device performance
   */
  static getOptimizedShadow(): ShadowOptions | undefined {
    if (this.isLowPerformanceMode()) {
      return undefined; // Disable shadows on low-performance devices
    }
    
    const shadowIntensity = this.isHighPerformanceMode() ? 0.2 : 0.15;
    
    return {
      radius: this.isHighPerformanceMode() ? 6 : 4,
      color: `#000000${Math.floor(shadowIntensity * 255).toString(16).padStart(2, '0')}`,
      offsetX: 0,
      offsetY: this.isHighPerformanceMode() ? 3 : 2
    };
  }

  /**
   * Get optimized blur configuration based on device performance
   */
  static getOptimizedBlur(): number {
    switch (this.performanceLevel) {
      case 'low':
        return 0;
      case 'high':
        return 15;
      default:
        return 10;
    }
  }

  /**
   * Get optimized image quality settings
   */
  static getOptimizedImageQuality(): {
    quality: number;
    enableCaching: boolean;
    maxCacheSize: number;
  } {
    switch (this.performanceLevel) {
      case 'low':
        return {
          quality: 0.7,
          enableCaching: true,
          maxCacheSize: 50 * 1024 * 1024 // 50MB
        };
      case 'high':
        return {
          quality: 0.95,
          enableCaching: true,
          maxCacheSize: 200 * 1024 * 1024 // 200MB
        };
      default:
        return {
          quality: 0.85,
          enableCaching: true,
          maxCacheSize: 100 * 1024 * 1024 // 100MB
        };
    }
  }

  /**
   * Get optimized list rendering settings
   */
  static getOptimizedListSettings(): {
    cachedCount: number;
    enableLazyLoading: boolean;
    itemReuseId: string;
  } {
    switch (this.performanceLevel) {
      case 'low':
        return {
          cachedCount: 3,
          enableLazyLoading: true,
          itemReuseId: 'repo-item-low'
        };
      case 'high':
        return {
          cachedCount: 8,
          enableLazyLoading: false,
          itemReuseId: 'repo-item-high'
        };
      default:
        return {
          cachedCount: 5,
          enableLazyLoading: true,
          itemReuseId: 'repo-item-medium'
        };
    }
  }

  /**
   * Get optimized network settings
   */
  static getOptimizedNetworkSettings(): {
    timeout: number;
    retryCount: number;
    enableCompression: boolean;
  } {
    return {
      timeout: this.isLowPerformanceMode() ? 15000 : 10000,
      retryCount: this.isLowPerformanceMode() ? 2 : 3,
      enableCompression: !this.isLowPerformanceMode()
    };
  }
}

/**
 * Memory management utilities
 */
export class MemoryOptimizer {
  private static memoryWarningCallbacks: Array<() => void> = [];
  private static isMemoryPressure: boolean = false;

  /**
   * Register callback for memory warning events
   */
  static onMemoryWarning(callback: () => void): void {
    this.memoryWarningCallbacks.push(callback);
  }

  /**
   * Trigger memory warning cleanup
   */
  static triggerMemoryWarning(): void {
    this.isMemoryPressure = true;
    this.memoryWarningCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Memory warning callback failed:', error);
      }
    });
  }

  /**
   * Clear memory warning state
   */
  static clearMemoryWarning(): void {
    this.isMemoryPressure = false;
  }

  /**
   * Check if system is under memory pressure
   */
  static isUnderMemoryPressure(): boolean {
    return this.isMemoryPressure;
  }

  /**
   * Get memory-optimized settings
   */
  static getMemoryOptimizedSettings(): {
    maxCachedItems: number;
    enableImageCaching: boolean;
    enableDataPrefetch: boolean;
  } {
    if (this.isMemoryPressure) {
      return {
        maxCachedItems: 10,
        enableImageCaching: false,
        enableDataPrefetch: false
      };
    }

    return {
      maxCachedItems: ResponsivenessUtils.isHighPerformanceMode() ? 50 : 30,
      enableImageCaching: true,
      enableDataPrefetch: !ResponsivenessUtils.isLowPerformanceMode()
    };
  }
}

/**
 * Startup optimization utilities
 */
export class StartupOptimizer {
  private static initializationTasks: Array<{
    name: string;
    task: () => Promise<void>;
    priority: 'high' | 'medium' | 'low';
  }> = [];

  /**
   * Register initialization task
   */
  static registerInitTask(
    name: string,
    task: () => Promise<void>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): void {
    this.initializationTasks.push({ name, task, priority });
  }

  /**
   * Execute initialization tasks in priority order
   */
  static async executeInitTasks(): Promise<void> {
    // Sort by priority
    const sortedTasks = this.initializationTasks.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Execute high priority tasks first
    const highPriorityTasks = sortedTasks.filter(t => t.priority === 'high');
    for (const task of highPriorityTasks) {
      try {
        await task.task();
      } catch (error) {
        console.error(`High priority init task '${task.name}' failed:`, error);
      }
    }

    // Execute medium and low priority tasks in background
    const backgroundTasks = sortedTasks.filter(t => t.priority !== 'high');
    Promise.all(backgroundTasks.map(async task => {
      try {
        await task.task();
      } catch (error) {
        console.error(`Background init task '${task.name}' failed:`, error);
      }
    }));
  }

  /**
   * Get optimized startup configuration
   */
  static getStartupConfig(): {
    enableSplashScreen: boolean;
    splashDuration: number;
    enablePreloading: boolean;
    enableLazyLoading: boolean;
  } {
    const isLowPerf = ResponsivenessUtils.isLowPerformanceMode();
    
    return {
      enableSplashScreen: true,
      splashDuration: isLowPerf ? 2000 : 1500,
      enablePreloading: !isLowPerf,
      enableLazyLoading: true
    };
  }
}

/**
 * Interface for device information
 */
interface DeviceInfo {
  model: string;
  brand: string;
  osVersion: string;
  screenDensity: number;
  screenWidth: number;
  screenHeight: number;
}
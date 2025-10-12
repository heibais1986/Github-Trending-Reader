/**
 * Performance monitoring utilities for HarmonyOS
 * Used to monitor app performance metrics, especially list scrolling and loading performance
 */
export class PerformanceMonitor {
  private static readonly TAG = 'PerformanceMonitor';

  /**
   * Measure code block execution time
   */
  static measureExecutionTime<T>(
    operation: string,
    block: () => T
  ): T {
    const startTime = Date.now();
    try {
      const result = block();
      const executionTime = Date.now() - startTime;
      console.log(`${PerformanceMonitor.TAG}: ${operation} took ${executionTime}ms`);
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`${PerformanceMonitor.TAG}: ${operation} failed after ${executionTime}ms:`, error);
      throw error;
    }
  }

  /**
   * Log memory usage information
   */
  static logMemoryUsage(context: string): void {
    try {
      // In HarmonyOS, memory information might be available through system APIs
      // This is a placeholder implementation
      console.log(`${PerformanceMonitor.TAG}: Memory usage check requested for: ${context}`);
    } catch (error) {
      console.error(`${PerformanceMonitor.TAG}: Failed to log memory usage:`, error);
    }
  }

  /**
   * Performance benchmark testing
   */
  static runPerformanceBenchmark(
    testName: string,
    iterations: number = 100,
    operation: () => void
  ): void {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const time = PerformanceMonitor.measureExecutionTime(
        `${testName} iteration ${i}`,
        operation
      );
      times.push(time as number);
    }

    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    console.log(`${PerformanceMonitor.TAG}: Performance Benchmark - ${testName}:`);
    console.log(`${PerformanceMonitor.TAG}: Iterations: ${iterations}`);
    console.log(`${PerformanceMonitor.TAG}: Average: ${avgTime}ms`);
    console.log(`${PerformanceMonitor.TAG}: Min: ${minTime}ms`);
    console.log(`${PerformanceMonitor.TAG}: Max: ${maxTime}ms`);
  }
}

/**
 * List scroll performance tracker for HarmonyOS
 */
export class ListScrollPerformanceTracker {
  private lastScrollTime: number = 0;
  private scrollTimes: number[] = [];

  /**
   * Mark the start of a scroll operation
   */
  onScrollStart(): void {
    this.lastScrollTime = Date.now();
  }

  /**
   * Mark the end of a scroll operation
   */
  onScrollEnd(): void {
    if (this.lastScrollTime > 0) {
      const scrollDuration = Date.now() - this.lastScrollTime;
      this.scrollTimes.push(scrollDuration);

      console.log(`ScrollPerformance: Scroll took ${scrollDuration}ms`);

      // Keep only recent 100 scroll records
      if (this.scrollTimes.length > 100) {
        this.scrollTimes.shift();
      }
    }
  }

  /**
   * Get average scroll time
   */
  getAverageScrollTime(): number {
    if (this.scrollTimes.length === 0) {
      return 0;
    }

    return this.scrollTimes.reduce((sum, time) => sum + time, 0) / this.scrollTimes.length;
  }

  /**
   * Log scroll performance statistics
   */
  logScrollPerformanceStats(): void {
    if (this.scrollTimes.length > 0) {
      const avg = this.getAverageScrollTime();
      const min = Math.min(...this.scrollTimes);
      const max = Math.max(...this.scrollTimes);

      console.log(`ScrollPerformance: Scroll Performance Stats:`);
      console.log(`ScrollPerformance: Total scrolls: ${this.scrollTimes.length}`);
      console.log(`ScrollPerformance: Average: ${avg}ms`);
      console.log(`ScrollPerformance: Min: ${min}ms`);
      console.log(`ScrollPerformance: Max: ${max}ms`);
    }
  }
}

/**
 * Image loading performance tracker for HarmonyOS
 */
export class ImageLoadingPerformanceTracker {
  private loadingTimes: Map<string, number> = new Map();
  private completedLoads: Array<{url: string, time: number}> = [];

  /**
   * Mark the start of an image load operation
   */
  onImageLoadStart(imageUrl: string): void {
    this.loadingTimes.set(imageUrl, Date.now());
  }

  /**
   * Mark the completion of an image load operation
   */
  onImageLoadComplete(imageUrl: string, success: boolean): void {
    const startTime = this.loadingTimes.get(imageUrl);
    if (startTime !== undefined) {
      this.loadingTimes.delete(imageUrl);
      const loadTime = Date.now() - startTime;
      this.completedLoads.push({ url: imageUrl, time: loadTime });

      const status = success ? 'SUCCESS' : 'FAILED';
      console.log(`ImagePerformance: Image load ${status}: ${imageUrl} in ${loadTime}ms`);

      // Keep only recent 50 load records
      if (this.completedLoads.length > 50) {
        this.completedLoads.shift();
      }
    }
  }

  /**
   * Get average load time
   */
  getAverageLoadTime(): number {
    if (this.completedLoads.length === 0) {
      return 0;
    }

    const totalTime = this.completedLoads.reduce((sum, load) => sum + load.time, 0);
    return totalTime / this.completedLoads.length;
  }

  /**
   * Log image loading performance statistics
   */
  logImageLoadingStats(): void {
    if (this.completedLoads.length > 0) {
      const times = this.completedLoads.map(load => load.time);
      const avg = this.getAverageLoadTime();
      const min = Math.min(...times);
      const max = Math.max(...times);

      console.log(`ImagePerformance: Image Loading Performance Stats:`);
      console.log(`ImagePerformance: Total loads: ${this.completedLoads.length}`);
      console.log(`ImagePerformance: Average: ${avg}ms`);
      console.log(`ImagePerformance: Min: ${min}ms`);
      console.log(`ImagePerformance: Max: ${max}ms`);
    }
  }
}
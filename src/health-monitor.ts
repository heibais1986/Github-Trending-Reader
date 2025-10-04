/**
 * Health Check and Monitoring Module
 * Provides health status, metrics, and monitoring capabilities
 */

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn';
      message?: string;
      duration?: number;
      timestamp: string;
    };
  };
  metrics?: {
    [key: string]: number | string;
  };
}

export interface PerformanceMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime: string;
  memoryUsage?: number;
}

export class HealthMonitor {
  private startTime: number;
  private requestCount: number = 0;
  private errorCount: number = 0;
  private responseTimes: number[] = [];
  private lastRequestTime: string = '';

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Record a request for metrics
   */
  recordRequest(responseTime: number, isError: boolean = false): void {
    this.requestCount++;
    this.lastRequestTime = new Date().toISOString();
    
    if (isError) {
      this.errorCount++;
    }

    // Keep only last 100 response times for average calculation
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }

  /**
   * Get comprehensive health status
   */
  async getHealthStatus(env: any): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime;
    
    const checks: HealthStatus['checks'] = {};

    // Check KV storage connectivity
    const kvCheck = await this.checkKVStorage(env);
    checks.kv_storage = kvCheck;

    // Check GitHub API connectivity
    const githubCheck = await this.checkGitHubAPI(env);
    checks.github_api = githubCheck;

    // Check system resources
    const resourceCheck = this.checkSystemResources();
    checks.system_resources = resourceCheck;

    // Check data freshness
    const dataCheck = await this.checkDataFreshness(env);
    checks.data_freshness = dataCheck;

    // Determine overall status
    const overallStatus = this.determineOverallStatus(checks);

    return {
      status: overallStatus,
      timestamp,
      uptime,
      version: '1.0.0',
      environment: env.ENVIRONMENT || 'development',
      checks,
      metrics: this.getMetrics()
    };
  }

  /**
   * Get basic health check (lightweight)
   */
  getBasicHealth(): { status: string; timestamp: string; uptime: number } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const averageResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
      : 0;

    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      lastRequestTime: this.lastRequestTime
    };
  }

  /**
   * Check KV storage connectivity
   */
  private async checkKVStorage(env: any): Promise<HealthStatus['checks'][string]> {
    const startTime = Date.now();
    
    try {
      // Try to read a test key or the latest data
      await env.TRENDING_KV.get('trending:latest');
      
      return {
        status: 'pass',
        message: 'KV storage is accessible',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `KV storage error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check GitHub API connectivity
   */
  private async checkGitHubAPI(env: any): Promise<HealthStatus['checks'][string]> {
    const startTime = Date.now();
    
    try {
      // Make a simple API call to check connectivity
      const response = await fetch('https://api.github.com/rate_limit', {
        headers: {
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'User-Agent': 'GitHub-Trending-API/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const data = await response.json() as any;
      const remaining = data.rate?.remaining || 0;
      
      return {
        status: remaining > 100 ? 'pass' : 'warn',
        message: `GitHub API accessible, ${remaining} requests remaining`,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check system resources
   */
  private checkSystemResources(): HealthStatus['checks'][string] {
    const timestamp = new Date().toISOString();
    
    try {
      // Check error rate
      const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;
      
      let status: 'pass' | 'warn' | 'fail' = 'pass';
      let message = 'System resources normal';
      
      if (errorRate > 10) {
        status = 'fail';
        message = `High error rate: ${errorRate.toFixed(2)}%`;
      } else if (errorRate > 5) {
        status = 'warn';
        message = `Elevated error rate: ${errorRate.toFixed(2)}%`;
      }

      return {
        status,
        message,
        timestamp
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Resource check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp
      };
    }
  }

  /**
   * Check data freshness
   */
  private async checkDataFreshness(env: any): Promise<HealthStatus['checks'][string]> {
    const startTime = Date.now();
    
    try {
      const latestData = await env.TRENDING_KV.get('trending:latest');
      
      if (!latestData) {
        return {
          status: 'warn',
          message: 'No data available',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        };
      }

      const data = JSON.parse(latestData);
      const dataDate = new Date(data.date);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - dataDate.getTime()) / (1000 * 60 * 60);

      let status: 'pass' | 'warn' | 'fail' = 'pass';
      let message = `Data is fresh (${hoursSinceUpdate.toFixed(1)} hours old)`;

      if (hoursSinceUpdate > 48) {
        status = 'fail';
        message = `Data is stale (${hoursSinceUpdate.toFixed(1)} hours old)`;
      } else if (hoursSinceUpdate > 25) {
        status = 'warn';
        message = `Data is aging (${hoursSinceUpdate.toFixed(1)} hours old)`;
      }

      return {
        status,
        message,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Data freshness check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Determine overall health status based on individual checks
   */
  private determineOverallStatus(checks: HealthStatus['checks']): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(checks).map(check => check.status);
    
    if (statuses.includes('fail')) {
      return 'unhealthy';
    }
    
    if (statuses.includes('warn')) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Log performance metrics
   */
  logMetrics(): void {
    const metrics = this.getMetrics();
    console.log('Performance Metrics:', {
      requests: metrics.requestCount,
      errors: metrics.errorCount,
      errorRate: metrics.requestCount > 0 ? ((metrics.errorCount / metrics.requestCount) * 100).toFixed(2) + '%' : '0%',
      avgResponseTime: metrics.averageResponseTime + 'ms',
      lastRequest: metrics.lastRequestTime
    });
  }
}

// Global health monitor instance
export const healthMonitor = new HealthMonitor();
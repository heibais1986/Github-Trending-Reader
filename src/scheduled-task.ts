/**
 * Scheduled Task Handler
 * Handles Cron-triggered data scraping tasks with logging and monitoring
 */

import { GitHubApiClient, GitHubRepository, getYesterdayDate } from './github-client';
import { StorageManager, Repository } from './storage-manager';
import { transformRepository } from './data-processor';
import { 
  RetryMechanism, 
  TaskStateManager, 
  CircuitBreaker,
  withRetry,
  RetryOptions 
} from './retry-mechanism';

export interface TaskExecutionResult {
  success: boolean;
  date: string;
  repositoriesProcessed: number;
  executionTime: number;
  error?: string;
  details?: {
    githubApiCalls: number;
    storageOperations: number;
    dataSize: number;
  };
}

export interface TaskExecutionLog {
  taskId: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  result?: TaskExecutionResult;
  retryCount: number;
  nextRetryAt?: string;
}

export class ScheduledTaskHandler {
  private githubClient: GitHubApiClient;
  private storageManager: StorageManager;
  private retryMechanism: RetryMechanism;
  private taskStateManager: TaskStateManager;
  private circuitBreaker: CircuitBreaker;
  private readonly LOG_PREFIX = 'task_log:';
  private readonly EXECUTION_LOG_KEY = 'execution:logs';
  private readonly MAX_LOG_ENTRIES = 50;

  constructor(
    githubToken: string,
    kvNamespace: KVNamespace
  ) {
    this.githubClient = new GitHubApiClient(githubToken);
    this.storageManager = new StorageManager(kvNamespace);
    
    // Initialize retry mechanism with GitHub API specific settings
    this.retryMechanism = new RetryMechanism({
      maxRetries: 3,
      baseDelay: 2000, // 2 seconds
      maxDelay: 60000, // 1 minute
      exponentialBase: 2,
      jitter: true,
      retryCondition: this.shouldRetryGitHubError,
    });

    // Initialize task state manager
    this.taskStateManager = new TaskStateManager(kvNamespace);

    // Initialize circuit breaker for GitHub API
    this.circuitBreaker = new CircuitBreaker(
      5, // failure threshold
      300000, // 5 minute recovery timeout
      2 // success threshold
    );
  }

  /**
   * Execute the daily trending data scraping task with retry mechanism
   */
  async executeDailyScrapingTask(
    scheduledTime: number,
    ctx: ExecutionContext
  ): Promise<TaskExecutionResult> {
    const taskId = `daily_scrape_${scheduledTime}`;
    const targetDate = getYesterdayDate();
    
    // Initialize task state
    await this.taskStateManager.updateTaskState(taskId, {
      status: 'running',
      maxRetries: 3,
      metadata: { scheduledTime, targetDate },
    });

    // Execute with retry mechanism
    const retryResult = await this.retryMechanism.executeWithRetry(
      () => this.executeScrapingOperation(taskId, targetDate),
      `Daily scraping task for ${targetDate}`
    );

    if (retryResult.success && retryResult.result) {
      // Mark task as completed
      await this.taskStateManager.markTaskCompleted(taskId, {
        repositoriesProcessed: retryResult.result.repositoriesProcessed,
        executionTime: retryResult.totalTime,
        attempts: retryResult.attempts,
      });

      // Log successful execution
      await this.logTaskExecution({
        taskId,
        startTime: new Date(Date.now() - retryResult.totalTime).toISOString(),
        endTime: new Date().toISOString(),
        status: 'completed',
        retryCount: retryResult.attempts - 1,
        result: retryResult.result,
      });

      return retryResult.result;
    } else {
      // Mark task as failed
      const errorMessage = retryResult.error?.message || 'Unknown error';
      await this.taskStateManager.markTaskFailed(taskId, errorMessage);

      // Log failed execution
      await this.logTaskExecution({
        taskId,
        startTime: new Date(Date.now() - retryResult.totalTime).toISOString(),
        endTime: new Date().toISOString(),
        status: 'failed',
        retryCount: retryResult.attempts - 1,
        result: {
          success: false,
          date: targetDate,
          repositoriesProcessed: 0,
          executionTime: retryResult.totalTime,
          error: errorMessage,
        },
      });

      throw retryResult.error || new Error('Task execution failed');
    }
  }

  /**
   * Core scraping operation (without retry logic)
   */
  private async executeScrapingOperation(
    taskId: string,
    targetDate: string
  ): Promise<TaskExecutionResult> {
    const executionStartTime = Date.now();
    
    try {
      console.log(`[${taskId}] Starting scraping operation for date: ${targetDate}`);

      // Step 1: Fetch data from GitHub API with circuit breaker protection
      console.log(`[${taskId}] Fetching trending repositories from GitHub API`);
      const githubResponse = await this.circuitBreaker.execute(async () => {
        return await this.githubClient.searchTrendingRepositories(targetDate, 50);
      });
      
      if (!githubResponse.items || githubResponse.items.length === 0) {
        throw new Error('No trending repositories found for the specified date');
      }

      console.log(`[${taskId}] Retrieved ${githubResponse.items.length} repositories from GitHub`);

      // Step 2: Process and transform data
      console.log(`[${taskId}] Processing repository data`);
      const processedRepositories = await this.processRepositoryData(githubResponse.items);

      // Step 3: Store data in KV storage with retry
      console.log(`[${taskId}] Storing data in KV storage`);
      await this.retryMechanism.executeWithRetry(
        () => this.storageManager.storeTrendingData(targetDate, processedRepositories),
        'Store trending data',
        { maxRetries: 2, baseDelay: 1000 }
      );

      // Step 4: Perform data lifecycle management
      console.log(`[${taskId}] Performing data lifecycle management`);
      const lifecycleResult = await this.storageManager.performLifecycleManagement();
      
      if (lifecycleResult.errors.length > 0) {
        console.warn(`[${taskId}] Lifecycle management warnings:`, lifecycleResult.errors);
      }

      const executionTime = Date.now() - executionStartTime;
      const dataSize = JSON.stringify(processedRepositories).length;

      const result: TaskExecutionResult = {
        success: true,
        date: targetDate,
        repositoriesProcessed: processedRepositories.length,
        executionTime,
        details: {
          githubApiCalls: 1,
          storageOperations: 2,
          dataSize,
        },
      };

      console.log(`[${taskId}] Scraping operation completed successfully in ${executionTime}ms`);
      console.log(`[${taskId}] Processed ${processedRepositories.length} repositories`);
      console.log(`[${taskId}] Cleaned up ${lifecycleResult.cleanedEntries} old entries`);

      return result;

    } catch (error) {
      const executionTime = Date.now() - executionStartTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`[${taskId}] Scraping operation failed after ${executionTime}ms:`, errorMessage);
      
      throw error;
    }
  }

  /**
   * Get recent task execution logs
   */
  async getExecutionLogs(limit: number = 10): Promise<TaskExecutionLog[]> {
    try {
      const logsData = await this.storageManager['kv'].get(this.EXECUTION_LOG_KEY, 'text');
      if (!logsData) {
        return [];
      }

      const logs: TaskExecutionLog[] = JSON.parse(logsData);
      return logs
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        .slice(0, limit);

    } catch (error) {
      console.error('Failed to retrieve execution logs:', error);
      return [];
    }
  }

  /**
   * Get task execution statistics
   */
  async getTaskStats(): Promise<{
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageExecutionTime: number;
    lastExecution?: TaskExecutionLog;
    uptime: number;
  }> {
    try {
      const logs = await this.getExecutionLogs(100); // Get more logs for stats
      
      if (logs.length === 0) {
        return {
          totalExecutions: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          averageExecutionTime: 0,
          uptime: 0,
        };
      }

      const successful = logs.filter(log => log.status === 'completed');
      const failed = logs.filter(log => log.status === 'failed');
      
      const totalExecutionTime = logs
        .filter(log => log.result?.executionTime)
        .reduce((sum, log) => sum + (log.result!.executionTime || 0), 0);
      
      const averageExecutionTime = logs.length > 0 ? totalExecutionTime / logs.length : 0;
      
      // Calculate uptime as percentage of successful executions
      const uptime = logs.length > 0 ? (successful.length / logs.length) * 100 : 0;

      return {
        totalExecutions: logs.length,
        successfulExecutions: successful.length,
        failedExecutions: failed.length,
        averageExecutionTime: Math.round(averageExecutionTime),
        lastExecution: logs[0],
        uptime: Math.round(uptime * 100) / 100, // Round to 2 decimal places
      };

    } catch (error) {
      console.error('Failed to calculate task stats:', error);
      return {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        averageExecutionTime: 0,
        uptime: 0,
      };
    }
  }

  /**
   * Validate task execution environment
   */
  async validateExecutionEnvironment(): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check GitHub API connectivity
      try {
        await this.githubClient.searchTrendingRepositories(getYesterdayDate(), 1);
      } catch (error) {
        issues.push('GitHub API connectivity issue');
        recommendations.push('Check GitHub token validity and API rate limits');
      }

      // Check KV storage accessibility
      try {
        await this.storageManager.getStorageStats();
      } catch (error) {
        issues.push('KV storage accessibility issue');
        recommendations.push('Verify KV namespace binding and permissions');
      }

      // Check data processor functionality
      try {
        const testRepo: GitHubRepository = {
          id: 1,
          name: 'test',
          full_name: 'test/test',
          description: 'test',
          html_url: 'https://github.com/test/test',
          stargazers_count: 100,
          language: 'JavaScript',
          owner: {
            login: 'test',
            avatar_url: 'https://github.com/test.png',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        transformRepository(testRepo);
      } catch (error) {
        issues.push('Data processor functionality issue');
        recommendations.push('Check data transformation logic');
      }

      return {
        isValid: issues.length === 0,
        issues,
        recommendations,
      };

    } catch (error) {
      return {
        isValid: false,
        issues: ['Environment validation failed'],
        recommendations: ['Check system configuration and dependencies'],
      };
    }
  }

  /**
   * Retry failed tasks that are ready for retry
   */
  async retryFailedTasks(): Promise<{
    retriedTasks: number;
    successfulRetries: number;
    failedRetries: number;
  }> {
    await this.taskStateManager.loadTaskStates();
    const tasksToRetry = this.taskStateManager.getTasksReadyForRetry();
    
    let successfulRetries = 0;
    let failedRetries = 0;

    for (const taskState of tasksToRetry) {
      try {
        console.log(`[RetryManager] Retrying task: ${taskState.taskId}`);
        
        // Extract metadata from task state
        const { scheduledTime, targetDate } = taskState.metadata || {};
        
        if (!scheduledTime || !targetDate) {
          console.warn(`[RetryManager] Missing metadata for task ${taskState.taskId}, skipping`);
          continue;
        }

        // Mark as running
        await this.taskStateManager.markTaskRunning(taskState.taskId);

        // Execute the scraping operation
        const result = await this.executeScrapingOperation(taskState.taskId, targetDate);
        
        // Mark as completed
        await this.taskStateManager.markTaskCompleted(taskState.taskId, {
          repositoriesProcessed: result.repositoriesProcessed,
          executionTime: result.executionTime,
          retrySuccess: true,
        });

        successfulRetries++;
        console.log(`[RetryManager] Task ${taskState.taskId} retry succeeded`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await this.taskStateManager.markTaskFailed(taskState.taskId, errorMessage, 300000); // 5 min delay
        failedRetries++;
        console.error(`[RetryManager] Task ${taskState.taskId} retry failed:`, errorMessage);
      }
    }

    return {
      retriedTasks: tasksToRetry.length,
      successfulRetries,
      failedRetries,
    };
  }

  /**
   * Get task execution recovery status
   */
  async getRecoveryStatus(): Promise<{
    pendingRetries: number;
    failedTasks: number;
    circuitBreakerState: any;
    taskStatistics: any;
  }> {
    await this.taskStateManager.loadTaskStates();
    
    const tasksReadyForRetry = this.taskStateManager.getTasksReadyForRetry();
    const allStates = this.taskStateManager.getAllTaskStates();
    const failedTasks = allStates.filter(state => state.status === 'failed');
    
    return {
      pendingRetries: tasksReadyForRetry.length,
      failedTasks: failedTasks.length,
      circuitBreakerState: this.circuitBreaker.getState(),
      taskStatistics: this.taskStateManager.getTaskStatistics(),
    };
  }

  /**
   * Clean up old task states and execution logs
   */
  async performMaintenanceCleanup(): Promise<{
    cleanedTaskStates: number;
    cleanedExecutionLogs: number;
  }> {
    // Clean up old task states (older than 7 days)
    const cleanedTaskStates = await this.taskStateManager.cleanupOldTasks(7 * 24 * 60 * 60 * 1000);
    
    // Clean up old execution logs
    const cleanedExecutionLogs = await this.cleanupOldExecutionLogs();
    
    console.log(`[Maintenance] Cleaned up ${cleanedTaskStates} task states and ${cleanedExecutionLogs} execution logs`);
    
    return {
      cleanedTaskStates,
      cleanedExecutionLogs,
    };
  }

  /**
   * Reset circuit breaker (for manual recovery)
   */
  resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
    console.log('[Recovery] Circuit breaker has been reset');
  }

  /**
   * Custom retry condition for GitHub API errors
   */
  private shouldRetryGitHubError = (error: any): boolean => {
    // Don't retry on authentication errors
    if (error.code === 'AUTHENTICATION_ERROR') {
      return false;
    }

    // Don't retry on validation errors
    if (error.code === 'VALIDATION_ERROR') {
      return false;
    }

    // Retry on rate limit errors (GitHub will provide retry-after header)
    if (error.code === 'RATE_LIMIT_ERROR') {
      return true;
    }

    // Retry on service unavailable
    if (error.code === 'SERVICE_UNAVAILABLE') {
      return true;
    }

    // Retry on network errors
    if (error.code === 'NETWORK_ERROR') {
      return true;
    }

    // Retry on general API errors (could be temporary)
    if (error.code === 'API_ERROR') {
      return true;
    }

    // Retry on unknown errors (could be temporary)
    return true;
  };

  /**
   * Private helper methods
   */
  private async processRepositoryData(githubRepos: GitHubRepository[]): Promise<Repository[]> {
    const processedRepos: Repository[] = [];

    for (const repo of githubRepos) {
      try {
        const transformedRepo = transformRepository(repo);
        processedRepos.push(transformedRepo);
      } catch (error) {
        console.warn(`Failed to process repository ${repo.full_name}:`, error);
        // Continue with other repositories
      }
    }

    return processedRepos;
  }

  private async cleanupOldExecutionLogs(): Promise<number> {
    try {
      const logsData = await this.storageManager['kv'].get(this.EXECUTION_LOG_KEY, 'text');
      if (!logsData) {
        return 0;
      }

      const logs: TaskExecutionLog[] = JSON.parse(logsData);
      const cutoffTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      
      const filteredLogs = logs.filter(log => 
        new Date(log.startTime) > cutoffTime
      );

      const cleanedCount = logs.length - filteredLogs.length;

      if (cleanedCount > 0) {
        await this.storageManager['kv'].put(
          this.EXECUTION_LOG_KEY,
          JSON.stringify(filteredLogs),
          {
            metadata: {
              type: 'execution_logs',
              lastCleaned: new Date().toISOString(),
              totalEntries: filteredLogs.length,
            }
          }
        );
      }

      return cleanedCount;
    } catch (error) {
      console.error('Failed to cleanup execution logs:', error);
      return 0;
    }
  }

  private async logTaskExecution(log: TaskExecutionLog): Promise<void> {
    try {
      // Get existing logs
      const existingLogsData = await this.storageManager['kv'].get(this.EXECUTION_LOG_KEY, 'text');
      let logs: TaskExecutionLog[] = [];
      
      if (existingLogsData) {
        logs = JSON.parse(existingLogsData);
      }

      // Find existing log entry or add new one
      const existingIndex = logs.findIndex(l => l.taskId === log.taskId);
      if (existingIndex >= 0) {
        logs[existingIndex] = log;
      } else {
        logs.unshift(log); // Add to beginning for chronological order
      }

      // Keep only the most recent entries
      if (logs.length > this.MAX_LOG_ENTRIES) {
        logs = logs.slice(0, this.MAX_LOG_ENTRIES);
      }

      // Store updated logs
      await this.storageManager['kv'].put(
        this.EXECUTION_LOG_KEY,
        JSON.stringify(logs),
        {
          metadata: {
            type: 'execution_logs',
            lastUpdated: new Date().toISOString(),
            totalEntries: logs.length,
          }
        }
      );

    } catch (error) {
      console.error('Failed to log task execution:', error);
      // Don't throw - logging failure shouldn't break the main task
    }
  }
}

/**
 * Utility function to create and execute scheduled task
 */
export async function executeScheduledTask(
  scheduledTime: number,
  env: { TRENDING_KV: KVNamespace; GITHUB_TOKEN: string },
  ctx: ExecutionContext
): Promise<TaskExecutionResult> {
  const taskHandler = new ScheduledTaskHandler(env.GITHUB_TOKEN, env.TRENDING_KV);
  return await taskHandler.executeDailyScrapingTask(scheduledTime, ctx);
}
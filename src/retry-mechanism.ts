/**
 * Error Retry and Recovery Mechanism
 * Handles API call failures with exponential backoff and recovery strategies
 */

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBase: number;
  jitter: boolean;
  retryCondition?: (error: any) => boolean;
}

export interface RetryResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
  retryHistory: RetryAttempt[];
}

export interface RetryAttempt {
  attempt: number;
  timestamp: string;
  error?: string;
  delay?: number;
  success: boolean;
}

export interface TaskExecutionState {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
  startTime: string;
  lastAttempt?: string;
  nextRetryAt?: string;
  attempts: number;
  maxRetries: number;
  errors: string[];
  metadata?: Record<string, any>;
}

export class RetryMechanism {
  private options: RetryOptions;

  constructor(options: Partial<RetryOptions> = {}) {
    const defaultOptions: RetryOptions = {
      maxRetries: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 30000, // 30 seconds
      exponentialBase: 2,
      jitter: true,
      retryCondition: this.defaultRetryCondition,
    };
    
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Execute a function with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string = 'operation',
    customOptions?: Partial<RetryOptions>
  ): Promise<RetryResult<T>> {
    const opts = { ...this.options, ...customOptions } as RetryOptions;
    const startTime = Date.now();
    const retryHistory: RetryAttempt[] = [];
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= opts.maxRetries + 1; attempt++) {
      const attemptStartTime = Date.now();
      
      try {
        console.log(`[RetryMechanism] Executing ${operationName}, attempt ${attempt}/${opts.maxRetries + 1}`);
        
        const result = await operation();
        
        // Success
        retryHistory.push({
          attempt,
          timestamp: new Date().toISOString(),
          success: true,
        });

        console.log(`[RetryMechanism] ${operationName} succeeded on attempt ${attempt}`);
        
        return {
          success: true,
          result,
          attempts: attempt,
          totalTime: Date.now() - startTime,
          retryHistory,
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        const attemptRecord: RetryAttempt = {
          attempt,
          timestamp: new Date().toISOString(),
          error: lastError.message,
          success: false,
        };

        console.warn(`[RetryMechanism] ${operationName} failed on attempt ${attempt}:`, lastError.message);

        // Check if we should retry
        const shouldRetry = attempt <= opts.maxRetries && opts.retryCondition!(lastError);
        
        if (!shouldRetry) {
          console.error(`[RetryMechanism] ${operationName} failed permanently after ${attempt} attempts`);
          retryHistory.push(attemptRecord);
          break;
        }

        // Calculate delay for next attempt
        const delay = this.calculateDelay(attempt - 1, opts);
        attemptRecord.delay = delay;
        retryHistory.push(attemptRecord);
        
        console.log(`[RetryMechanism] Retrying ${operationName} in ${delay}ms...`);
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    return {
      success: false,
      error: lastError,
      attempts: retryHistory.length,
      totalTime: Date.now() - startTime,
      retryHistory,
    };
  }

  /**
   * Calculate delay for next retry attempt with exponential backoff
   */
  private calculateDelay(attemptNumber: number, options: RetryOptions): number {
    let delay = options.baseDelay * Math.pow(options.exponentialBase, attemptNumber);
    
    // Apply maximum delay limit
    delay = Math.min(delay, options.maxDelay);
    
    // Add jitter to prevent thundering herd
    if (options.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    return Math.floor(delay);
  }

  /**
   * Default retry condition - retry on network errors and 5xx status codes
   */
  private defaultRetryCondition(error: any): boolean {
    // Retry on network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true;
    }

    // Retry on GitHub API rate limit errors (will be handled by delay)
    if (error.code === 'RATE_LIMIT_ERROR') {
      return true;
    }

    // Retry on service unavailable errors
    if (error.code === 'SERVICE_UNAVAILABLE') {
      return true;
    }

    // Retry on network errors
    if (error.code === 'NETWORK_ERROR') {
      return true;
    }

    // Don't retry on authentication errors
    if (error.code === 'AUTHENTICATION_ERROR') {
      return false;
    }

    // Don't retry on validation errors
    if (error.code === 'VALIDATION_ERROR') {
      return false;
    }

    // Retry on unknown errors (could be temporary)
    return true;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Task Execution State Manager
 * Tracks and manages the state of long-running tasks with retry capabilities
 */
export class TaskStateManager {
  private states: Map<string, TaskExecutionState> = new Map();
  private readonly STATE_STORAGE_KEY = 'task_states';
  private kv?: any; // KVNamespace type not available in this context

  constructor(kvNamespace?: any) {
    this.kv = kvNamespace;
  }

  /**
   * Create or update task execution state
   */
  async updateTaskState(
    taskId: string,
    updates: Partial<TaskExecutionState>
  ): Promise<TaskExecutionState> {
    const existing = this.states.get(taskId) || {
      taskId,
      status: 'pending',
      startTime: new Date().toISOString(),
      attempts: 0,
      maxRetries: 3,
      errors: [],
    };

    const updated: TaskExecutionState = {
      ...existing,
      ...updates,
      lastAttempt: new Date().toISOString(),
    };

    this.states.set(taskId, updated);

    // Persist to KV storage if available
    if (this.kv) {
      try {
        await this.persistTaskStates();
      } catch (error) {
        console.warn('Failed to persist task states:', error);
      }
    }

    return updated;
  }

  /**
   * Get task execution state
   */
  getTaskState(taskId: string): TaskExecutionState | undefined {
    return this.states.get(taskId);
  }

  /**
   * Get all task states
   */
  getAllTaskStates(): TaskExecutionState[] {
    return Array.from(this.states.values());
  }

  /**
   * Mark task as failed and schedule retry if attempts remain
   */
  async markTaskFailed(
    taskId: string,
    error: string,
    retryDelay?: number
  ): Promise<TaskExecutionState> {
    const state = this.states.get(taskId);
    if (!state) {
      throw new Error(`Task state not found: ${taskId}`);
    }

    const attempts = state.attempts + 1;
    const shouldRetry = attempts <= state.maxRetries;
    
    const updates: Partial<TaskExecutionState> = {
      status: shouldRetry ? 'retrying' : 'failed',
      attempts,
      errors: [...state.errors, error],
    };

    if (shouldRetry && retryDelay) {
      const nextRetryTime = new Date(Date.now() + retryDelay);
      updates.nextRetryAt = nextRetryTime.toISOString();
    }

    return await this.updateTaskState(taskId, updates);
  }

  /**
   * Mark task as completed successfully
   */
  async markTaskCompleted(taskId: string, metadata?: Record<string, any>): Promise<TaskExecutionState> {
    return await this.updateTaskState(taskId, {
      status: 'completed',
      metadata,
    });
  }

  /**
   * Mark task as running
   */
  async markTaskRunning(taskId: string): Promise<TaskExecutionState> {
    return await this.updateTaskState(taskId, {
      status: 'running',
    });
  }

  /**
   * Get tasks that are ready for retry
   */
  getTasksReadyForRetry(): TaskExecutionState[] {
    const now = new Date();
    return this.getAllTaskStates().filter(state => 
      state.status === 'retrying' &&
      state.nextRetryAt &&
      new Date(state.nextRetryAt) <= now
    );
  }

  /**
   * Clean up old completed or failed tasks
   */
  async cleanupOldTasks(maxAge: number = 24 * 60 * 60 * 1000): Promise<number> {
    const cutoffTime = new Date(Date.now() - maxAge);
    let cleanedCount = 0;

    for (const [taskId, state] of this.states.entries()) {
      const lastActivity = new Date(state.lastAttempt || state.startTime);
      
      if (lastActivity < cutoffTime && (state.status === 'completed' || state.status === 'failed')) {
        this.states.delete(taskId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0 && this.kv) {
      await this.persistTaskStates();
    }

    return cleanedCount;
  }

  /**
   * Load task states from KV storage
   */
  async loadTaskStates(): Promise<void> {
    if (!this.kv) return;

    try {
      const data = await this.kv.get(this.STATE_STORAGE_KEY, 'text');
      if (data) {
        const states: TaskExecutionState[] = JSON.parse(data);
        this.states.clear();
        
        for (const state of states) {
          this.states.set(state.taskId, state);
        }
      }
    } catch (error) {
      console.warn('Failed to load task states:', error);
    }
  }

  /**
   * Persist task states to KV storage
   */
  private async persistTaskStates(): Promise<void> {
    if (!this.kv) return;

    const states = Array.from(this.states.values());
    await this.kv.put(this.STATE_STORAGE_KEY, JSON.stringify(states), {
      metadata: {
        type: 'task_states',
        lastUpdated: new Date().toISOString(),
        totalStates: states.length,
      }
    });
  }

  /**
   * Get task execution statistics
   */
  getTaskStatistics(): {
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
    retrying: number;
    averageAttempts: number;
  } {
    const states = this.getAllTaskStates();
    const stats = {
      total: states.length,
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
      retrying: 0,
      averageAttempts: 0,
    };

    let totalAttempts = 0;

    for (const state of states) {
      stats[state.status]++;
      totalAttempts += state.attempts;
    }

    stats.averageAttempts = states.length > 0 ? totalAttempts / states.length : 0;

    return stats;
  }
}

/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by temporarily stopping calls to failing services
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime?: number;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly recoveryTimeout: number = 60000, // 1 minute
    private readonly successThreshold: number = 2
  ) {}

  /**
   * Execute operation through circuit breaker
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN - operation not allowed');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful operation
   */
  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  /**
   * Handle failed operation
   */
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  /**
   * Check if circuit breaker should attempt to reset
   */
  private shouldAttemptReset(): boolean {
    return this.lastFailureTime !== undefined &&
           Date.now() - this.lastFailureTime >= this.recoveryTimeout;
  }

  /**
   * Get current circuit breaker state
   */
  getState(): { state: string; failureCount: number; lastFailureTime?: number } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    this.failureCount = 0;
    this.lastFailureTime = undefined;
    this.state = 'CLOSED';
  }
}

/**
 * Utility functions for retry mechanisms
 */

/**
 * Create a retry-enabled version of a function
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: Partial<RetryOptions>
): T {
  const retryMechanism = new RetryMechanism(options);
  
  return (async (...args: Parameters<T>) => {
    const result = await retryMechanism.executeWithRetry(
      () => fn(...args),
      fn.name || 'anonymous function'
    );
    
    if (result.success) {
      return result.result;
    } else {
      throw result.error;
    }
  }) as T;
}

/**
 * Create a circuit breaker protected version of a function
 */
export function withCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  failureThreshold?: number,
  recoveryTimeout?: number
): T {
  const circuitBreaker = new CircuitBreaker(failureThreshold, recoveryTimeout);
  
  return (async (...args: Parameters<T>) => {
    return await circuitBreaker.execute(() => fn(...args));
  }) as T;
}

/**
 * Combine retry mechanism with circuit breaker
 */
export function withRetryAndCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  retryOptions?: Partial<RetryOptions>,
  circuitBreakerOptions?: { failureThreshold?: number; recoveryTimeout?: number }
): T {
  const retryMechanism = new RetryMechanism(retryOptions);
  const circuitBreaker = new CircuitBreaker(
    circuitBreakerOptions?.failureThreshold,
    circuitBreakerOptions?.recoveryTimeout
  );
  
  return (async (...args: Parameters<T>) => {
    const result = await retryMechanism.executeWithRetry(
      () => circuitBreaker.execute(() => fn(...args)),
      fn.name || 'anonymous function'
    );
    
    if (result.success) {
      return result.result;
    } else {
      throw result.error;
    }
  }) as T;
}
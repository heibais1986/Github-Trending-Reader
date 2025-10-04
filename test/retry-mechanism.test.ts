/**
 * Tests for Retry Mechanism
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  RetryMechanism, 
  TaskStateManager, 
  CircuitBreaker,
  withRetry,
  withCircuitBreaker 
} from '../src/retry-mechanism';

describe('RetryMechanism', () => {
  let retryMechanism: RetryMechanism;

  beforeEach(() => {
    retryMechanism = new RetryMechanism({
      maxRetries: 3,
      baseDelay: 100, // Short delay for tests
      maxDelay: 1000,
      exponentialBase: 2,
      jitter: false, // Disable jitter for predictable tests
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('executeWithRetry', () => {
    it('should succeed on first attempt', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success');

      const result = await retryMechanism.executeWithRetry(mockOperation, 'test-operation');

      expect(result.success).toBe(true);
      expect(result.result).toBe('success');
      expect(result.attempts).toBe(1);
      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(result.retryHistory).toHaveLength(1);
      expect(result.retryHistory[0].success).toBe(true);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success');

      const result = await retryMechanism.executeWithRetry(mockOperation, 'test-operation');

      expect(result.success).toBe(true);
      expect(result.result).toBe('success');
      expect(result.attempts).toBe(3);
      expect(mockOperation).toHaveBeenCalledTimes(3);
      expect(result.retryHistory).toHaveLength(3);
      expect(result.retryHistory[0].success).toBe(false);
      expect(result.retryHistory[1].success).toBe(false);
      expect(result.retryHistory[2].success).toBe(true);
    });

    it('should fail after max retries', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Persistent failure'));

      const result = await retryMechanism.executeWithRetry(mockOperation, 'test-operation');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Persistent failure');
      expect(result.attempts).toBe(4); // 1 initial + 3 retries
      expect(mockOperation).toHaveBeenCalledTimes(4);
      expect(result.retryHistory).toHaveLength(4);
      expect(result.retryHistory.every(attempt => !attempt.success)).toBe(true);
    });

    it('should not retry on non-retryable errors', async () => {
      const retryMechanismWithCondition = new RetryMechanism({
        maxRetries: 3,
        baseDelay: 100,
        retryCondition: (error) => error.message !== 'Non-retryable error',
      });

      const mockOperation = vi.fn().mockRejectedValue(new Error('Non-retryable error'));

      const result = await retryMechanismWithCondition.executeWithRetry(mockOperation, 'test-operation');

      expect(result.success).toBe(false);
      expect(result.attempts).toBe(1);
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should calculate exponential backoff delays', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockRejectedValueOnce(new Error('Third failure'))
        .mockRejectedValue(new Error('Final failure'));

      const result = await retryMechanism.executeWithRetry(mockOperation, 'test-operation');

      expect(result.retryHistory).toHaveLength(4);
      expect(result.retryHistory[0].delay).toBe(100); // First retry delay
      expect(result.retryHistory[1].delay).toBe(200); // Second retry delay  
      expect(result.retryHistory[2].delay).toBe(400); // Third retry delay
      expect(result.retryHistory[3].delay).toBeUndefined(); // Final attempt has no delay
    });
  });
});

describe('TaskStateManager', () => {
  let taskStateManager: TaskStateManager;
  let mockKV: any;

  beforeEach(() => {
    mockKV = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    taskStateManager = new TaskStateManager(mockKV);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('updateTaskState', () => {
    it('should create new task state', async () => {
      mockKV.put.mockResolvedValue(undefined);

      const state = await taskStateManager.updateTaskState('test-task', {
        status: 'running',
        maxRetries: 3,
      });

      expect(state.taskId).toBe('test-task');
      expect(state.status).toBe('running');
      expect(state.maxRetries).toBe(3);
      expect(state.attempts).toBe(0);
      expect(state.errors).toEqual([]);
    });

    it('should update existing task state', async () => {
      mockKV.put.mockResolvedValue(undefined);

      // Create initial state
      await taskStateManager.updateTaskState('test-task', {
        status: 'running',
        attempts: 1,
      });

      // Update state
      const updatedState = await taskStateManager.updateTaskState('test-task', {
        status: 'failed',
        attempts: 2,
      });

      expect(updatedState.status).toBe('failed');
      expect(updatedState.attempts).toBe(2);
    });
  });

  describe('markTaskFailed', () => {
    it('should mark task as retrying when attempts remain', async () => {
      mockKV.put.mockResolvedValue(undefined);

      // Create initial state
      await taskStateManager.updateTaskState('test-task', {
        status: 'running',
        maxRetries: 3,
        attempts: 1,
      });

      const state = await taskStateManager.markTaskFailed('test-task', 'Test error', 5000);

      expect(state.status).toBe('retrying');
      expect(state.attempts).toBe(2);
      expect(state.errors).toContain('Test error');
      expect(state.nextRetryAt).toBeDefined();
    });

    it('should mark task as failed when max retries exceeded', async () => {
      mockKV.put.mockResolvedValue(undefined);

      // Create initial state at max retries
      await taskStateManager.updateTaskState('test-task', {
        status: 'running',
        maxRetries: 3,
        attempts: 3,
      });

      const state = await taskStateManager.markTaskFailed('test-task', 'Final error');

      expect(state.status).toBe('failed');
      expect(state.attempts).toBe(4);
      expect(state.errors).toContain('Final error');
      expect(state.nextRetryAt).toBeUndefined();
    });
  });

  describe('getTasksReadyForRetry', () => {
    it('should return tasks ready for retry', async () => {
      mockKV.put.mockResolvedValue(undefined);

      // Create task ready for retry (past retry time)
      const pastTime = new Date(Date.now() - 1000).toISOString();
      await taskStateManager.updateTaskState('ready-task', {
        status: 'retrying',
        nextRetryAt: pastTime,
      });

      // Create task not ready for retry (future retry time)
      const futureTime = new Date(Date.now() + 10000).toISOString();
      await taskStateManager.updateTaskState('not-ready-task', {
        status: 'retrying',
        nextRetryAt: futureTime,
      });

      const readyTasks = taskStateManager.getTasksReadyForRetry();

      expect(readyTasks).toHaveLength(1);
      expect(readyTasks[0].taskId).toBe('ready-task');
    });
  });

  describe('getTaskStatistics', () => {
    it('should calculate task statistics correctly', async () => {
      mockKV.put.mockResolvedValue(undefined);

      await taskStateManager.updateTaskState('completed-task', {
        status: 'completed',
        attempts: 2,
      });

      await taskStateManager.updateTaskState('failed-task', {
        status: 'failed',
        attempts: 4,
      });

      await taskStateManager.updateTaskState('running-task', {
        status: 'running',
        attempts: 1,
      });

      const stats = taskStateManager.getTaskStatistics();

      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.running).toBe(1);
      expect(stats.averageAttempts).toBe((2 + 4 + 1) / 3);
    });
  });
});

describe('CircuitBreaker', () => {
  let circuitBreaker: CircuitBreaker;

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker(
      3, // failure threshold
      1000, // recovery timeout (1 second for tests)
      2 // success threshold
    );
  });

  describe('execute', () => {
    it('should execute operation when circuit is closed', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success');

      const result = await circuitBreaker.execute(mockOperation);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(circuitBreaker.getState().state).toBe('CLOSED');
    });

    it('should open circuit after failure threshold', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Failure'));

      // Fail 3 times to reach threshold
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockOperation);
        } catch (error) {
          // Expected failures
        }
      }

      expect(circuitBreaker.getState().state).toBe('OPEN');
      expect(circuitBreaker.getState().failureCount).toBe(3);

      // Next call should be rejected without calling operation
      await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('Circuit breaker is OPEN');
      expect(mockOperation).toHaveBeenCalledTimes(3); // Should not be called again
    });

    it('should transition to half-open after recovery timeout', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('Failure 1'))
        .mockRejectedValueOnce(new Error('Failure 2'))
        .mockRejectedValueOnce(new Error('Failure 3'))
        .mockResolvedValue('success');

      // Fail 3 times to open circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockOperation);
        } catch (error) {
          // Expected failures
        }
      }

      expect(circuitBreaker.getState().state).toBe('OPEN');

      // Wait for recovery timeout
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Next call should succeed and close circuit
      const result = await circuitBreaker.execute(mockOperation);
      expect(result).toBe('success');
      expect(circuitBreaker.getState().state).toBe('CLOSED');
      expect(circuitBreaker.getState().failureCount).toBe(0);
    });

    it('should reset failure count on success', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('Failure'))
        .mockResolvedValue('success');

      // One failure
      try {
        await circuitBreaker.execute(mockOperation);
      } catch (error) {
        // Expected failure
      }

      expect(circuitBreaker.getState().failureCount).toBe(1);

      // Success should reset failure count
      const result = await circuitBreaker.execute(mockOperation);
      expect(result).toBe('success');
      expect(circuitBreaker.getState().failureCount).toBe(0);
      expect(circuitBreaker.getState().state).toBe('CLOSED');
    });
  });

  describe('reset', () => {
    it('should reset circuit breaker to closed state', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Failure'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(mockOperation);
        } catch (error) {
          // Expected failures
        }
      }

      expect(circuitBreaker.getState().state).toBe('OPEN');

      // Reset circuit breaker
      circuitBreaker.reset();

      const state = circuitBreaker.getState();
      expect(state.state).toBe('CLOSED');
      expect(state.failureCount).toBe(0);
      expect(state.lastFailureTime).toBeUndefined();
    });
  });
});

describe('Utility Functions', () => {
  describe('withRetry', () => {
    it('should create retry-enabled function', async () => {
      const originalFn = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValue('success');

      const retryEnabledFn = withRetry(originalFn, {
        maxRetries: 2,
        baseDelay: 10,
      });

      const result = await retryEnabledFn('test-arg');

      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledTimes(2);
      expect(originalFn).toHaveBeenCalledWith('test-arg');
    });

    it('should throw error after max retries', async () => {
      const originalFn = vi.fn().mockRejectedValue(new Error('Persistent failure'));

      const retryEnabledFn = withRetry(originalFn, {
        maxRetries: 1,
        baseDelay: 10,
      });

      await expect(retryEnabledFn()).rejects.toThrow('Persistent failure');
      expect(originalFn).toHaveBeenCalledTimes(2); // 1 initial + 1 retry
    });
  });

  describe('withCircuitBreaker', () => {
    it('should create circuit breaker protected function', async () => {
      const originalFn = vi.fn().mockResolvedValue('success');

      const protectedFn = withCircuitBreaker(originalFn, 3, 1000);

      const result = await protectedFn('test-arg');

      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledWith('test-arg');
    });

    it('should prevent calls when circuit is open', async () => {
      const originalFn = vi.fn().mockRejectedValue(new Error('Failure'));

      const protectedFn = withCircuitBreaker(originalFn, 2, 1000);

      // Fail twice to open circuit
      for (let i = 0; i < 2; i++) {
        try {
          await protectedFn();
        } catch (error) {
          // Expected failures
        }
      }

      // Next call should be rejected by circuit breaker
      await expect(protectedFn()).rejects.toThrow('Circuit breaker is OPEN');
      expect(originalFn).toHaveBeenCalledTimes(2);
    });
  });
});
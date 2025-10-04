/**
 * Error handling utilities for the application
 */

import promptAction from '@ohos.promptAction';
import {
  NetworkError,
  NetworkErrorType,
  ERROR_MESSAGES
} from '../models';

/**
 * Error handler class for centralized error processing
 */
export class ErrorHandler {
  /**
   * Show toast message to user
   * @param message - Message to display
   * @param duration - Toast duration in milliseconds (default: 2000)
   */
  static showToast(message: string, duration: number = 2000): void {
    try {
      // Use HarmonyOS toast API
      promptAction.showToast({
        message: message,
        duration: duration
      });
    } catch (error) {
      console.error('Failed to show toast:', error);
    }
  }
  /**
   * Get user-friendly error message from NetworkError
   * @param error - NetworkError object
   * @returns User-friendly error message
   */
  static getUserFriendlyMessage(error: NetworkError): string {
    switch (error.type) {
      case NetworkErrorType.TIMEOUT:
        return ERROR_MESSAGES.TIMEOUT_ERROR;
      case NetworkErrorType.CONNECTION_ERROR:
        return ERROR_MESSAGES.NETWORK_ERROR;
      case NetworkErrorType.SERVER_ERROR:
        return ERROR_MESSAGES.SERVER_ERROR;
      case NetworkErrorType.PARSE_ERROR:
        return ERROR_MESSAGES.PARSE_ERROR;
      case NetworkErrorType.UNKNOWN_ERROR:
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  /**
   * Log error for debugging purposes
   * @param error - Error to log
   * @param context - Additional context information
   */
  static logError(error: NetworkError, context?: string): void {
    const logMessage = `[${error.type}] ${error.message}`;
    const fullMessage = context ? `${context}: ${logMessage}` : logMessage;
    
    console.error(fullMessage);
    
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }
    
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
  }

  /**
   * Check if error is recoverable (can be retried)
   * @param error - NetworkError object
   * @returns true if error is recoverable, false otherwise
   */
  static isRecoverableError(error: NetworkError): boolean {
    switch (error.type) {
      case NetworkErrorType.TIMEOUT:
      case NetworkErrorType.CONNECTION_ERROR:
      case NetworkErrorType.SERVER_ERROR:
        return true;
      case NetworkErrorType.PARSE_ERROR:
      case NetworkErrorType.UNKNOWN_ERROR:
      default:
        return false;
    }
  }

  /**
   * Get retry delay based on error type
   * @param error - NetworkError object
   * @param attemptNumber - Current retry attempt number
   * @returns Delay in milliseconds
   */
  static getRetryDelay(error: NetworkError, attemptNumber: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    
    if (!this.isRecoverableError(error)) {
      return 0;
    }
    
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attemptNumber);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    
    return Math.min(exponentialDelay + jitter, maxDelay);
  }
}

/**
 * Error boundary utility for handling unexpected errors
 */
export class ErrorBoundary {
  /**
   * Safely execute an async function with error handling
   * @param fn - Async function to execute
   * @param fallbackValue - Value to return if function fails
   * @param onError - Optional error handler callback
   * @returns Promise with result or fallback value
   */
  static async safeExecute<T>(
    fn: () => Promise<T>,
    fallbackValue: T,
    onError?: (error: Error) => void
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        console.error('SafeExecute error:', error);
      }
      return fallbackValue;
    }
  }

  /**
   * Safely execute a synchronous function with error handling
   * @param fn - Function to execute
   * @param fallbackValue - Value to return if function fails
   * @param onError - Optional error handler callback
   * @returns Result or fallback value
   */
  static safeExecuteSync<T>(
    fn: () => T,
    fallbackValue: T,
    onError?: (error: Error) => void
  ): T {
    try {
      return fn();
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        console.error('SafeExecuteSync error:', error);
      }
      return fallbackValue;
    }
  }
}
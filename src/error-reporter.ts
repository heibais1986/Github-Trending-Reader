/**
 * Error Reporting and Logging System
 * Provides structured logging and error reporting capabilities
 */

export interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

export interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
  requestId?: string;
  userId?: string;
}

export class ErrorReporter {
  private logLevel: keyof LogLevel;
  private environment: string;

  constructor(environment: string = 'development', logLevel: keyof LogLevel = 'INFO') {
    this.environment = environment;
    this.logLevel = logLevel;
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log('DEBUG', message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('INFO', message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('WARN', message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('ERROR', message, context, error);
  }

  /**
   * Report API error with request context
   */
  reportAPIError(
    request: Request,
    error: Error,
    context?: Record<string, any>
  ): void {
    const url = new URL(request.url);
    const requestContext = {
      method: request.method,
      path: url.pathname,
      query: url.search,
      userAgent: request.headers.get('User-Agent'),
      referer: request.headers.get('Referer'),
      ...context
    };

    this.error(`API Error: ${error.message}`, error, requestContext);
  }

  /**
   * Report scheduled task error
   */
  reportScheduledTaskError(
    taskName: string,
    error: Error,
    context?: Record<string, any>
  ): void {
    const taskContext = {
      taskName,
      scheduledTime: new Date().toISOString(),
      ...context
    };

    this.error(`Scheduled Task Error: ${error.message}`, error, taskContext);
  }

  /**
   * Report GitHub API error
   */
  reportGitHubAPIError(
    endpoint: string,
    status: number,
    error: Error,
    context?: Record<string, any>
  ): void {
    const apiContext = {
      endpoint,
      status,
      service: 'GitHub API',
      ...context
    };

    this.error(`GitHub API Error: ${error.message}`, error, apiContext);
  }

  /**
   * Report KV storage error
   */
  reportStorageError(
    operation: string,
    key: string,
    error: Error,
    context?: Record<string, any>
  ): void {
    const storageContext = {
      operation,
      key,
      service: 'Cloudflare KV',
      ...context
    };

    this.error(`Storage Error: ${error.message}`, error, storageContext);
  }

  /**
   * Core logging method
   */
  private log(
    level: keyof LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    // Check if we should log this level
    const levels: LogLevel = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    if (levels[level] < levels[this.logLevel]) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as any : undefined
    };

    // Format log output based on environment
    if (this.environment === 'development') {
      this.logToConsole(logEntry);
    } else {
      this.logStructured(logEntry);
    }
  }

  /**
   * Log to console for development
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp;
    const level = entry.level.padEnd(5);
    
    let output = `[${timestamp}] ${level} ${entry.message}`;
    
    if (entry.context) {
      output += `\nContext: ${JSON.stringify(entry.context, null, 2)}`;
    }
    
    if (entry.error) {
      output += `\nError: ${entry.error.message}`;
      if (entry.error.stack) {
        output += `\nStack: ${entry.error.stack}`;
      }
    }

    // Use appropriate console method
    switch (entry.level) {
      case 'DEBUG':
        console.debug(output);
        break;
      case 'INFO':
        console.info(output);
        break;
      case 'WARN':
        console.warn(output);
        break;
      case 'ERROR':
        console.error(output);
        break;
    }
  }

  /**
   * Log structured JSON for production
   */
  private logStructured(entry: LogEntry): void {
    console.log(JSON.stringify(entry));
  }

  /**
   * Create performance log entry
   */
  logPerformance(
    operation: string,
    duration: number,
    context?: Record<string, any>
  ): void {
    this.info(`Performance: ${operation}`, {
      operation,
      duration,
      unit: 'ms',
      ...context
    });
  }

  /**
   * Create audit log entry
   */
  logAudit(
    action: string,
    resource: string,
    context?: Record<string, any>
  ): void {
    this.info(`Audit: ${action}`, {
      action,
      resource,
      type: 'audit',
      ...context
    });
  }

  /**
   * Create security log entry
   */
  logSecurity(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    context?: Record<string, any>
  ): void {
    const level = severity === 'critical' || severity === 'high' ? 'ERROR' : 'WARN';
    
    this.log(level, `Security: ${event}`, {
      event,
      severity,
      type: 'security',
      ...context
    });
  }
}

// Global error reporter instance
export const errorReporter = new ErrorReporter();
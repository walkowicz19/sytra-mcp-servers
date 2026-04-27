/**
 * Error Handler Utility
 * Provides centralized error handling and custom error types
 */

import { logger } from './logger.js';

export class OrchestratorError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'OrchestratorError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ServiceConnectionError extends OrchestratorError {
  constructor(service: string, originalError?: Error) {
    super(
      `Failed to connect to ${service} service`,
      'SERVICE_CONNECTION_ERROR',
      503,
      { service, originalError: originalError?.message }
    );
    this.name = 'ServiceConnectionError';
  }
}

export class WorkflowValidationError extends OrchestratorError {
  constructor(message: string, validationErrors: any[]) {
    super(
      message,
      'WORKFLOW_VALIDATION_ERROR',
      400,
      { validationErrors }
    );
    this.name = 'WorkflowValidationError';
  }
}

export class WorkflowExecutionError extends OrchestratorError {
  constructor(workflowId: string, stepId: string, originalError: Error) {
    super(
      `Workflow execution failed at step ${stepId}`,
      'WORKFLOW_EXECUTION_ERROR',
      500,
      { workflowId, stepId, originalError: originalError.message }
    );
    this.name = 'WorkflowExecutionError';
  }
}

export class RoutingError extends OrchestratorError {
  constructor(message: string, toolName: string) {
    super(
      message,
      'ROUTING_ERROR',
      400,
      { toolName }
    );
    this.name = 'RoutingError';
  }
}

export class TimeoutError extends OrchestratorError {
  constructor(operation: string, timeoutMs: number) {
    super(
      `Operation ${operation} timed out after ${timeoutMs}ms`,
      'TIMEOUT_ERROR',
      408,
      { operation, timeoutMs }
    );
    this.name = 'TimeoutError';
  }
}

export class RetryExhaustedError extends OrchestratorError {
  constructor(operation: string, attempts: number, lastError: Error) {
    super(
      `Operation ${operation} failed after ${attempts} attempts`,
      'RETRY_EXHAUSTED_ERROR',
      500,
      { operation, attempts, lastError: lastError.message }
    );
    this.name = 'RetryExhaustedError';
  }
}

export interface ErrorHandlerOptions {
  logError?: boolean;
  rethrow?: boolean;
  defaultValue?: any;
}

export class ErrorHandler {
  static handle(error: Error, context: string, options: ErrorHandlerOptions = {}): any {
    const { logError = true, rethrow = true, defaultValue } = options;

    if (logError) {
      logger.error(`Error in ${context}`, error, {
        errorName: error.name,
        errorCode: (error as OrchestratorError).code,
      });
    }

    if (rethrow) {
      throw error;
    }

    return defaultValue;
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    backoffMs: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: Error;
    let currentBackoff = backoffMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxAttempts) {
          logger.warn(`Attempt ${attempt} failed, retrying in ${currentBackoff}ms`, {
            error: lastError.message,
          });
          await this.sleep(currentBackoff);
          currentBackoff *= backoffMultiplier;
        }
      }
    }

    throw new RetryExhaustedError('operation', maxAttempts, lastError!);
  }

  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number,
    operationName: string = 'operation'
  ): Promise<T> {
    return Promise.race([
      operation(),
      this.createTimeout(timeoutMs, operationName),
    ]);
  }

  private static createTimeout(ms: number, operationName: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new TimeoutError(operationName, ms));
      }, ms);
    });
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static isRetryable(error: Error): boolean {
    if (error instanceof ServiceConnectionError) {
      return true;
    }
    if (error instanceof TimeoutError) {
      return true;
    }
    // Add more retryable error types as needed
    return false;
  }

  static sanitizeError(error: Error): Record<string, any> {
    const sanitized: Record<string, any> = {
      name: error.name,
      message: error.message,
    };

    if (error instanceof OrchestratorError) {
      sanitized.code = error.code;
      sanitized.statusCode = error.statusCode;
      if (error.details) {
        sanitized.details = error.details;
      }
    }

    return sanitized;
  }
}

// Made with Bob

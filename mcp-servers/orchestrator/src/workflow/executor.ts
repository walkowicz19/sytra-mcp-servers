/**
 * Workflow Executor
 * Executes individual workflow steps with retry and error handling
 */

import { WorkflowStep, StepExecutionContext, WorkflowStepResult, WorkflowContext } from '../types/workflow.js';
import { logger } from '../utils/logger.js';
import { ErrorHandler, WorkflowExecutionError } from '../utils/error-handler.js';

// Import all service clients
import { SecurityClient } from '../clients/security.js';
import { CodegenClient } from '../clients/codegen.js';
import { MemoryClient } from '../clients/memory.js';
import { IntelligenceClient } from '../clients/intelligence.js';
import { TokensClient } from '../clients/tokens.js';
import { SDLCClient } from '../clients/sdlc.js';
import { LegacyClient } from '../clients/legacy.js';
import { PerformanceClient } from '../clients/performance.js';

export class WorkflowExecutor {
  private clients: Map<string, any> = new Map();

  constructor() {
    this.initializeClients();
  }

  private initializeClients(): void {
    // Initialize all service clients with URLs from environment
    this.clients.set('security', new SecurityClient(
      process.env.STARK_SECURITY_URL || 'http://localhost:8001'
    ));
    this.clients.set('codegen', new CodegenClient(
      process.env.STARK_CODEGEN_URL || 'http://localhost:8002'
    ));
    this.clients.set('memory', new MemoryClient(
      process.env.STARK_MEMORY_URL || 'http://localhost:8003'
    ));
    this.clients.set('intelligence', new IntelligenceClient(
      process.env.STARK_INTELLIGENCE_URL || 'http://localhost:8004'
    ));
    this.clients.set('tokens', new TokensClient(
      process.env.STARK_TOKENS_URL || 'http://localhost:8005'
    ));
    this.clients.set('sdlc', new SDLCClient(
      process.env.STARK_SDLC_URL || 'http://localhost:8006'
    ));
    this.clients.set('legacy', new LegacyClient(
      process.env.STARK_LEGACY_URL || 'http://localhost:8007'
    ));
    this.clients.set('performance', new PerformanceClient(
      process.env.STARK_PERFORMANCE_URL || 'http://localhost:8009'
    ));
  }

  /**
   * Execute a single workflow step
   */
  async executeStep(context: StepExecutionContext): Promise<WorkflowStepResult> {
    const { step, workflowContext } = context;
    const startTime = new Date();

    logger.info('Executing workflow step', {
      stepId: step.id,
      service: step.service,
      tool: step.tool,
    });

    try {
      // Interpolate variables in inputs
      const interpolatedInputs = this.interpolateVariables(step.inputs, workflowContext);

      // Get the appropriate client
      const client = this.clients.get(step.service);
      if (!client) {
        throw new Error(`Unknown service: ${step.service}`);
      }

      // Execute the step with retry logic
      const output = await this.executeWithRetry(
        step,
        client,
        interpolatedInputs,
        context.retryCount
      );

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      logger.info('Step execution successful', {
        stepId: step.id,
        duration,
      });

      return {
        stepId: step.id,
        status: 'success',
        output,
        startTime,
        endTime,
        duration,
        retryCount: context.retryCount,
      };
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      logger.error('Step execution failed', error as Error, {
        stepId: step.id,
        duration,
        retryCount: context.retryCount,
      });

      return {
        stepId: step.id,
        status: 'failure',
        error: error as Error,
        startTime,
        endTime,
        duration,
        retryCount: context.retryCount,
      };
    }
  }

  private async executeWithRetry(
    step: WorkflowStep,
    client: any,
    inputs: Record<string, any>,
    currentRetry: number
  ): Promise<any> {
    const retryPolicy = step.retryPolicy || {
      maxAttempts: 1,
      backoffMs: 1000,
      backoffMultiplier: 2,
    };

    const maxAttempts = retryPolicy.maxAttempts;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Execute the actual service call
        const result = await this.callServiceMethod(client, step.tool, inputs, step.timeout);
        return result;
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          const backoff = retryPolicy.backoffMs * Math.pow(retryPolicy.backoffMultiplier, attempt - 1);
          logger.warn(`Step ${step.id} failed, retrying in ${backoff}ms`, {
            attempt,
            maxAttempts,
            error: lastError.message,
          });
          await this.sleep(backoff);
        }
      }
    }

    throw new WorkflowExecutionError(
      step.id.split('-')[0], // workflow ID
      step.id,
      lastError!
    );
  }

  private async callServiceMethod(
    client: any,
    tool: string,
    inputs: Record<string, any>,
    timeout?: number
  ): Promise<any> {
    // Map tool names to client methods
    const methodName = this.getClientMethodName(tool);

    if (!client[methodName]) {
      throw new Error(`Method ${methodName} not found on client`);
    }

    // Call the method with timeout if specified
    if (timeout) {
      return ErrorHandler.withTimeout(
        () => client[methodName](...this.extractMethodArgs(inputs)),
        timeout,
        `${client.getServiceName()}.${methodName}`
      );
    }

    return client[methodName](...this.extractMethodArgs(inputs));
  }

  private getClientMethodName(tool: string): string {
    // Convert tool names to camelCase method names
    // e.g., "scan_security" -> "scanCode", "generate_code" -> "generateCode"
    const parts = tool.split('_');
    return parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  }

  private extractMethodArgs(inputs: Record<string, any>): any[] {
    // Convert inputs object to array of arguments
    // Most methods take a single object argument
    return [inputs];
  }

  private interpolateVariables(
    inputs: Record<string, any>,
    context: WorkflowContext
  ): Record<string, any> {
    const interpolated: Record<string, any> = {};

    for (const [key, value] of Object.entries(inputs)) {
      interpolated[key] = this.interpolateValue(value, context);
    }

    return interpolated;
  }

  private interpolateValue(value: any, context: WorkflowContext): any {
    if (typeof value === 'string') {
      // Replace {{variable}} with actual values
      return value.replace(/\{\{([^}]+)\}\}/g, (match, varPath) => {
        const trimmedPath = varPath.trim();
        return this.resolveVariablePath(trimmedPath, context);
      });
    }

    if (Array.isArray(value)) {
      return value.map(item => this.interpolateValue(item, context));
    }

    if (typeof value === 'object' && value !== null) {
      const interpolated: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        interpolated[k] = this.interpolateValue(v, context);
      }
      return interpolated;
    }

    return value;
  }

  private resolveVariablePath(path: string, context: WorkflowContext): any {
    // Handle input variables
    if (context.inputs[path] !== undefined) {
      return context.inputs[path];
    }

    // Handle context variables
    if (context.variables.has(path)) {
      return context.variables.get(path);
    }

    // Handle step output references (e.g., "step1.output" or "step1.output.field")
    const parts = path.split('.');
    if (parts.length >= 2) {
      const stepId = parts[0];
      const stepResult = context.stepResults.get(stepId);

      if (stepResult) {
        let value = stepResult;
        for (let i = 1; i < parts.length; i++) {
          if (value && typeof value === 'object') {
            value = value[parts[i]];
          } else {
            return `{{${path}}}`;
          }
        }
        return value;
      }
    }

    // If variable not found, return the original placeholder
    logger.warn('Variable not found', { path });
    return `{{${path}}}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if a step should be executed based on its condition
   */
  shouldExecuteStep(step: WorkflowStep, context: WorkflowContext): boolean {
    if (!step.condition) {
      return true;
    }

    try {
      // Simple condition evaluation
      // Format: "{{variable}} operator value"
      const interpolated = this.interpolateValue(step.condition, context);
      return this.evaluateCondition(interpolated);
    } catch (error) {
      logger.error('Error evaluating step condition', error as Error, {
        stepId: step.id,
        condition: step.condition,
      });
      return false;
    }
  }

  private evaluateCondition(condition: string): boolean {
    // Simple condition evaluation
    // Supports: ==, !=, >, <, >=, <=, contains
    const operators = ['==', '!=', '>=', '<=', '>', '<', 'contains'];

    for (const op of operators) {
      if (condition.includes(op)) {
        const [left, right] = condition.split(op).map(s => s.trim());
        return this.compareValues(left, right, op);
      }
    }

    // If no operator, treat as boolean
    return condition.toLowerCase() === 'true';
  }

  private compareValues(left: string, right: string, operator: string): boolean {
    // Remove quotes if present
    const cleanLeft = left.replace(/^["']|["']$/g, '');
    const cleanRight = right.replace(/^["']|["']$/g, '');

    switch (operator) {
      case '==':
        return cleanLeft === cleanRight;
      case '!=':
        return cleanLeft !== cleanRight;
      case '>':
        return parseFloat(cleanLeft) > parseFloat(cleanRight);
      case '<':
        return parseFloat(cleanLeft) < parseFloat(cleanRight);
      case '>=':
        return parseFloat(cleanLeft) >= parseFloat(cleanRight);
      case '<=':
        return parseFloat(cleanLeft) <= parseFloat(cleanRight);
      case 'contains':
        return cleanLeft.includes(cleanRight);
      default:
        return false;
    }
  }
}

// Made with Bob

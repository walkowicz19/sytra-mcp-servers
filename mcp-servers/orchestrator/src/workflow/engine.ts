/**
 * Workflow Engine
 * Orchestrates workflow execution with dependency resolution
 */

import {
  Workflow,
  WorkflowStep,
  WorkflowResult,
  WorkflowStepResult,
  WorkflowState,
  WorkflowContext,
  StepExecutionContext,
} from '../types/workflow.js';
import { logger } from '../utils/logger.js';
import { WorkflowValidator } from './validator.js';
import { WorkflowExecutor } from './executor.js';
import { WorkflowExecutionError } from '../utils/error-handler.js';

export class WorkflowEngine {
  private validator: WorkflowValidator;
  private executor: WorkflowExecutor;
  private activeWorkflows: Map<string, WorkflowState> = new Map();

  constructor() {
    this.validator = new WorkflowValidator();
    this.executor = new WorkflowExecutor();
  }

  /**
   * Execute a workflow with dependency resolution
   */
  async execute(workflow: Workflow, inputs: Record<string, any>): Promise<WorkflowResult> {
    const startTime = new Date();

    logger.info('Starting workflow execution', {
      workflowId: workflow.id,
      stepCount: workflow.steps.length,
    });

    // Validate workflow
    const validation = this.validator.validate(workflow);
    if (!validation.valid) {
      throw new WorkflowExecutionError(
        workflow.id,
        'validation',
        new Error(`Workflow validation failed: ${validation.errors.map(e => e.message).join(', ')}`)
      );
    }

    // Initialize workflow state
    const state = this.initializeWorkflowState(workflow, inputs);
    this.activeWorkflows.set(workflow.id, state);

    const stepResults: WorkflowStepResult[] = [];

    try {
      // Build execution plan with dependency resolution
      const executionPlan = this.buildExecutionPlan(workflow);

      logger.debug('Execution plan created', {
        workflowId: workflow.id,
        planLength: executionPlan.length,
      });

      // Execute steps according to plan
      for (const batch of executionPlan) {
        const batchResults = await this.executeBatch(batch, workflow, state);
        stepResults.push(...batchResults);

        // Update state with results
        for (const result of batchResults) {
          state.stepResults.set(result.stepId, result);
          if (result.status === 'success') {
            state.completedSteps.push(result.stepId);
            if (result.output) {
              state.variables.set(result.stepId, result.output);
            }
          } else {
            state.failedSteps.push(result.stepId);
          }
        }

        // Check for failures and error handling strategy
        const failedInBatch = batchResults.filter(r => r.status === 'failure');
        if (failedInBatch.length > 0) {
          const shouldStop = this.handleBatchFailures(workflow, failedInBatch, state);
          if (shouldStop) {
            break;
          }
        }
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // Determine overall status
      const failedSteps = stepResults.filter(r => r.status === 'failure');
      const status = failedSteps.length === 0 ? 'success' :
                     failedSteps.length < stepResults.length ? 'partial' : 'failure';

      state.status = status === 'success' ? 'completed' : 'failed';
      state.lastUpdateTime = endTime;

      logger.info('Workflow execution completed', {
        workflowId: workflow.id,
        status,
        duration,
        successfulSteps: stepResults.filter(r => r.status === 'success').length,
        failedSteps: failedSteps.length,
      });

      return {
        workflowId: workflow.id,
        status,
        steps: stepResults,
        startTime,
        endTime,
        duration,
        error: failedSteps.length > 0 ? failedSteps[0].error : undefined,
      };
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      state.status = 'failed';
      state.lastUpdateTime = endTime;

      logger.error('Workflow execution failed', error as Error, {
        workflowId: workflow.id,
        duration,
      });

      return {
        workflowId: workflow.id,
        status: 'failure',
        steps: stepResults,
        startTime,
        endTime,
        duration,
        error: error as Error,
      };
    } finally {
      this.activeWorkflows.delete(workflow.id);
    }
  }

  private initializeWorkflowState(workflow: Workflow, inputs: Record<string, any>): WorkflowState {
    return {
      workflowId: workflow.id,
      status: 'running',
      completedSteps: [],
      failedSteps: [],
      stepResults: new Map(),
      variables: new Map(Object.entries(inputs)),
      startTime: new Date(),
      lastUpdateTime: new Date(),
    };
  }

  /**
   * Build execution plan with dependency resolution
   * Returns array of batches, where each batch can be executed in parallel
   */
  private buildExecutionPlan(workflow: Workflow): WorkflowStep[][] {
    const plan: WorkflowStep[][] = [];
    const completed = new Set<string>();
    const remaining = new Set(workflow.steps.map(s => s.id));

    while (remaining.size > 0) {
      // Find steps that can be executed (all dependencies completed)
      const batch: WorkflowStep[] = [];

      for (const stepId of remaining) {
        const step = workflow.steps.find(s => s.id === stepId)!;
        const dependencies = step.dependsOn || [];

        // Check if all dependencies are completed
        const canExecute = dependencies.every(depId => completed.has(depId));

        if (canExecute) {
          batch.push(step);
        }
      }

      if (batch.length === 0) {
        // No steps can be executed - this shouldn't happen if validation passed
        throw new Error('Circular dependency or missing dependency detected');
      }

      plan.push(batch);

      // Mark batch steps as completed
      for (const step of batch) {
        completed.add(step.id);
        remaining.delete(step.id);
      }
    }

    return plan;
  }

  /**
   * Execute a batch of steps (potentially in parallel)
   */
  private async executeBatch(
    batch: WorkflowStep[],
    workflow: Workflow,
    state: WorkflowState
  ): Promise<WorkflowStepResult[]> {
    logger.debug('Executing batch', {
      workflowId: workflow.id,
      batchSize: batch.length,
      stepIds: batch.map(s => s.id),
    });

    const context: WorkflowContext = {
      workflowId: workflow.id,
      inputs: Object.fromEntries(state.variables),
      variables: state.variables,
      stepResults: state.stepResults,
    };

    // Execute steps in parallel if batch size > 1
    if (batch.length > 1) {
      const promises = batch.map(step => this.executeStepSafely(step, context));
      return Promise.all(promises);
    } else {
      // Single step - execute directly
      return [await this.executeStepSafely(batch[0], context)];
    }
  }

  private async executeStepSafely(
    step: WorkflowStep,
    context: WorkflowContext
  ): Promise<WorkflowStepResult> {
    try {
      // Check if step should be executed based on condition
      if (!this.executor.shouldExecuteStep(step, context)) {
        logger.info('Skipping step due to condition', { stepId: step.id });
        return {
          stepId: step.id,
          status: 'skipped',
          startTime: new Date(),
          endTime: new Date(),
          duration: 0,
        };
      }

      const executionContext: StepExecutionContext = {
        step,
        workflowContext: context,
        retryCount: 0,
      };

      return await this.executor.executeStep(executionContext);
    } catch (error) {
      logger.error('Step execution error', error as Error, { stepId: step.id });
      return {
        stepId: step.id,
        status: 'failure',
        error: error as Error,
        startTime: new Date(),
        endTime: new Date(),
        duration: 0,
      };
    }
  }

  private handleBatchFailures(
    workflow: Workflow,
    failedResults: WorkflowStepResult[],
    state: WorkflowState
  ): boolean {
    const errorHandling = workflow.errorHandling || { onStepFailure: 'stop' };

    logger.warn('Batch failures detected', {
      workflowId: workflow.id,
      failedCount: failedResults.length,
      strategy: errorHandling.onStepFailure,
    });

    switch (errorHandling.onStepFailure) {
      case 'stop':
        return true; // Stop execution

      case 'continue':
        return false; // Continue with next batch

      case 'rollback':
        // TODO: Implement rollback logic
        logger.warn('Rollback not yet implemented');
        return true;

      default:
        return true;
    }
  }

  /**
   * Get execution state of a workflow
   */
  getExecutionState(workflowId: string): WorkflowState | undefined {
    return this.activeWorkflows.get(workflowId);
  }

  /**
   * Validate a workflow without executing it
   */
  validate(workflow: Workflow) {
    return this.validator.validate(workflow);
  }

  /**
   * Handle step failure with retry logic
   */
  async handleStepFailure(step: WorkflowStep, error: Error): Promise<void> {
    logger.error('Handling step failure', error, {
      stepId: step.id,
      service: step.service,
      tool: step.tool,
    });

    // Check if step allows continuation on error
    if (step.continueOnError) {
      logger.info('Continuing despite step failure', { stepId: step.id });
      return;
    }

    // Otherwise, propagate the error
    throw new WorkflowExecutionError(step.id.split('-')[0], step.id, error);
  }

  /**
   * Get list of active workflows
   */
  getActiveWorkflows(): string[] {
    return Array.from(this.activeWorkflows.keys());
  }

  /**
   * Cancel a running workflow
   */
  async cancelWorkflow(workflowId: string): Promise<boolean> {
    const state = this.activeWorkflows.get(workflowId);
    if (!state) {
      return false;
    }

    state.status = 'failed';
    state.lastUpdateTime = new Date();
    this.activeWorkflows.delete(workflowId);

    logger.info('Workflow cancelled', { workflowId });
    return true;
  }
}

// Made with Bob

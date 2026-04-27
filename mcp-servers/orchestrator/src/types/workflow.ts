/**
 * Workflow Type Definitions
 * Defines the structure for workflow execution and management
 */

export interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

export interface WorkflowStep {
  id: string;
  service: string;
  tool: string;
  inputs: Record<string, any>;
  outputs?: string[];
  dependsOn?: string[];
  condition?: string;
  retryPolicy?: RetryPolicy;
  timeout?: number;
  continueOnError?: boolean;
}

export interface ErrorHandlingStrategy {
  onStepFailure: 'stop' | 'continue' | 'rollback';
  rollbackSteps?: string[];
  notifyOnError?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version?: string;
  steps: WorkflowStep[];
  errorHandling?: ErrorHandlingStrategy;
  timeout?: number;
  metadata?: Record<string, any>;
}

export interface WorkflowStepResult {
  stepId: string;
  status: 'success' | 'failure' | 'skipped';
  output?: any;
  error?: Error;
  startTime: Date;
  endTime: Date;
  duration: number;
  retryCount?: number;
}

export interface WorkflowResult {
  workflowId: string;
  status: 'success' | 'failure' | 'partial';
  steps: WorkflowStepResult[];
  startTime: Date;
  endTime: Date;
  duration: number;
  error?: Error;
  metadata?: Record<string, any>;
}

export interface WorkflowState {
  workflowId: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  currentStep?: string;
  completedSteps: string[];
  failedSteps: string[];
  stepResults: Map<string, WorkflowStepResult>;
  variables: Map<string, any>;
  startTime?: Date;
  lastUpdateTime: Date;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  stepId?: string;
  field: string;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  stepId?: string;
  field: string;
  message: string;
  severity: 'warning';
}

export interface ExecutionStrategy {
  type: 'sequential' | 'parallel' | 'mixed';
  parallelGroups?: string[][];
  maxParallelSteps?: number;
}

export interface WorkflowContext {
  workflowId: string;
  inputs: Record<string, any>;
  variables: Map<string, any>;
  stepResults: Map<string, any>;
}

export interface StepExecutionContext {
  step: WorkflowStep;
  workflowContext: WorkflowContext;
  retryCount: number;
  previousAttemptError?: Error;
}

// Made with Bob

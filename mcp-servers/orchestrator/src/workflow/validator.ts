/**
 * Workflow Validator
 * Validates workflow definitions for correctness and completeness
 */

import { Workflow, ValidationResult, ValidationError, ValidationWarning } from '../types/workflow.js';
import { logger } from '../utils/logger.js';

export class WorkflowValidator {
  /**
   * Validate a workflow definition
   */
  validate(workflow: Workflow): ValidationResult {
    logger.debug('Validating workflow', { workflowId: workflow.id });

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic structure validation
    this.validateBasicStructure(workflow, errors);

    // Step validation
    this.validateSteps(workflow, errors, warnings);

    // Dependency validation
    this.validateDependencies(workflow, errors);

    // Circular dependency check
    this.checkCircularDependencies(workflow, errors);

    // Service and tool validation
    this.validateServicesAndTools(workflow, warnings);

    const valid = errors.length === 0;

    logger.info('Workflow validation complete', {
      workflowId: workflow.id,
      valid,
      errorCount: errors.length,
      warningCount: warnings.length,
    });

    return { valid, errors, warnings };
  }

  private validateBasicStructure(workflow: Workflow, errors: ValidationError[]): void {
    if (!workflow.id) {
      errors.push({
        field: 'id',
        message: 'Workflow ID is required',
        severity: 'error',
      });
    }

    if (!workflow.name) {
      errors.push({
        field: 'name',
        message: 'Workflow name is required',
        severity: 'error',
      });
    }

    if (!workflow.steps || workflow.steps.length === 0) {
      errors.push({
        field: 'steps',
        message: 'Workflow must have at least one step',
        severity: 'error',
      });
    }
  }

  private validateSteps(workflow: Workflow, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!workflow.steps) return;

    const stepIds = new Set<string>();

    for (const step of workflow.steps) {
      // Check for duplicate step IDs
      if (stepIds.has(step.id)) {
        errors.push({
          stepId: step.id,
          field: 'id',
          message: `Duplicate step ID: ${step.id}`,
          severity: 'error',
        });
      }
      stepIds.add(step.id);

      // Validate step structure
      if (!step.id) {
        errors.push({
          field: 'id',
          message: 'Step ID is required',
          severity: 'error',
        });
      }

      if (!step.service) {
        errors.push({
          stepId: step.id,
          field: 'service',
          message: 'Step service is required',
          severity: 'error',
        });
      }

      if (!step.tool) {
        errors.push({
          stepId: step.id,
          field: 'tool',
          message: 'Step tool is required',
          severity: 'error',
        });
      }

      if (!step.inputs) {
        warnings.push({
          stepId: step.id,
          field: 'inputs',
          message: 'Step has no inputs defined',
          severity: 'warning',
        });
      }

      // Validate retry policy if present
      if (step.retryPolicy) {
        this.validateRetryPolicy(step.id, step.retryPolicy, errors);
      }
    }
  }

  private validateRetryPolicy(stepId: string, retryPolicy: any, errors: ValidationError[]): void {
    if (retryPolicy.maxAttempts !== undefined && retryPolicy.maxAttempts < 1) {
      errors.push({
        stepId,
        field: 'retryPolicy.maxAttempts',
        message: 'maxAttempts must be at least 1',
        severity: 'error',
      });
    }

    if (retryPolicy.backoffMs !== undefined && retryPolicy.backoffMs < 0) {
      errors.push({
        stepId,
        field: 'retryPolicy.backoffMs',
        message: 'backoffMs must be non-negative',
        severity: 'error',
      });
    }

    if (retryPolicy.backoffMultiplier !== undefined && retryPolicy.backoffMultiplier < 1) {
      errors.push({
        stepId,
        field: 'retryPolicy.backoffMultiplier',
        message: 'backoffMultiplier must be at least 1',
        severity: 'error',
      });
    }
  }

  private validateDependencies(workflow: Workflow, errors: ValidationError[]): void {
    if (!workflow.steps) return;

    const stepIds = new Set(workflow.steps.map(s => s.id));

    for (const step of workflow.steps) {
      if (step.dependsOn) {
        for (const depId of step.dependsOn) {
          if (!stepIds.has(depId)) {
            errors.push({
              stepId: step.id,
              field: 'dependsOn',
              message: `Dependency references non-existent step: ${depId}`,
              severity: 'error',
            });
          }
        }
      }
    }
  }

  private checkCircularDependencies(workflow: Workflow, errors: ValidationError[]): void {
    if (!workflow.steps) return;

    const graph = this.buildDependencyGraph(workflow);
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const step of workflow.steps) {
      if (this.hasCircularDependency(step.id, graph, visited, recursionStack)) {
        errors.push({
          stepId: step.id,
          field: 'dependsOn',
          message: `Circular dependency detected involving step: ${step.id}`,
          severity: 'error',
        });
      }
    }
  }

  private buildDependencyGraph(workflow: Workflow): Map<string, string[]> {
    const graph = new Map<string, string[]>();

    for (const step of workflow.steps) {
      graph.set(step.id, step.dependsOn || []);
    }

    return graph;
  }

  private hasCircularDependency(
    stepId: string,
    graph: Map<string, string[]>,
    visited: Set<string>,
    recursionStack: Set<string>
  ): boolean {
    if (recursionStack.has(stepId)) {
      return true;
    }

    if (visited.has(stepId)) {
      return false;
    }

    visited.add(stepId);
    recursionStack.add(stepId);

    const dependencies = graph.get(stepId) || [];
    for (const depId of dependencies) {
      if (this.hasCircularDependency(depId, graph, visited, recursionStack)) {
        return true;
      }
    }

    recursionStack.delete(stepId);
    return false;
  }

  private validateServicesAndTools(workflow: Workflow, warnings: ValidationWarning[]): void {
    const validServices = ['security', 'codegen', 'memory', 'intelligence', 'tokens', 'sdlc', 'legacy', 'performance'];

    for (const step of workflow.steps) {
      if (!validServices.includes(step.service)) {
        warnings.push({
          stepId: step.id,
          field: 'service',
          message: `Unknown service: ${step.service}. Valid services are: ${validServices.join(', ')}`,
          severity: 'warning',
        });
      }
    }
  }

  /**
   * Validate variable interpolation in workflow
   */
  validateVariableInterpolation(workflow: Workflow): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const availableVariables = new Set<string>();

    for (const step of workflow.steps) {
      // Check inputs for variable references
      const inputStr = JSON.stringify(step.inputs);
      const variableRefs = this.extractVariableReferences(inputStr);

      for (const varRef of variableRefs) {
        if (!availableVariables.has(varRef) && !varRef.includes('.')) {
          warnings.push({
            stepId: step.id,
            field: 'inputs',
            message: `Variable reference '${varRef}' may not be available at execution time`,
            severity: 'warning',
          });
        }
      }

      // Add this step's outputs to available variables
      if (step.outputs) {
        for (const output of step.outputs) {
          availableVariables.add(`${step.id}.${output}`);
        }
      }
      availableVariables.add(step.id);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private extractVariableReferences(text: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim());
    }

    return matches;
  }
}

// Made with Bob

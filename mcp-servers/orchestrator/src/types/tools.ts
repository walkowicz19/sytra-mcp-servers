/**
 * Tool Type Definitions
 * Defines the structure for MCP tools and their parameters
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, PropertySchema>;
    required?: string[];
  };
}

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  enum?: any[];
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
  default?: any;
}

export interface ToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface ToolExecutionContext {
  toolName: string;
  arguments: Record<string, any>;
  startTime: Date;
  timeout?: number;
  retryCount?: number;
}

export interface ToolExecutionResult {
  success: boolean;
  result?: any;
  error?: Error;
  duration: number;
  metadata?: Record<string, any>;
}

// High-level tool parameter types
export interface AnalyzeCodeParams {
  code: string;
  language?: string;
  includeSecurityScan?: boolean;
  includePerformanceAnalysis?: boolean;
  includeComplexityMetrics?: boolean;
}

export interface GenerateSecureCodeParams {
  requirements: string;
  language: string;
  securityLevel?: 'standard' | 'high' | 'critical';
  includeTests?: boolean;
  includeDocumentation?: boolean;
}

export interface ModernizeLegacyParams {
  legacyCode: string;
  sourceLanguage: 'cobol' | 'fortran' | 'assembly' | 'rpg';
  targetLanguage: 'python' | 'java' | 'javascript' | 'typescript';
  includeMigrationPlan?: boolean;
  preserveBusinessLogic?: boolean;
}

export interface OptimizeWorkflowParams {
  workflowDescription: string;
  currentMetrics?: Record<string, number>;
  optimizationGoals?: string[];
}

export interface FullSDLCCycleParams {
  requirements: string;
  projectType?: string;
  includeDeployment?: boolean;
  targetEnvironment?: string;
}

export interface IntelligentRefactorParams {
  code: string;
  language: string;
  refactoringGoals?: string[];
  preserveTests?: boolean;
}

export interface SecurityAuditParams {
  code: string;
  language: string;
  auditDepth?: 'basic' | 'standard' | 'comprehensive';
  includeRemediation?: boolean;
}

export interface PerformanceTuneParams {
  code: string;
  language: string;
  targetMetrics?: Record<string, number>;
  optimizationLevel?: 'conservative' | 'balanced' | 'aggressive';
}

export interface MemoryOptimizeParams {
  context: string;
  maxTokens?: number;
  preserveImportantInfo?: boolean;
}

export interface ExecuteWorkflowParams {
  workflowId?: string;
  workflowDefinition?: any;
  inputs: Record<string, any>;
  async?: boolean;
}

export interface ListWorkflowsParams {
  category?: string;
  tags?: string[];
}

export interface GetWorkflowStatusParams {
  workflowId: string;
  includeStepDetails?: boolean;
}

// Service-specific result types
export interface SecurityScanResult {
  vulnerabilities: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: string;
    description: string;
    location: string;
    remediation?: string;
  }>;
  score: number;
  recommendations: string[];
}

export interface CodeGenerationResult {
  code: string;
  language: string;
  tests?: string;
  documentation?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceAnalysisResult {
  cpuProfile?: any;
  memoryProfile?: any;
  bottlenecks: Array<{
    location: string;
    type: string;
    impact: 'low' | 'medium' | 'high';
    suggestion: string;
  }>;
  optimizations: string[];
}

export interface LegacyTranslationResult {
  modernCode: string;
  targetLanguage: string;
  migrationPlan?: string;
  warnings: string[];
  preservedFeatures: string[];
}

// Made with Bob

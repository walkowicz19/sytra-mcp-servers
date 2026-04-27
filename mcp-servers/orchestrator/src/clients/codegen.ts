/**
 * Code Generation Service Client
 * Provides access to code generation service
 */

import { BaseClient } from './base.js';

export interface CodeGenerationRequest {
  requirements: string;
  language: string;
  framework?: string;
  style?: string;
}

export interface CodeGenerationResult {
  code: string;
  language: string;
  explanation?: string;
  warnings?: string[];
}

export interface CodeValidationResult {
  valid: boolean;
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: string;
  }>;
  warnings: string[];
}

export interface RefactoringResult {
  refactoredCode: string;
  changes: Array<{
    type: string;
    description: string;
    location: string;
  }>;
  improvements: string[];
}

export class CodegenClient extends BaseClient {
  constructor(baseURL: string) {
    super('codegen', { baseURL });
  }

  async generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResult> {
    return this.post<CodeGenerationResult>('/generate', request);
  }

  async validateCode(code: string, language: string): Promise<CodeValidationResult> {
    return this.post<CodeValidationResult>('/validate', { code, language });
  }

  async refactorCode(code: string, language: string, goals?: string[]): Promise<RefactoringResult> {
    return this.post<RefactoringResult>('/refactor', { code, language, goals });
  }

  async explainCode(code: string, language: string): Promise<{ explanation: string }> {
    return this.post<{ explanation: string }>('/explain', { code, language });
  }

  async generateTests(code: string, language: string, framework?: string): Promise<{ tests: string }> {
    return this.post<{ tests: string }>('/generate-tests', { code, language, framework });
  }

  async optimizeCode(code: string, language: string): Promise<{ optimizedCode: string; improvements: string[] }> {
    return this.post('/optimize', { code, language });
  }
}

// Made with Bob

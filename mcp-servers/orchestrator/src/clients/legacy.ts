/**
 * Legacy Support Service Client
 * Provides access to legacy support service
 */

import { BaseClient } from './base.js';

export interface ParseResult {
  ast: any;
  metadata: Record<string, any>;
  warnings: string[];
}

export interface DependencyAnalysis {
  dependencies: Array<{
    name: string;
    type: string;
    location: string;
  }>;
  graph: Record<string, string[]>;
  circularDependencies: string[][];
}

export interface TranslationResult {
  translatedCode: string;
  targetLanguage: string;
  warnings: string[];
  notes: string[];
}

export interface MigrationPlan {
  phases: Array<{
    phase: number;
    name: string;
    description: string;
    tasks: string[];
    estimatedDuration: string;
    risks: string[];
  }>;
  totalEstimate: string;
  recommendations: string[];
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  linesOfCode: number;
  maintainabilityIndex: number;
}

export class LegacyClient extends BaseClient {
  constructor(baseURL: string) {
    super('legacy', { baseURL });
  }

  async parseCobol(code: string): Promise<ParseResult> {
    return this.post<ParseResult>('/parse/cobol', { code });
  }

  async parseFortran(code: string): Promise<ParseResult> {
    return this.post<ParseResult>('/parse/fortran', { code });
  }

  async parseAssembly(code: string, architecture: string): Promise<ParseResult> {
    return this.post<ParseResult>('/parse/assembly', { code, architecture });
  }

  async parseRPG(code: string): Promise<ParseResult> {
    return this.post<ParseResult>('/parse/rpg', { code });
  }

  async parseJCL(code: string): Promise<ParseResult> {
    return this.post<ParseResult>('/parse/jcl', { code });
  }

  async analyzeDependencies(code: string, language: string): Promise<DependencyAnalysis> {
    return this.post<DependencyAnalysis>('/analyze/dependencies', { code, language });
  }

  async analyzeComplexity(code: string, language: string): Promise<ComplexityMetrics> {
    return this.post<ComplexityMetrics>('/analyze/complexity', { code, language });
  }

  async analyzeDataFlow(code: string, language: string): Promise<{
    flows: Array<{
      from: string;
      to: string;
      type: string;
    }>;
    variables: Record<string, any>;
  }> {
    return this.post('/analyze/dataflow', { code, language });
  }

  async translateCobolToPython(code: string): Promise<TranslationResult> {
    return this.post<TranslationResult>('/translate/cobol-to-python', { code });
  }

  async translateCobolToJava(code: string): Promise<TranslationResult> {
    return this.post<TranslationResult>('/translate/cobol-to-java', { code });
  }

  async translateFortranToPython(code: string): Promise<TranslationResult> {
    return this.post<TranslationResult>('/translate/fortran-to-python', { code });
  }

  async translateAssemblyToC(code: string, architecture: string): Promise<TranslationResult> {
    return this.post<TranslationResult>('/translate/assembly-to-c', { code, architecture });
  }

  async generateMigrationPlan(legacyCode: string, targetLanguage: string): Promise<MigrationPlan> {
    return this.post<MigrationPlan>('/migration/plan', { legacyCode, targetLanguage });
  }

  async generateAPIWrapper(legacyCode: string, language: string): Promise<{
    wrapper: string;
    documentation: string;
  }> {
    return this.post('/modernize/api-wrapper', { legacyCode, language });
  }

  async createCompatibilityLayer(legacyCode: string, modernCode: string): Promise<{
    layer: string;
    mappings: Record<string, string>;
  }> {
    return this.post('/modernize/compatibility-layer', { legacyCode, modernCode });
  }

  async refactorLegacy(code: string, language: string, goals: string[]): Promise<{
    refactoredCode: string;
    changes: string[];
    improvements: string[];
  }> {
    return this.post('/refactor', { code, language, goals });
  }
}

// Made with Bob

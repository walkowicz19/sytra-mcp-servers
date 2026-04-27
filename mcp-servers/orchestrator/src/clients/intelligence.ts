/**
 * Intelligence Amplification Service Client
 * Provides access to intelligence amplification service
 */

import { BaseClient } from './base.js';

export interface PromptOptimizationResult {
  optimizedPrompt: string;
  improvements: string[];
  estimatedQualityScore: number;
}

export interface TaskDecompositionResult {
  subtasks: Array<{
    id: string;
    description: string;
    dependencies: string[];
    estimatedComplexity: number;
  }>;
  executionPlan: string;
}

export interface ReasoningChainResult {
  steps: Array<{
    step: number;
    reasoning: string;
    conclusion: string;
  }>;
  finalAnswer: string;
  confidence: number;
}

export interface RAGResult {
  answer: string;
  sources: Array<{
    content: string;
    relevance: number;
    metadata?: Record<string, any>;
  }>;
  confidence: number;
}

export interface ModelRoutingResult {
  selectedModel: string;
  reasoning: string;
  estimatedCost: number;
  estimatedQuality: number;
}

export class IntelligenceClient extends BaseClient {
  constructor(baseURL: string) {
    super('intelligence', { baseURL });
  }

  async optimizePrompt(prompt: string, task: string): Promise<PromptOptimizationResult> {
    return this.post<PromptOptimizationResult>('/prompt/optimize', { prompt, task });
  }

  async decomposeTask(task: string, context?: string): Promise<TaskDecompositionResult> {
    return this.post<TaskDecompositionResult>('/task/decompose', { task, context });
  }

  async reasoningChain(question: string, context?: string): Promise<ReasoningChainResult> {
    return this.post<ReasoningChainResult>('/reasoning/chain', { question, context });
  }

  async ragQuery(query: string, documents: string[]): Promise<RAGResult> {
    return this.post<RAGResult>('/rag/query', { query, documents });
  }

  async routeToModel(task: string, requirements?: Record<string, any>): Promise<ModelRoutingResult> {
    return this.post<ModelRoutingResult>('/model/route', { task, requirements });
  }

  async selfReflect(output: string, criteria: string[]): Promise<{
    score: number;
    feedback: string[];
    improvements: string[];
  }> {
    return this.post('/reflect', { output, criteria });
  }

  async multiAgentCollaboration(task: string, agents: string[]): Promise<{
    result: string;
    contributions: Record<string, string>;
  }> {
    return this.post('/multi-agent/collaborate', { task, agents });
  }
}

// Made with Bob

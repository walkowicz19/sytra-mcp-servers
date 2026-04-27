/**
 * Token Optimization Service Client
 * Provides access to token optimization service
 */

import { BaseClient } from './base.js';

export interface TokenCount {
  total: number;
  bySection?: Record<string, number>;
}

export interface OptimizationResult {
  optimizedContent: string;
  originalTokens: number;
  optimizedTokens: number;
  savings: number;
  savingsPercentage: number;
}

export interface PruningResult {
  prunedContent: string;
  removedSections: string[];
  tokensSaved: number;
}

export interface SummarizationResult {
  summary: string;
  originalLength: number;
  summaryLength: number;
  compressionRatio: number;
}

export class TokensClient extends BaseClient {
  constructor(baseURL: string) {
    super('tokens', { baseURL });
  }

  async countTokens(content: string, model?: string): Promise<TokenCount> {
    return this.post<TokenCount>('/tokens/count', { content, model });
  }

  async optimizeContext(content: string, maxTokens?: number): Promise<OptimizationResult> {
    return this.post<OptimizationResult>('/optimize/context', { content, maxTokens });
  }

  async pruneContent(content: string, strategy: string = 'importance'): Promise<PruningResult> {
    return this.post<PruningResult>('/prune', { content, strategy });
  }

  async summarizeContent(content: string, targetLength?: number): Promise<SummarizationResult> {
    return this.post<SummarizationResult>('/summarize', { content, targetLength });
  }

  async compressPrompt(prompt: string, targetTokens: number): Promise<{
    compressed: string;
    originalTokens: number;
    compressedTokens: number;
  }> {
    return this.post('/compress', { prompt, targetTokens });
  }

  async filterRelevant(content: string, query: string): Promise<{
    filtered: string;
    relevanceScore: number;
  }> {
    return this.post('/filter', { content, query });
  }

  async manageWindow(contents: string[], maxTokens: number): Promise<{
    selected: string[];
    totalTokens: number;
    excluded: string[];
  }> {
    return this.post('/window/manage', { contents, maxTokens });
  }

  async estimateCost(content: string, model: string): Promise<{
    inputCost: number;
    outputCost: number;
    totalCost: number;
  }> {
    return this.post('/cost/estimate', { content, model });
  }
}

// Made with Bob

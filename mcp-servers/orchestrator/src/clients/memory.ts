/**
 * Memory Management Service Client
 * Provides access to memory management service
 */

import { BaseClient } from './base.js';

export interface MemoryEntry {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ContextWindow {
  content: string;
  tokenCount: number;
  priority: number;
}

export interface CompressionResult {
  compressed: string;
  originalTokens: number;
  compressedTokens: number;
  compressionRatio: number;
}

export interface RetrievalResult {
  memories: MemoryEntry[];
  relevanceScores: number[];
  totalFound: number;
}

export class MemoryClient extends BaseClient {
  constructor(baseURL: string) {
    super('memory', { baseURL });
  }

  async storeMemory(content: string, metadata?: Record<string, any>): Promise<{ id: string }> {
    return this.post<{ id: string }>('/memory/store', { content, metadata });
  }

  async retrieveMemories(query: string, limit: number = 10): Promise<RetrievalResult> {
    return this.post<RetrievalResult>('/memory/retrieve', { query, limit });
  }

  async deleteMemory(id: string): Promise<void> {
    await this.delete(`/memory/${id}`);
  }

  async compressContext(context: string, targetTokens?: number): Promise<CompressionResult> {
    return this.post<CompressionResult>('/context/compress', { context, targetTokens });
  }

  async manageContextWindow(contexts: string[], maxTokens: number): Promise<ContextWindow[]> {
    return this.post<ContextWindow[]>('/context/manage', { contexts, maxTokens });
  }

  async summarizeContext(context: string): Promise<{ summary: string }> {
    return this.post<{ summary: string }>('/context/summarize', { context });
  }

  async searchMemories(query: string, filters?: Record<string, any>): Promise<MemoryEntry[]> {
    return this.post<MemoryEntry[]>('/memory/search', { query, filters });
  }

  async getMemoryStats(): Promise<{
    totalMemories: number;
    totalTokens: number;
    averageRelevance: number;
  }> {
    return this.get('/memory/stats');
  }
}

// Made with Bob

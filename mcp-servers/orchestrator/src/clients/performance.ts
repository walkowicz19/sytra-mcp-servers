/**
 * Performance Optimizer Service Client
 * Provides access to performance optimization service
 */

import { BaseClient } from './base.js';

export interface CPUProfile {
  hotspots: Array<{
    function: string;
    file: string;
    line: number;
    cpuTime: number;
    percentage: number;
  }>;
  totalTime: number;
  recommendations: string[];
}

export interface MemoryProfile {
  allocations: Array<{
    location: string;
    size: number;
    count: number;
  }>;
  leaks: Array<{
    location: string;
    size: number;
    description: string;
  }>;
  peakUsage: number;
  recommendations: string[];
}

export interface IOProfile {
  operations: Array<{
    type: string;
    path: string;
    duration: number;
    size: number;
  }>;
  bottlenecks: string[];
  recommendations: string[];
}

export interface NetworkProfile {
  requests: Array<{
    url: string;
    method: string;
    duration: number;
    size: number;
  }>;
  latency: {
    min: number;
    max: number;
    avg: number;
  };
  recommendations: string[];
}

export interface CacheOptimization {
  strategy: string;
  implementation: string;
  estimatedImprovement: number;
  recommendations: string[];
}

export interface OptimizationResult {
  optimizedCode: string;
  improvements: Array<{
    type: string;
    description: string;
    impact: string;
  }>;
  estimatedSpeedup: number;
}

export class PerformanceClient extends BaseClient {
  constructor(baseURL: string) {
    super('performance', { baseURL });
  }

  async profileCPU(code: string, language: string): Promise<CPUProfile> {
    return this.post<CPUProfile>('/profile/cpu', { code, language });
  }

  async profileMemory(code: string, language: string): Promise<MemoryProfile> {
    return this.post<MemoryProfile>('/profile/memory', { code, language });
  }

  async profileIO(code: string, language: string): Promise<IOProfile> {
    return this.post<IOProfile>('/profile/io', { code, language });
  }

  async profileNetwork(code: string, language: string): Promise<NetworkProfile> {
    return this.post<NetworkProfile>('/profile/network', { code, language });
  }

  async optimizeCache(code: string, language: string): Promise<CacheOptimization> {
    return this.post<CacheOptimization>('/optimize/cache', { code, language });
  }

  async optimizeAlgorithm(code: string, language: string): Promise<OptimizationResult> {
    return this.post<OptimizationResult>('/optimize/algorithm', { code, language });
  }

  async optimizeDatabase(queries: string[]): Promise<{
    optimizedQueries: string[];
    improvements: string[];
    estimatedSpeedup: number;
  }> {
    return this.post('/optimize/database', { queries });
  }

  async analyzeBottlenecks(code: string, language: string): Promise<{
    bottlenecks: Array<{
      location: string;
      type: string;
      severity: string;
      description: string;
      suggestion: string;
    }>;
    priorityOrder: string[];
  }> {
    return this.post('/analyze/bottlenecks', { code, language });
  }

  async suggestParallelization(code: string, language: string): Promise<{
    opportunities: Array<{
      location: string;
      type: string;
      estimatedSpeedup: number;
      implementation: string;
    }>;
  }> {
    return this.post('/suggest/parallelization', { code, language });
  }

  async benchmarkCode(code: string, language: string, iterations?: number): Promise<{
    averageTime: number;
    minTime: number;
    maxTime: number;
    standardDeviation: number;
  }> {
    return this.post('/benchmark', { code, language, iterations });
  }
}

// Made with Bob

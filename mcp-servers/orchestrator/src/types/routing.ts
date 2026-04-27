/**
 * Routing Type Definitions
 * Defines the structure for intelligent routing decisions
 */

export interface ToolRequest {
  tool: string;
  arguments: Record<string, any>;
  context?: RequestContext;
}

export interface RequestContext {
  userId?: string;
  sessionId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  timeout?: number;
  metadata?: Record<string, any>;
}

export interface RoutingDecision {
  service: string;
  tool: string;
  priority: number;
  reasoning: string;
  confidence: number;
  estimatedDuration?: number;
  dependencies?: string[];
}

export interface ExecutionStrategy {
  type: 'sequential' | 'parallel' | 'mixed';
  parallelGroups?: RoutingDecision[][];
  maxConcurrency?: number;
  timeout?: number;
}

export interface ServiceCapability {
  service: string;
  tools: string[];
  specializations: string[];
  averageResponseTime: number;
  successRate: number;
  currentLoad: number;
}

export interface RoutingRule {
  id: string;
  pattern: string | RegExp;
  targetService: string;
  targetTool: string;
  priority: number;
  conditions?: RoutingCondition[];
}

export interface RoutingCondition {
  field: string;
  operator: 'equals' | 'contains' | 'matches' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface RoutingMetrics {
  totalRequests: number;
  successfulRoutes: number;
  failedRoutes: number;
  averageRoutingTime: number;
  serviceUtilization: Map<string, number>;
}

export interface LoadBalancingStrategy {
  type: 'round-robin' | 'least-loaded' | 'weighted' | 'priority';
  weights?: Map<string, number>;
}

export interface CircuitBreakerState {
  service: string;
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  lastFailureTime?: Date;
  nextRetryTime?: Date;
}

export interface RoutingCache {
  key: string;
  decision: RoutingDecision;
  timestamp: Date;
  hits: number;
  ttl: number;
}

// Made with Bob

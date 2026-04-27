/**
 * Intelligent Router
 * Routes requests to appropriate services based on analysis
 */

import { ToolRequest, RoutingDecision, ExecutionStrategy, RoutingRule } from './types/routing.js';
import { logger } from './utils/logger.js';

export class IntelligentRouter {
  private rules: RoutingRule[] = [];
  private serviceCapabilities: Map<string, string[]> = new Map();

  constructor() {
    this.initializeServiceCapabilities();
    this.initializeRoutingRules();
  }

  private initializeServiceCapabilities(): void {
    // Define what each service can do
    this.serviceCapabilities.set('security', [
      'classify', 'access', 'scan', 'encrypt', 'decrypt', 'audit', 'vulnerability'
    ]);
    this.serviceCapabilities.set('codegen', [
      'generate', 'validate', 'refactor', 'explain', 'test', 'optimize'
    ]);
    this.serviceCapabilities.set('memory', [
      'store', 'retrieve', 'compress', 'summarize', 'search'
    ]);
    this.serviceCapabilities.set('intelligence', [
      'prompt', 'decompose', 'reason', 'rag', 'route', 'reflect', 'collaborate'
    ]);
    this.serviceCapabilities.set('tokens', [
      'count', 'optimize', 'prune', 'summarize', 'compress', 'filter', 'window', 'cost'
    ]);
    this.serviceCapabilities.set('sdlc', [
      'requirements', 'design', 'review', 'test', 'documentation', 'debt', 'cicd', 'integrate'
    ]);
    this.serviceCapabilities.set('legacy', [
      'parse', 'analyze', 'translate', 'migrate', 'modernize', 'refactor'
    ]);
    this.serviceCapabilities.set('performance', [
      'profile', 'optimize', 'benchmark', 'bottleneck', 'parallelize'
    ]);
  }

  private initializeRoutingRules(): void {
    // Define routing rules for common patterns
    this.rules = [
      {
        id: 'security-scan',
        pattern: /security|vulnerability|scan|sensitive/i,
        targetService: 'security',
        targetTool: 'scan',
        priority: 10,
      },
      {
        id: 'code-generation',
        pattern: /generate|create|build.*code/i,
        targetService: 'codegen',
        targetTool: 'generate',
        priority: 9,
      },
      {
        id: 'legacy-translation',
        pattern: /translate|modernize|cobol|fortran|legacy/i,
        targetService: 'legacy',
        targetTool: 'translate',
        priority: 9,
      },
      {
        id: 'performance-optimization',
        pattern: /optimize|performance|speed|slow/i,
        targetService: 'performance',
        targetTool: 'optimize',
        priority: 8,
      },
      {
        id: 'code-review',
        pattern: /review|analyze.*code|quality/i,
        targetService: 'sdlc',
        targetTool: 'review',
        priority: 8,
      },
    ];
  }

  /**
   * Analyze request and determine which service(s) to call
   */
  route(request: ToolRequest): RoutingDecision[] {
    logger.info('Routing request', { tool: request.tool });

    const decisions: RoutingDecision[] = [];

    // Check if tool name directly maps to a service
    const directMapping = this.getDirectMapping(request.tool);
    if (directMapping) {
      decisions.push(directMapping);
    }

    // Apply routing rules
    const ruleBasedDecisions = this.applyRoutingRules(request);
    decisions.push(...ruleBasedDecisions);

    // Analyze request content for additional routing
    const contentBasedDecisions = this.analyzeRequestContent(request);
    decisions.push(...contentBasedDecisions);

    // Remove duplicates and sort by priority
    const uniqueDecisions = this.deduplicateDecisions(decisions);
    const sortedDecisions = this.sortByPriority(uniqueDecisions);

    logger.debug('Routing decisions', { 
      count: sortedDecisions.length,
      decisions: sortedDecisions.map(d => ({ service: d.service, tool: d.tool }))
    });

    return sortedDecisions;
  }

  private getDirectMapping(toolName: string): RoutingDecision | null {
    // Map tool names to services
    const mappings: Record<string, { service: string; tool: string }> = {
      'stark_analyze_code': { service: 'codegen', tool: 'analyze' },
      'stark_generate_secure_code': { service: 'codegen', tool: 'generate' },
      'stark_modernize_legacy': { service: 'legacy', tool: 'modernize' },
      'stark_optimize_workflow': { service: 'sdlc', tool: 'optimize' },
      'stark_full_sdlc_cycle': { service: 'sdlc', tool: 'full_cycle' },
      'stark_intelligent_refactor': { service: 'codegen', tool: 'refactor' },
      'stark_security_audit': { service: 'security', tool: 'audit' },
      'stark_performance_tune': { service: 'performance', tool: 'tune' },
      'stark_memory_optimize': { service: 'memory', tool: 'optimize' },
    };

    const mapping = mappings[toolName];
    if (mapping) {
      return {
        service: mapping.service,
        tool: mapping.tool,
        priority: 10,
        reasoning: 'Direct tool mapping',
        confidence: 1.0,
      };
    }

    return null;
  }

  private applyRoutingRules(request: ToolRequest): RoutingDecision[] {
    const decisions: RoutingDecision[] = [];
    const requestText = `${request.tool} ${JSON.stringify(request.arguments)}`;

    for (const rule of this.rules) {
      if (requestText.match(rule.pattern)) {
        decisions.push({
          service: rule.targetService,
          tool: rule.targetTool,
          priority: rule.priority,
          reasoning: `Matched routing rule: ${rule.id}`,
          confidence: 0.8,
        });
      }
    }

    return decisions;
  }

  private analyzeRequestContent(request: ToolRequest): RoutingDecision[] {
    const decisions: RoutingDecision[] = [];
    const args = request.arguments;

    // Check for security-related keywords
    if (this.containsSecurityKeywords(args)) {
      decisions.push({
        service: 'security',
        tool: 'scan',
        priority: 9,
        reasoning: 'Security keywords detected',
        confidence: 0.7,
      });
    }

    // Check for legacy code indicators
    if (this.containsLegacyIndicators(args)) {
      decisions.push({
        service: 'legacy',
        tool: 'analyze',
        priority: 8,
        reasoning: 'Legacy code indicators detected',
        confidence: 0.7,
      });
    }

    // Check for performance concerns
    if (this.containsPerformanceKeywords(args)) {
      decisions.push({
        service: 'performance',
        tool: 'profile',
        priority: 7,
        reasoning: 'Performance keywords detected',
        confidence: 0.6,
      });
    }

    return decisions;
  }

  private containsSecurityKeywords(args: Record<string, any>): boolean {
    const keywords = ['password', 'secret', 'key', 'token', 'credential', 'auth', 'encrypt'];
    const text = JSON.stringify(args).toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  }

  private containsLegacyIndicators(args: Record<string, any>): boolean {
    const indicators = ['cobol', 'fortran', 'assembly', 'mainframe', 'rpg', 'jcl'];
    const text = JSON.stringify(args).toLowerCase();
    return indicators.some(indicator => text.includes(indicator));
  }

  private containsPerformanceKeywords(args: Record<string, any>): boolean {
    const keywords = ['slow', 'optimize', 'performance', 'speed', 'bottleneck', 'latency'];
    const text = JSON.stringify(args).toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  }

  private deduplicateDecisions(decisions: RoutingDecision[]): RoutingDecision[] {
    const seen = new Set<string>();
    return decisions.filter(decision => {
      const key = `${decision.service}:${decision.tool}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private sortByPriority(decisions: RoutingDecision[]): RoutingDecision[] {
    return decisions.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Determine optimal execution order for decisions
   */
  optimizeExecutionOrder(decisions: RoutingDecision[]): RoutingDecision[] {
    // Sort by dependencies and priority
    const sorted = [...decisions];
    
    // Group by dependencies
    const withDeps = sorted.filter(d => d.dependencies && d.dependencies.length > 0);
    const withoutDeps = sorted.filter(d => !d.dependencies || d.dependencies.length === 0);

    // Execute independent tasks first, then dependent ones
    return [...withoutDeps, ...withDeps];
  }

  /**
   * Determine execution strategy (parallel vs sequential)
   */
  determineExecutionStrategy(decisions: RoutingDecision[]): ExecutionStrategy {
    // Check if any decisions have dependencies
    const hasDependencies = decisions.some(d => d.dependencies && d.dependencies.length > 0);

    if (!hasDependencies && decisions.length > 1) {
      // All independent - can run in parallel
      return {
        type: 'parallel',
        maxConcurrency: Math.min(decisions.length, 5),
      };
    }

    if (hasDependencies) {
      // Mixed - some parallel, some sequential
      const independent = decisions.filter(d => !d.dependencies || d.dependencies.length === 0);
      const dependent = decisions.filter(d => d.dependencies && d.dependencies.length > 0);

      if (independent.length > 0 && dependent.length > 0) {
        return {
          type: 'mixed',
          parallelGroups: [
            independent.map(d => d),
            dependent.map(d => d),
          ],
          maxConcurrency: 3,
        };
      }
    }

    // Default to sequential
    return {
      type: 'sequential',
    };
  }

  /**
   * Get service capabilities
   */
  getServiceCapabilities(service: string): string[] {
    return this.serviceCapabilities.get(service) || [];
  }

  /**
   * Check if a service can handle a specific capability
   */
  canServiceHandle(service: string, capability: string): boolean {
    const capabilities = this.getServiceCapabilities(service);
    return capabilities.some(cap => capability.toLowerCase().includes(cap));
  }
}

// Made with Bob

/**
 * Automatic Tool Routing
 * Analyzes natural language requests to determine appropriate Sytra tool
 */

import { logger } from '../utils/logger.js';

export interface RoutingDecision {
  toolName: string;
  confidence: number;
  reasoning: string;
  alternativeTools?: Array<{ toolName: string; confidence: number }>;
}

export interface RoutingConfig {
  enabled: boolean;
  confidenceThreshold: number;
}

interface ToolMapping {
  tool: string;
  keywords: string[];
  phrases: string[];
  description: string;
}

export class AutoRouter {
  private config: RoutingConfig;
  private toolMappings: ToolMapping[];

  constructor(config: RoutingConfig) {
    this.config = config;
    this.toolMappings = this.initializeToolMappings();
    logger.info('AutoRouter initialized', { 
      enabled: config.enabled,
      threshold: config.confidenceThreshold 
    });
  }

  /**
   * Initialize tool mappings with keywords and phrases
   */
  private initializeToolMappings(): ToolMapping[] {
    return [
      {
        tool: 'sytra_analyze_code',
        keywords: ['analyze', 'analysis', 'check', 'inspect', 'review', 'examine', 'scan', 'audit'],
        phrases: [
          'analyze code',
          'code analysis',
          'check code',
          'inspect code',
          'review code',
          'examine code',
          'scan code',
          'code quality',
          'code metrics',
        ],
        description: 'Comprehensive code analysis',
      },
      {
        tool: 'sytra_security_audit',
        keywords: ['security', 'vulnerability', 'vulnerabilities', 'secure', 'exploit', 'cve'],
        phrases: [
          'security scan',
          'security audit',
          'security check',
          'find vulnerabilities',
          'security analysis',
          'check security',
          'security review',
          'vulnerability scan',
        ],
        description: 'Security vulnerability scanning',
      },
      {
        tool: 'sytra_code_intelligence',
        keywords: ['reference', 'references', 'definition', 'usage', 'find', 'search', 'symbol'],
        phrases: [
          'find references',
          'find usages',
          'where is used',
          'find definition',
          'go to definition',
          'symbol search',
          'code search',
          'find symbol',
        ],
        description: 'Code intelligence and navigation',
      },
      {
        tool: 'sytra_performance_tune',
        keywords: ['performance', 'optimize', 'speed', 'slow', 'bottleneck', 'profile', 'benchmark'],
        phrases: [
          'check performance',
          'performance analysis',
          'optimize performance',
          'improve performance',
          'performance tuning',
          'find bottlenecks',
          'speed up',
          'make faster',
        ],
        description: 'Performance optimization',
      },
      {
        tool: 'sytra_generate_secure_code',
        keywords: ['generate', 'create', 'write', 'build', 'implement', 'code'],
        phrases: [
          'generate code',
          'create code',
          'write code',
          'implement feature',
          'build function',
          'create function',
          'generate class',
          'write implementation',
        ],
        description: 'Secure code generation',
      },
      {
        tool: 'sytra_modernize_legacy',
        keywords: ['modernize', 'migrate', 'convert', 'translate', 'legacy', 'cobol', 'fortran'],
        phrases: [
          'modernize code',
          'migrate legacy',
          'convert legacy',
          'translate code',
          'legacy migration',
          'modernize legacy',
          'update legacy',
          'port code',
        ],
        description: 'Legacy code modernization',
      },
      {
        tool: 'sytra_intelligent_refactor',
        keywords: ['refactor', 'refactoring', 'restructure', 'improve', 'clean', 'simplify'],
        phrases: [
          'refactor code',
          'clean up code',
          'improve code',
          'restructure code',
          'simplify code',
          'code refactoring',
          'make cleaner',
          'improve structure',
        ],
        description: 'Intelligent code refactoring',
      },
      {
        tool: 'sytra_memory_optimize',
        keywords: ['memory', 'token', 'tokens', 'context', 'compress', 'summarize'],
        phrases: [
          'optimize memory',
          'reduce tokens',
          'compress context',
          'summarize context',
          'memory optimization',
          'token optimization',
          'reduce memory',
          'optimize context',
        ],
        description: 'Memory and token optimization',
      },
      {
        tool: 'sytra_execute_workflow',
        keywords: ['workflow', 'execute', 'run', 'process', 'pipeline', 'automation'],
        phrases: [
          'execute workflow',
          'run workflow',
          'start workflow',
          'run process',
          'execute pipeline',
          'run automation',
          'start process',
          'execute automation',
        ],
        description: 'Workflow execution',
      },
      {
        tool: 'sytra_full_sdlc_cycle',
        keywords: ['sdlc', 'full cycle', 'complete', 'end-to-end', 'development', 'lifecycle'],
        phrases: [
          'full sdlc',
          'complete cycle',
          'end-to-end development',
          'full development',
          'complete development',
          'sdlc cycle',
          'development lifecycle',
          'full lifecycle',
        ],
        description: 'Full SDLC cycle',
      },
      {
        tool: 'sytra_optimize_workflow',
        keywords: ['optimize workflow', 'improve workflow', 'workflow optimization'],
        phrases: [
          'optimize workflow',
          'improve workflow',
          'workflow optimization',
          'enhance workflow',
          'better workflow',
          'workflow improvement',
        ],
        description: 'Workflow optimization',
      },
      {
        tool: 'sytra_list_workflows',
        keywords: ['list', 'show', 'available', 'workflows', 'what workflows'],
        phrases: [
          'list workflows',
          'show workflows',
          'available workflows',
          'what workflows',
          'get workflows',
          'workflow list',
        ],
        description: 'List available workflows',
      },
    ];
  }

  /**
   * Route a natural language request to appropriate tool
   */
  route(request: string): RoutingDecision {
    if (!this.config.enabled) {
      return {
        toolName: '',
        confidence: 0,
        reasoning: 'Auto-routing is disabled',
      };
    }

    const normalizedRequest = request.toLowerCase().trim();
    const scores: Array<{ tool: string; score: number; matches: string[] }> = [];

    // Calculate scores for each tool
    for (const mapping of this.toolMappings) {
      let score = 0;
      const matches: string[] = [];

      // Check phrase matches (higher weight)
      for (const phrase of mapping.phrases) {
        if (normalizedRequest.includes(phrase)) {
          score += 10;
          matches.push(`phrase: "${phrase}"`);
        }
      }

      // Check keyword matches
      for (const keyword of mapping.keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(normalizedRequest)) {
          score += 3;
          matches.push(`keyword: "${keyword}"`);
        }
      }

      if (score > 0) {
        scores.push({ tool: mapping.tool, score, matches });
      }
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    if (scores.length === 0) {
      return {
        toolName: '',
        confidence: 0,
        reasoning: 'No matching tool found for the request',
      };
    }

    // Calculate confidence (normalize to 0-1)
    const maxScore = scores[0].score;
    const confidence = Math.min(maxScore / 20, 1.0); // 20 points = 100% confidence

    // Get alternatives
    const alternatives = scores.slice(1, 4).map(s => ({
      toolName: s.tool,
      confidence: Math.min(s.score / 20, 1.0),
    }));

    const decision: RoutingDecision = {
      toolName: scores[0].tool,
      confidence,
      reasoning: `Matched: ${scores[0].matches.join(', ')}`,
      alternativeTools: alternatives.length > 0 ? alternatives : undefined,
    };

    logger.info('Auto-routing decision', {
      request: request.substring(0, 100),
      decision: decision.toolName,
      confidence: decision.confidence,
    });

    return decision;
  }

  /**
   * Check if routing confidence meets threshold
   */
  shouldUseRouting(decision: RoutingDecision): boolean {
    return decision.confidence >= this.config.confidenceThreshold;
  }

  /**
   * Get tool suggestions for a request
   */
  getSuggestions(request: string, limit: number = 3): Array<{ tool: string; confidence: number; description: string }> {
    const decision = this.route(request);
    const suggestions: Array<{ tool: string; confidence: number; description: string }> = [];

    // Add primary suggestion
    if (decision.toolName) {
      const mapping = this.toolMappings.find(m => m.tool === decision.toolName);
      suggestions.push({
        tool: decision.toolName,
        confidence: decision.confidence,
        description: mapping?.description || '',
      });
    }

    // Add alternatives
    if (decision.alternativeTools) {
      for (const alt of decision.alternativeTools.slice(0, limit - 1)) {
        const mapping = this.toolMappings.find(m => m.tool === alt.toolName);
        suggestions.push({
          tool: alt.toolName,
          confidence: alt.confidence,
          description: mapping?.description || '',
        });
      }
    }

    return suggestions.slice(0, limit);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<RoutingConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('AutoRouter configuration updated', config);
  }

  /**
   * Add custom tool mapping
   */
  addToolMapping(mapping: ToolMapping): void {
    this.toolMappings.push(mapping);
    logger.info('Custom tool mapping added', { tool: mapping.tool });
  }

  /**
   * Get all tool mappings
   */
  getToolMappings(): ToolMapping[] {
    return [...this.toolMappings];
  }

  /**
   * Explain routing decision
   */
  explainDecision(request: string): string {
    const decision = this.route(request);
    
    if (!decision.toolName) {
      return 'No suitable tool found for this request.';
    }

    const mapping = this.toolMappings.find(m => m.tool === decision.toolName);
    let explanation = `Recommended tool: ${decision.toolName}\n`;
    explanation += `Confidence: ${(decision.confidence * 100).toFixed(1)}%\n`;
    explanation += `Description: ${mapping?.description || 'N/A'}\n`;
    explanation += `Reasoning: ${decision.reasoning}\n`;

    if (decision.alternativeTools && decision.alternativeTools.length > 0) {
      explanation += '\nAlternative tools:\n';
      for (const alt of decision.alternativeTools) {
        const altMapping = this.toolMappings.find(m => m.tool === alt.toolName);
        explanation += `  - ${alt.toolName} (${(alt.confidence * 100).toFixed(1)}%): ${altMapping?.description || 'N/A'}\n`;
      }
    }

    if (decision.confidence < this.config.confidenceThreshold) {
      explanation += `\nNote: Confidence is below threshold (${this.config.confidenceThreshold}). Manual tool selection recommended.`;
    }

    return explanation;
  }
}

// Singleton instance
let autoRouterInstance: AutoRouter | null = null;

export function getAutoRouter(config?: RoutingConfig): AutoRouter {
  if (!autoRouterInstance && config) {
    autoRouterInstance = new AutoRouter(config);
  } else if (!autoRouterInstance) {
    throw new Error('AutoRouter not initialized. Provide config on first call.');
  }
  return autoRouterInstance;
}

// Made with Bob
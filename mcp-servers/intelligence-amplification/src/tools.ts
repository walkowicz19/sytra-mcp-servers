import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "optimize_prompt",
    description: "Optimize a prompt for better results using advanced prompt engineering techniques. Analyzes and enhances prompts for clarity, specificity, and effectiveness.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The prompt to optimize"
        },
        task_type: {
          type: "string",
          enum: ["generation", "analysis", "reasoning", "creative", "technical"],
          description: "Type of task the prompt is for",
          default: "generation"
        },
        optimization_goals: {
          type: "array",
          items: {
            type: "string",
            enum: ["clarity", "specificity", "context", "structure", "examples"]
          },
          description: "Specific optimization goals"
        },
        target_model: {
          type: "string",
          description: "Target model for optimization (e.g., 'gpt-4', 'claude-3')"
        }
      },
      required: ["prompt"]
    }
  },
  {
    name: "rag_query",
    description: "Query using Retrieval-Augmented Generation (RAG) pipeline. Retrieves relevant context from knowledge base and generates informed responses.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The query to process"
        },
        knowledge_base: {
          type: "string",
          description: "Knowledge base identifier to query against"
        },
        top_k: {
          type: "integer",
          description: "Number of top documents to retrieve",
          default: 5,
          minimum: 1,
          maximum: 20
        },
        min_relevance: {
          type: "number",
          description: "Minimum relevance score for retrieved documents",
          default: 0.7,
          minimum: 0,
          maximum: 1
        },
        include_sources: {
          type: "boolean",
          description: "Include source references in response",
          default: true
        }
      },
      required: ["query"]
    }
  },
  {
    name: "chain_of_thought",
    description: "Apply chain-of-thought reasoning to break down complex problems into logical steps. Enhances reasoning quality and transparency.",
    inputSchema: {
      type: "object",
      properties: {
        problem: {
          type: "string",
          description: "The problem to reason about"
        },
        reasoning_style: {
          type: "string",
          enum: ["step_by_step", "tree_of_thought", "self_consistency"],
          description: "Style of reasoning to apply",
          default: "step_by_step"
        },
        max_steps: {
          type: "integer",
          description: "Maximum reasoning steps",
          default: 10,
          minimum: 1,
          maximum: 50
        },
        verify_steps: {
          type: "boolean",
          description: "Verify each reasoning step",
          default: true
        }
      },
      required: ["problem"]
    }
  },
  {
    name: "self_reflect",
    description: "Perform self-reflection on a response to identify improvements, errors, or alternative approaches. Enhances response quality through iterative refinement.",
    inputSchema: {
      type: "object",
      properties: {
        response: {
          type: "string",
          description: "The response to reflect on"
        },
        original_query: {
          type: "string",
          description: "The original query that generated the response"
        },
        reflection_aspects: {
          type: "array",
          items: {
            type: "string",
            enum: ["accuracy", "completeness", "clarity", "relevance", "bias"]
          },
          description: "Aspects to focus reflection on"
        },
        suggest_improvements: {
          type: "boolean",
          description: "Generate improvement suggestions",
          default: true
        }
      },
      required: ["response"]
    }
  },
  {
    name: "decompose_task",
    description: "Break down a complex task into smaller, manageable subtasks. Creates a structured execution plan with dependencies.",
    inputSchema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "The complex task to decompose"
        },
        decomposition_strategy: {
          type: "string",
          enum: ["sequential", "parallel", "hierarchical", "dependency_based"],
          description: "Strategy for task decomposition",
          default: "hierarchical"
        },
        max_depth: {
          type: "integer",
          description: "Maximum decomposition depth",
          default: 3,
          minimum: 1,
          maximum: 5
        },
        include_dependencies: {
          type: "boolean",
          description: "Identify task dependencies",
          default: true
        },
        estimate_complexity: {
          type: "boolean",
          description: "Estimate complexity for each subtask",
          default: true
        }
      },
      required: ["task"]
    }
  },
  {
    name: "route_to_model",
    description: "Route a query to the most appropriate model based on task characteristics, complexity, and requirements. Optimizes for cost and performance.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The query to route"
        },
        task_type: {
          type: "string",
          enum: ["simple", "complex", "creative", "analytical", "code"],
          description: "Type of task"
        },
        constraints: {
          type: "object",
          description: "Routing constraints",
          properties: {
            max_cost: {
              type: "number",
              description: "Maximum acceptable cost"
            },
            max_latency: {
              type: "number",
              description: "Maximum acceptable latency in seconds"
            },
            required_capabilities: {
              type: "array",
              items: { type: "string" },
              description: "Required model capabilities"
            }
          }
        },
        available_models: {
          type: "array",
          items: { type: "string" },
          description: "List of available models to choose from"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "index_repository",
    description: "Index a large repository for semantic search and code intelligence. Supports 50GB+ repositories with incremental indexing for changed files only.",
    inputSchema: {
      type: "object",
      properties: {
        repo_url: {
          type: "string",
          description: "Git repository URL (https or ssh)"
        },
        branch: {
          type: "string",
          description: "Branch to index",
          default: "main"
        },
        incremental: {
          type: "boolean",
          description: "Use incremental indexing (only re-index changed files)",
          default: true
        },
        options: {
          type: "object",
          description: "Indexing options",
          properties: {
            languages: {
              type: "array",
              items: { type: "string" },
              description: "Languages to index (e.g., ['python', 'javascript'])"
            },
            exclude_patterns: {
              type: "array",
              items: { type: "string" },
              description: "Glob patterns to exclude (e.g., ['*.test.js', 'node_modules/**'])"
            },
            max_file_size_mb: {
              type: "number",
              description: "Maximum file size to index in MB",
              default: 10
            }
          }
        }
      },
      required: ["repo_url"]
    }
  },
  {
    name: "semantic_code_search",
    description: "Search code using natural language queries. Uses hybrid search combining vector similarity, keyword matching, and code graph relationships for accurate results.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Natural language search query (e.g., 'authentication middleware that validates JWT tokens')"
        },
        repo_id: {
          type: "string",
          description: "Repository identifier from index_repository"
        },
        filters: {
          type: "object",
          description: "Search filters",
          properties: {
            language: {
              type: "string",
              description: "Filter by programming language"
            },
            path_pattern: {
              type: "string",
              description: "Filter by file path pattern (glob)"
            },
            min_score: {
              type: "number",
              description: "Minimum relevance score (0-1)",
              default: 0.7
            }
          }
        },
        limit: {
          type: "number",
          description: "Maximum number of results",
          default: 20,
          minimum: 1,
          maximum: 100
        },
        include_context: {
          type: "boolean",
          description: "Include surrounding code context",
          default: true
        }
      },
      required: ["query", "repo_id"]
    }
  },
  {
    name: "analyze_dependencies",
    description: "Analyze file dependencies and calculate impact radius. Shows what files depend on a given file and what it depends on, useful for understanding change impact.",
    inputSchema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "File path to analyze (relative to repository root)"
        },
        repo_id: {
          type: "string",
          description: "Repository identifier"
        },
        depth: {
          type: "number",
          description: "Dependency traversal depth",
          default: 3,
          minimum: 1,
          maximum: 10
        },
        direction: {
          type: "string",
          enum: ["incoming", "outgoing", "both"],
          description: "Dependency direction to analyze",
          default: "both"
        },
        include_transitive: {
          type: "boolean",
          description: "Include transitive dependencies",
          default: true
        }
      },
      required: ["file_path", "repo_id"]
    }
  },
  {
    name: "get_index_status",
    description: "Get the current status of a repository indexing job. Shows progress, estimated time remaining, and any errors.",
    inputSchema: {
      type: "object",
      properties: {
        repo_id: {
          type: "string",
          description: "Repository identifier"
        },
        job_id: {
          type: "string",
          description: "Optional job ID for specific indexing job"
        }
      },
      required: ["repo_id"]
    }
  },
  {
    name: "find_symbol_references",
    description: "Find all references to a code symbol (function, class, variable) across the repository. Useful for refactoring and understanding code usage.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Symbol name to find references for"
        },
        repo_id: {
          type: "string",
          description: "Repository identifier"
        },
        symbol_type: {
          type: "string",
          enum: ["function", "class", "variable", "method", "any"],
          description: "Type of symbol",
          default: "any"
        },
        include_definitions: {
          type: "boolean",
          description: "Include symbol definitions in results",
          default: true
        }
      },
      required: ["symbol", "repo_id"]
    }
  },
  {
    name: "analyze_code_complexity",
    description: "Analyze code complexity metrics for files or directories. Provides cyclomatic complexity, maintainability index, and code quality scores.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "File or directory path to analyze"
        },
        repo_id: {
          type: "string",
          description: "Repository identifier"
        },
        metrics: {
          type: "array",
          items: {
            type: "string",
            enum: ["cyclomatic", "cognitive", "maintainability", "halstead", "loc"]
          },
          description: "Metrics to calculate",
          default: ["cyclomatic", "maintainability"]
        },
        recursive: {
          type: "boolean",
          description: "Analyze directory recursively",
          default: true
        }
      },
      required: ["path", "repo_id"]
    }
  }
];

// Made with Bob

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
  }
];

// Made with Bob

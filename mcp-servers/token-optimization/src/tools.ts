import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "count_tokens",
    description: "Count tokens in text for different models. Provides accurate token counts to help manage context windows and costs.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to count tokens for"
        },
        model: {
          type: "string",
          description: "Model to use for tokenization (e.g., 'gpt-4', 'claude-3', 'gpt-3.5-turbo')",
          default: "gpt-4"
        },
        include_special_tokens: {
          type: "boolean",
          description: "Include special tokens in count",
          default: false
        }
      },
      required: ["text"]
    }
  },
  {
    name: "optimize_context",
    description: "Optimize context window usage by intelligently selecting and arranging content. Maximizes relevant information while staying within token limits.",
    inputSchema: {
      type: "object",
      properties: {
        context_items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              content: { type: "string" },
              priority: { type: "number" },
              metadata: { type: "object" }
            },
            required: ["content"]
          },
          description: "Array of context items to optimize"
        },
        max_tokens: {
          type: "integer",
          description: "Maximum tokens allowed in optimized context",
          default: 4096
        },
        model: {
          type: "string",
          description: "Target model for optimization",
          default: "gpt-4"
        },
        strategy: {
          type: "string",
          enum: ["priority", "recency", "relevance", "balanced"],
          description: "Optimization strategy to use",
          default: "balanced"
        },
        preserve_order: {
          type: "boolean",
          description: "Preserve original order of items",
          default: false
        }
      },
      required: ["context_items"]
    }
  },
  {
    name: "compress_text",
    description: "Compress text semantically while preserving meaning. Reduces token count without losing important information.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to compress"
        },
        compression_ratio: {
          type: "number",
          description: "Target compression ratio (0-1, where 0.5 means 50% of original)",
          default: 0.5,
          minimum: 0.1,
          maximum: 0.9
        },
        preserve_structure: {
          type: "boolean",
          description: "Preserve document structure (headings, lists, etc.)",
          default: true
        },
        preserve_entities: {
          type: "boolean",
          description: "Preserve named entities",
          default: true
        },
        preserve_numbers: {
          type: "boolean",
          description: "Preserve numerical data",
          default: true
        },
        method: {
          type: "string",
          enum: ["extractive", "abstractive", "hybrid"],
          description: "Compression method",
          default: "hybrid"
        }
      },
      required: ["text"]
    }
  },
  {
    name: "summarize_content",
    description: "Summarize long content into a concise form. Ideal for reducing token usage while maintaining key information.",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The content to summarize"
        },
        max_length: {
          type: "integer",
          description: "Maximum length of summary in tokens",
          default: 500
        },
        summary_type: {
          type: "string",
          enum: ["brief", "detailed", "bullet_points", "key_points"],
          description: "Type of summary to generate",
          default: "detailed"
        },
        focus_areas: {
          type: "array",
          items: { type: "string" },
          description: "Specific areas to focus on in the summary"
        },
        include_citations: {
          type: "boolean",
          description: "Include references to original content",
          default: false
        }
      },
      required: ["content"]
    }
  },
  {
    name: "prune_context",
    description: "Remove irrelevant or redundant context to reduce token usage. Uses intelligent filtering to keep only essential information.",
    inputSchema: {
      type: "object",
      properties: {
        context: {
          type: "string",
          description: "The context to prune"
        },
        query: {
          type: "string",
          description: "Query or task to optimize context for"
        },
        target_tokens: {
          type: "integer",
          description: "Target token count after pruning"
        },
        relevance_threshold: {
          type: "number",
          description: "Minimum relevance score to keep content (0-1)",
          default: 0.5,
          minimum: 0,
          maximum: 1
        },
        remove_duplicates: {
          type: "boolean",
          description: "Remove duplicate or highly similar content",
          default: true
        },
        preserve_structure: {
          type: "boolean",
          description: "Maintain document structure",
          default: true
        }
      },
      required: ["context"]
    }
  }
];

// Made with Bob

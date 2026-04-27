import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "store_memory",
    description: "Store information in memory for later retrieval. Supports different memory types (short-term, long-term, episodic) and automatic embedding generation for semantic search.",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The content to store in memory"
        },
        memory_type: {
          type: "string",
          enum: ["short_term", "long_term", "episodic"],
          description: "Type of memory to store",
          default: "short_term"
        },
        metadata: {
          type: "object",
          description: "Additional metadata to associate with the memory",
          properties: {
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Tags for categorization"
            },
            importance: {
              type: "number",
              description: "Importance score (0-1)",
              minimum: 0,
              maximum: 1
            },
            context: {
              type: "string",
              description: "Contextual information"
            }
          }
        },
        session_id: {
          type: "string",
          description: "Session identifier for grouping related memories"
        }
      },
      required: ["content"]
    }
  },
  {
    name: "retrieve_memory",
    description: "Retrieve relevant memories based on a query. Uses semantic search to find the most relevant stored information.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The query to search for in memory"
        },
        memory_type: {
          type: "string",
          enum: ["short_term", "long_term", "episodic", "all"],
          description: "Type of memory to search",
          default: "all"
        },
        limit: {
          type: "integer",
          description: "Maximum number of memories to retrieve",
          default: 5,
          minimum: 1,
          maximum: 50
        },
        min_relevance: {
          type: "number",
          description: "Minimum relevance score (0-1)",
          default: 0.5,
          minimum: 0,
          maximum: 1
        },
        session_id: {
          type: "string",
          description: "Filter by session identifier"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "search_memory",
    description: "Perform semantic search across all stored memories. Returns memories ranked by relevance with similarity scores.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query"
        },
        filters: {
          type: "object",
          description: "Filters to apply to the search",
          properties: {
            memory_type: {
              type: "array",
              items: {
                type: "string",
                enum: ["short_term", "long_term", "episodic"]
              },
              description: "Filter by memory types"
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Filter by tags"
            },
            date_range: {
              type: "object",
              properties: {
                start: { type: "string", format: "date-time" },
                end: { type: "string", format: "date-time" }
              },
              description: "Filter by date range"
            },
            min_importance: {
              type: "number",
              description: "Minimum importance score",
              minimum: 0,
              maximum: 1
            }
          }
        },
        limit: {
          type: "integer",
          description: "Maximum number of results",
          default: 10,
          minimum: 1,
          maximum: 100
        }
      },
      required: ["query"]
    }
  },
  {
    name: "compress_context",
    description: "Compress context for efficiency while preserving key information. Uses intelligent summarization to reduce token count.",
    inputSchema: {
      type: "object",
      properties: {
        context: {
          type: "string",
          description: "The context to compress"
        },
        target_ratio: {
          type: "number",
          description: "Target compression ratio (0-1, where 0.5 means 50% of original size)",
          default: 0.5,
          minimum: 0.1,
          maximum: 0.9
        },
        preserve_entities: {
          type: "boolean",
          description: "Whether to preserve named entities",
          default: true
        },
        preserve_numbers: {
          type: "boolean",
          description: "Whether to preserve numerical data",
          default: true
        },
        strategy: {
          type: "string",
          enum: ["extractive", "abstractive", "hybrid"],
          description: "Compression strategy to use",
          default: "hybrid"
        }
      },
      required: ["context"]
    }
  },
  {
    name: "get_session_history",
    description: "Get the history of a session including all stored memories and interactions.",
    inputSchema: {
      type: "object",
      properties: {
        session_id: {
          type: "string",
          description: "The session identifier"
        },
        include_metadata: {
          type: "boolean",
          description: "Whether to include metadata in the response",
          default: true
        },
        limit: {
          type: "integer",
          description: "Maximum number of history items to retrieve",
          default: 50,
          minimum: 1,
          maximum: 500
        },
        order: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort order by timestamp",
          default: "desc"
        }
      },
      required: ["session_id"]
    }
  }
];

// Made with Bob

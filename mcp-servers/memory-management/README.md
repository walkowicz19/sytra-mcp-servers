# Stark Memory Management MCP Server

MCP server for the Stark Memory Management service, providing intelligent memory storage, retrieval, and context management capabilities.

## Features

- **Memory Storage**: Store information with different memory types (short-term, long-term, episodic)
- **Semantic Retrieval**: Retrieve relevant memories using semantic search
- **Context Compression**: Compress context while preserving key information
- **Session Management**: Track and retrieve session history
- **Advanced Search**: Filter and search memories with multiple criteria

## Installation

```bash
cd mcp-servers/memory-management
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `MEMORY_API_URL`: URL of the Memory Management service (default: `http://localhost:8003`)

## Available Tools

### store_memory

Store information in memory for later retrieval.

**Parameters:**
- `content` (required): The content to store in memory
- `memory_type` (optional): Type of memory - "short_term", "long_term", or "episodic" (default: "short_term")
- `metadata` (optional): Additional metadata
  - `tags`: Array of tags for categorization
  - `importance`: Importance score (0-1)
  - `context`: Contextual information
- `session_id` (optional): Session identifier for grouping

**Example:**
```json
{
  "content": "User prefers dark mode and compact layouts",
  "memory_type": "long_term",
  "metadata": {
    "tags": ["preferences", "ui"],
    "importance": 0.8
  },
  "session_id": "session-123"
}
```

### retrieve_memory

Retrieve relevant memories based on a query.

**Parameters:**
- `query` (required): The query to search for
- `memory_type` (optional): Type of memory to search - "short_term", "long_term", "episodic", or "all" (default: "all")
- `limit` (optional): Maximum number of memories (default: 5, max: 50)
- `min_relevance` (optional): Minimum relevance score 0-1 (default: 0.5)
- `session_id` (optional): Filter by session

**Example:**
```json
{
  "query": "user interface preferences",
  "memory_type": "long_term",
  "limit": 10,
  "min_relevance": 0.7
}
```

### search_memory

Perform semantic search across all stored memories.

**Parameters:**
- `query` (required): The search query
- `filters` (optional): Search filters
  - `memory_type`: Array of memory types to include
  - `tags`: Array of tags to filter by
  - `date_range`: Object with `start` and `end` dates
  - `min_importance`: Minimum importance score
- `limit` (optional): Maximum results (default: 10, max: 100)

**Example:**
```json
{
  "query": "authentication implementation",
  "filters": {
    "memory_type": ["long_term"],
    "tags": ["security", "backend"],
    "min_importance": 0.6
  },
  "limit": 20
}
```

### compress_context

Compress context for efficiency while preserving key information.

**Parameters:**
- `context` (required): The context to compress
- `target_ratio` (optional): Target compression ratio 0-1 (default: 0.5)
- `preserve_entities` (optional): Preserve named entities (default: true)
- `preserve_numbers` (optional): Preserve numerical data (default: true)
- `strategy` (optional): Compression strategy - "extractive", "abstractive", or "hybrid" (default: "hybrid")

**Example:**
```json
{
  "context": "Long context text here...",
  "target_ratio": 0.3,
  "preserve_entities": true,
  "strategy": "hybrid"
}
```

### get_session_history

Get the history of a session including all stored memories.

**Parameters:**
- `session_id` (required): The session identifier
- `include_metadata` (optional): Include metadata (default: true)
- `limit` (optional): Maximum history items (default: 50, max: 500)
- `order` (optional): Sort order - "asc" or "desc" (default: "desc")

**Example:**
```json
{
  "session_id": "session-123",
  "include_metadata": true,
  "limit": 100,
  "order": "desc"
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "stark-memory": {
      "command": "node",
      "args": ["/path/to/mcp-servers/memory-management/dist/index.js"],
      "env": {
        "MEMORY_API_URL": "http://localhost:8003"
      }
    }
  }
}
```

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Start
npm start
```

## API Endpoints

The server communicates with these Memory Management API endpoints:

- `POST /api/v1/memory/store` - Store memory
- `POST /api/v1/memory/retrieve` - Retrieve memories
- `POST /api/v1/memory/search` - Search memories
- `POST /api/v1/memory/compress` - Compress context
- `POST /api/v1/memory/session/history` - Get session history

## License

MIT
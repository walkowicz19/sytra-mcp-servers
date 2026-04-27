# Stark Token Optimization MCP Server

MCP server for the Stark Token Optimization service, providing intelligent token counting, context optimization, text compression, and summarization capabilities.

## Features

- **Token Counting**: Accurate token counts for different models
- **Context Optimization**: Maximize relevant information within token limits
- **Text Compression**: Semantic compression while preserving meaning
- **Content Summarization**: Generate concise summaries
- **Context Pruning**: Remove irrelevant content intelligently

## Installation

```bash
cd mcp-servers/token-optimization
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `TOKEN_API_URL`: URL of the Token Optimization service (default: `http://localhost:8005`)

## Available Tools

### count_tokens

Count tokens in text for different models.

**Parameters:**
- `text` (required): The text to count tokens for
- `model` (optional): Model for tokenization - "gpt-4", "claude-3", "gpt-3.5-turbo" (default: "gpt-4")
- `include_special_tokens` (optional): Include special tokens (default: false)

**Example:**
```json
{
  "text": "This is a sample text to count tokens for.",
  "model": "gpt-4",
  "include_special_tokens": false
}
```

### optimize_context

Optimize context window usage by intelligently selecting and arranging content.

**Parameters:**
- `context_items` (required): Array of context items with content, priority, and metadata
- `max_tokens` (optional): Maximum tokens allowed (default: 4096)
- `model` (optional): Target model (default: "gpt-4")
- `strategy` (optional): Strategy - "priority", "recency", "relevance", or "balanced" (default: "balanced")
- `preserve_order` (optional): Preserve original order (default: false)

**Example:**
```json
{
  "context_items": [
    {
      "content": "Important context about authentication",
      "priority": 0.9,
      "metadata": {"type": "security"}
    },
    {
      "content": "Additional background information",
      "priority": 0.5
    }
  ],
  "max_tokens": 2000,
  "strategy": "priority"
}
```

### compress_text

Compress text semantically while preserving meaning.

**Parameters:**
- `text` (required): The text to compress
- `compression_ratio` (optional): Target ratio 0-1 (default: 0.5)
- `preserve_structure` (optional): Preserve document structure (default: true)
- `preserve_entities` (optional): Preserve named entities (default: true)
- `preserve_numbers` (optional): Preserve numerical data (default: true)
- `method` (optional): Method - "extractive", "abstractive", or "hybrid" (default: "hybrid")

**Example:**
```json
{
  "text": "Long text content here...",
  "compression_ratio": 0.3,
  "preserve_structure": true,
  "preserve_entities": true,
  "method": "hybrid"
}
```

### summarize_content

Summarize long content into a concise form.

**Parameters:**
- `content` (required): The content to summarize
- `max_length` (optional): Maximum summary length in tokens (default: 500)
- `summary_type` (optional): Type - "brief", "detailed", "bullet_points", or "key_points" (default: "detailed")
- `focus_areas` (optional): Array of specific areas to focus on
- `include_citations` (optional): Include references (default: false)

**Example:**
```json
{
  "content": "Long article or document content...",
  "max_length": 300,
  "summary_type": "bullet_points",
  "focus_areas": ["main findings", "conclusions"],
  "include_citations": true
}
```

### prune_context

Remove irrelevant or redundant context to reduce token usage.

**Parameters:**
- `context` (required): The context to prune
- `query` (optional): Query or task to optimize for
- `target_tokens` (optional): Target token count after pruning
- `relevance_threshold` (optional): Minimum relevance score 0-1 (default: 0.5)
- `remove_duplicates` (optional): Remove duplicates (default: true)
- `preserve_structure` (optional): Maintain structure (default: true)

**Example:**
```json
{
  "context": "Large context with mixed relevant and irrelevant content...",
  "query": "How does authentication work?",
  "target_tokens": 1000,
  "relevance_threshold": 0.6,
  "remove_duplicates": true
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "stark-token": {
      "command": "node",
      "args": ["/path/to/mcp-servers/token-optimization/dist/index.js"],
      "env": {
        "TOKEN_API_URL": "http://localhost:8005"
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

The server communicates with these Token Optimization API endpoints:

- `POST /api/v1/token/count` - Count tokens
- `POST /api/v1/token/optimize-context` - Optimize context
- `POST /api/v1/token/compress` - Compress text
- `POST /api/v1/token/summarize` - Summarize content
- `POST /api/v1/token/prune` - Prune context

## License

MIT
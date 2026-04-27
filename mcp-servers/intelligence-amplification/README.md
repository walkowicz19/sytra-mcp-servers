# Stark Intelligence Amplification MCP Server

MCP server for the Stark Intelligence Amplification service, providing advanced AI capabilities including prompt optimization, RAG, chain-of-thought reasoning, and intelligent model routing.

## Features

- **Prompt Optimization**: Enhance prompts for better results
- **RAG Pipeline**: Retrieval-Augmented Generation for informed responses
- **Chain-of-Thought**: Advanced reasoning with step-by-step logic
- **Self-Reflection**: Quality improvement through iterative refinement
- **Task Decomposition**: Break complex tasks into manageable subtasks
- **Model Routing**: Intelligent routing to optimal models

## Installation

```bash
cd mcp-servers/intelligence-amplification
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `INTELLIGENCE_API_URL`: URL of the Intelligence Amplification service (default: `http://localhost:8004`)

## Available Tools

### optimize_prompt

Optimize a prompt for better results using advanced prompt engineering techniques.

**Parameters:**
- `prompt` (required): The prompt to optimize
- `task_type` (optional): Type of task - "generation", "analysis", "reasoning", "creative", or "technical" (default: "generation")
- `optimization_goals` (optional): Array of goals - "clarity", "specificity", "context", "structure", "examples"
- `target_model` (optional): Target model for optimization (e.g., "gpt-4", "claude-3")

**Example:**
```json
{
  "prompt": "Write a function to sort numbers",
  "task_type": "technical",
  "optimization_goals": ["clarity", "specificity", "examples"],
  "target_model": "gpt-4"
}
```

### rag_query

Query using Retrieval-Augmented Generation (RAG) pipeline.

**Parameters:**
- `query` (required): The query to process
- `knowledge_base` (optional): Knowledge base identifier
- `top_k` (optional): Number of documents to retrieve (default: 5, max: 20)
- `min_relevance` (optional): Minimum relevance score 0-1 (default: 0.7)
- `include_sources` (optional): Include source references (default: true)

**Example:**
```json
{
  "query": "How does authentication work in the system?",
  "knowledge_base": "technical-docs",
  "top_k": 10,
  "min_relevance": 0.8,
  "include_sources": true
}
```

### chain_of_thought

Apply chain-of-thought reasoning to break down complex problems.

**Parameters:**
- `problem` (required): The problem to reason about
- `reasoning_style` (optional): Style - "step_by_step", "tree_of_thought", or "self_consistency" (default: "step_by_step")
- `max_steps` (optional): Maximum reasoning steps (default: 10, max: 50)
- `verify_steps` (optional): Verify each step (default: true)

**Example:**
```json
{
  "problem": "Design a scalable microservices architecture for an e-commerce platform",
  "reasoning_style": "tree_of_thought",
  "max_steps": 15,
  "verify_steps": true
}
```

### self_reflect

Perform self-reflection on a response to identify improvements.

**Parameters:**
- `response` (required): The response to reflect on
- `original_query` (optional): The original query
- `reflection_aspects` (optional): Array of aspects - "accuracy", "completeness", "clarity", "relevance", "bias"
- `suggest_improvements` (optional): Generate suggestions (default: true)

**Example:**
```json
{
  "response": "The system uses JWT tokens for authentication...",
  "original_query": "Explain the authentication mechanism",
  "reflection_aspects": ["accuracy", "completeness", "clarity"],
  "suggest_improvements": true
}
```

### decompose_task

Break down a complex task into smaller, manageable subtasks.

**Parameters:**
- `task` (required): The complex task to decompose
- `decomposition_strategy` (optional): Strategy - "sequential", "parallel", "hierarchical", or "dependency_based" (default: "hierarchical")
- `max_depth` (optional): Maximum decomposition depth (default: 3, max: 5)
- `include_dependencies` (optional): Identify dependencies (default: true)
- `estimate_complexity` (optional): Estimate complexity (default: true)

**Example:**
```json
{
  "task": "Implement a complete user authentication system with OAuth2",
  "decomposition_strategy": "dependency_based",
  "max_depth": 4,
  "include_dependencies": true,
  "estimate_complexity": true
}
```

### route_to_model

Route a query to the most appropriate model based on task characteristics.

**Parameters:**
- `query` (required): The query to route
- `task_type` (optional): Type - "simple", "complex", "creative", "analytical", or "code"
- `constraints` (optional): Routing constraints
  - `max_cost`: Maximum acceptable cost
  - `max_latency`: Maximum latency in seconds
  - `required_capabilities`: Array of required capabilities
- `available_models` (optional): Array of available models

**Example:**
```json
{
  "query": "Generate a complex SQL query with multiple joins",
  "task_type": "code",
  "constraints": {
    "max_cost": 0.05,
    "max_latency": 5,
    "required_capabilities": ["code_generation", "sql"]
  },
  "available_models": ["gpt-4", "claude-3", "codex"]
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "stark-intelligence": {
      "command": "node",
      "args": ["/path/to/mcp-servers/intelligence-amplification/dist/index.js"],
      "env": {
        "INTELLIGENCE_API_URL": "http://localhost:8004"
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

The server communicates with these Intelligence Amplification API endpoints:

- `POST /api/v1/intelligence/optimize-prompt` - Optimize prompt
- `POST /api/v1/intelligence/rag-query` - RAG query
- `POST /api/v1/intelligence/chain-of-thought` - Chain-of-thought reasoning
- `POST /api/v1/intelligence/self-reflect` - Self-reflection
- `POST /api/v1/intelligence/decompose-task` - Task decomposition
- `POST /api/v1/intelligence/route-to-model` - Model routing

## License

MIT
# Stark MCP Servers

Model Context Protocol (MCP) servers for the Stark AI system. These servers expose Stark's capabilities as tools that can be used in AI assistants like Claude Desktop.

## Available Servers

- **security-guardrails** - Data classification, access control, encryption, and audit logging
- **code-generation** - Code generation, validation, and sandbox execution
- **memory-management** - Context storage, retrieval, and compression
- **intelligence-amplification** - Prompt optimization, RAG, reasoning, and task decomposition
- **token-optimization** - Token counting, context optimization, and text compression
- **sdlc-integration** - Requirements analysis, code review, and documentation generation
- **legacy-support** - Legacy code parsing, translation, and migration planning
- **performance-optimizer** - CPU/memory profiling, caching, and benchmarking

## Installation

Each server can be installed independently:

```bash
cd mcp-servers/[server-name]
npm install
npm run build
```

## Configuration

Configure servers in Claude Desktop's config file. See individual server READMEs for details.

## Requirements

- Node.js 18+
- TypeScript 5.3+
- Running Stark FastAPI services
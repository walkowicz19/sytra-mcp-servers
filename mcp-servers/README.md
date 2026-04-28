# Stark MCP Servers

Model Context Protocol (MCP) servers for the Stark AI system. These servers expose Stark's capabilities as tools that can be used in AI assistants like Claude Desktop.

## Overview

The Stark MCP ecosystem provides **100 specialized tools** across **10 integrated servers**, enabling comprehensive AI-powered software development, analysis, and modernization capabilities.

## Available Servers

1. **orchestrator** - Intelligent routing, workflow orchestration, and multi-server coordination (15 tools)
2. **intelligence-amplification** - Prompt optimization, RAG, reasoning, task decomposition, and code intelligence (12 tools)
3. **schema-intelligence** - Database schema analysis, optimization, and migration planning (10 tools)
4. **security-guardrails** - Data classification, access control, encryption, and audit logging (10 tools)
5. **code-generation** - Code generation, validation, sandbox execution, and quality analysis (10 tools)
6. **memory-management** - Context storage, retrieval, compression, and session management (10 tools)
7. **token-optimization** - Token counting, context optimization, and text compression (10 tools)
8. **sdlc-integration** - Requirements analysis, code review, and documentation generation (10 tools)
9. **legacy-support** - Legacy code parsing, translation, migration planning, and modernization (10 tools)
10. **performance-optimizer** - CPU/memory profiling, caching, benchmarking, and optimization (10 tools)

## Key Capabilities

- **Code Intelligence**: Advanced code analysis, pattern detection, and refactoring suggestions
- **Schema Intelligence**: Database schema analysis, optimization, and migration planning
- **Legacy Modernization**: Comprehensive support for COBOL, Fortran, and other legacy languages
- **Workflow Orchestration**: Pre-built workflows for common development scenarios
- **Security & Compliance**: Built-in security scanning and compliance checking
- **Performance Optimization**: Profiling, benchmarking, and optimization recommendations

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
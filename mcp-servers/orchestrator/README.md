# Stark Orchestrator MCP Server

The Stark Orchestrator is a powerful Model Context Protocol (MCP) server that provides intelligent routing and workflow orchestration capabilities for the Stark AI development platform. It unifies 8 specialized services into a cohesive system with 12 high-level tools and pre-defined workflows.

## Overview

The Orchestrator acts as the central coordination layer for the Stark platform, providing:

- **Intelligent Routing**: Automatically routes requests to appropriate services based on content analysis
- **Workflow Orchestration**: Executes complex multi-step workflows with dependency resolution
- **Unified Interface**: 12 high-level tools that abstract 44+ specialized service tools
- **Pre-defined Workflows**: Ready-to-use workflows for common development tasks
- **Error Handling**: Robust retry mechanisms and error recovery
- **Parallel Execution**: Optimizes workflow execution with parallel step processing

## Architecture

### Services Integrated

The Orchestrator coordinates the following 8 specialized services:

1. **Security Guardrails** (port 8001) - Data classification, access control, encryption
2. **Code Generation** (port 8002) - Code generation, validation, refactoring
3. **Memory Management** (port 8003) - Context storage, retrieval, compression
4. **Intelligence Amplification** (port 8004) - Prompt optimization, task decomposition, RAG
5. **Token Optimization** (port 8005) - Token counting, context optimization, pruning
6. **SDLC Integration** (port 8006) - Requirements analysis, code review, testing
7. **Legacy Support** (port 8007) - Legacy code parsing, translation, modernization
8. **Performance Optimizer** (port 8009) - Profiling, optimization, benchmarking

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- All 8 Stark services running (or accessible via network)

### Setup

```bash
# Navigate to orchestrator directory
cd mcp-servers/orchestrator

# Install dependencies
npm install

# Build the project
npm run build

# The server is now ready to use
```

## Configuration

### Environment Variables

Create a `.env` file or set the following environment variables:

```bash
# Service URLs
STARK_SECURITY_URL=http://localhost:8001
STARK_CODEGEN_URL=http://localhost:8002
STARK_MEMORY_URL=http://localhost:8003
STARK_INTELLIGENCE_URL=http://localhost:8004
STARK_TOKENS_URL=http://localhost:8005
STARK_SDLC_URL=http://localhost:8006
STARK_LEGACY_URL=http://localhost:8007
STARK_PERFORMANCE_URL=http://localhost:8009

# Orchestrator Settings
STARK_WORKFLOW_TIMEOUT=300000
STARK_MAX_RETRIES=3
STARK_LOG_LEVEL=info
```

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stark": {
      "command": "node",
      "args": [
        "C:/path/to/mcp-servers/orchestrator/build/index.js"
      ],
      "env": {
        "STARK_SECURITY_URL": "http://localhost:8001",
        "STARK_CODEGEN_URL": "http://localhost:8002",
        "STARK_MEMORY_URL": "http://localhost:8003",
        "STARK_INTELLIGENCE_URL": "http://localhost:8004",
        "STARK_TOKENS_URL": "http://localhost:8005",
        "STARK_SDLC_URL": "http://localhost:8006",
        "STARK_LEGACY_URL": "http://localhost:8007",
        "STARK_PERFORMANCE_URL": "http://localhost:8009"
      }
    }
  }
}
```

## High-Level Tools

The Orchestrator provides 12 unified high-level tools:

### 1. `stark_analyze_code`

Comprehensive code analysis combining security, performance, and complexity metrics.

**Parameters:**
- `code` (string, required): Code to analyze
- `language` (string, required): Programming language
- `includeSecurityScan` (boolean): Include security scanning (default: true)
- `includePerformanceAnalysis` (boolean): Include performance profiling (default: true)
- `includeComplexityMetrics` (boolean): Include complexity metrics (default: true)

**Example:**
```json
{
  "code": "def calculate(x, y): return x + y",
  "language": "python",
  "includeSecurityScan": true
}
```

### 2. `stark_generate_secure_code`

Generate code with automatic security validation and best practices.

**Parameters:**
- `requirements` (string, required): Code requirements
- `language` (string, required): Target language
- `securityLevel` (string): Security level - standard, high, or critical
- `includeTests` (boolean): Generate unit tests (default: true)
- `includeDocumentation` (boolean): Generate documentation (default: true)

### 3. `stark_modernize_legacy`

Modernize legacy code with translation and optimization.

**Parameters:**
- `legacyCode` (string, required): Legacy code to modernize
- `sourceLanguage` (string, required): Source language (cobol, fortran, assembly, rpg)
- `targetLanguage` (string, required): Target language (python, java, javascript, typescript)
- `includeMigrationPlan` (boolean): Generate migration plan (default: true)

### 4. `stark_optimize_workflow`

Optimize development workflow with intelligent suggestions.

**Parameters:**
- `workflowDescription` (string, required): Current workflow description
- `currentMetrics` (object): Current performance metrics
- `optimizationGoals` (array): Optimization goals

### 5. `stark_full_sdlc_cycle`

Execute complete SDLC from requirements to deployment.

**Parameters:**
- `requirements` (string, required): Project requirements
- `projectType` (string): Type of project
- `includeDeployment` (boolean): Include deployment config
- `targetEnvironment` (string): Target deployment environment

### 6. `stark_intelligent_refactor`

AI-powered code refactoring with best practices.

**Parameters:**
- `code` (string, required): Code to refactor
- `language` (string, required): Programming language
- `refactoringGoals` (array): Refactoring goals
- `preserveTests` (boolean): Preserve existing tests (default: true)

### 7. `stark_security_audit`

Complete security audit with vulnerability detection.

**Parameters:**
- `code` (string, required): Code to audit
- `language` (string, required): Programming language
- `auditDepth` (string): Audit depth - basic, standard, or comprehensive
- `includeRemediation` (boolean): Include remediation suggestions (default: true)

### 8. `stark_performance_tune`

End-to-end performance optimization and tuning.

**Parameters:**
- `code` (string, required): Code to optimize
- `language` (string, required): Programming language
- `targetMetrics` (object): Target performance metrics
- `optimizationLevel` (string): Optimization level - conservative, balanced, or aggressive

### 9. `stark_memory_optimize`

Context and memory optimization for AI interactions.

**Parameters:**
- `context` (string, required): Context to optimize
- `maxTokens` (number): Maximum token count
- `preserveImportantInfo` (boolean): Preserve important information (default: true)

### 10. `stark_execute_workflow`

Execute a custom or pre-defined workflow.

**Parameters:**
- `workflowId` (string): ID of pre-defined workflow
- `workflowDefinition` (object): Custom workflow definition
- `inputs` (object, required): Workflow input parameters
- `async` (boolean): Execute asynchronously (default: false)

### 11. `stark_list_workflows`

List available pre-defined workflows.

**Parameters:**
- `category` (string): Filter by category
- `tags` (array): Filter by tags

### 12. `stark_get_workflow_status`

Get status of a running workflow.

**Parameters:**
- `workflowId` (string, required): Workflow execution ID
- `includeStepDetails` (boolean): Include detailed step information

## Pre-defined Workflows

### 1. Secure Code Generation

**ID:** `secure-code-generation`  
**Duration:** 5-10 minutes  
**Steps:** 6

Generates code with security validation, token optimization, test generation, and documentation.

**Required Inputs:**
- `requirements`: Code requirements
- `language`: Target programming language
- `framework`: Framework to use (optional)

### 2. Legacy Modernization

**ID:** `legacy-modernization`  
**Duration:** 10-20 minutes  
**Steps:** 10

Modernizes legacy code through parsing, analysis, translation, optimization, and migration planning.

**Required Inputs:**
- `legacy_code`: Legacy code to modernize
- `source_language`: Source language (cobol, fortran, etc.)
- `target_language`: Target modern language

### 3. Full SDLC Cycle

**ID:** `full-sdlc-cycle`  
**Duration:** 15-30 minutes  
**Steps:** 13

Complete software development lifecycle from requirements analysis to CI/CD setup.

**Required Inputs:**
- `requirements`: Project requirements
- `language`: Programming language
- `framework`: Framework to use

### 4. Performance Optimization

**ID:** `performance-optimization`  
**Duration:** 10-15 minutes  
**Steps:** 11

Comprehensive performance analysis and optimization including CPU, memory, I/O profiling.

**Required Inputs:**
- `code`: Code to optimize
- `language`: Programming language

## Workflow Features

### Dependency Resolution

The workflow engine automatically resolves dependencies between steps and determines optimal execution order:

```json
{
  "steps": [
    {
      "id": "step1",
      "service": "codegen",
      "tool": "generate_code"
    },
    {
      "id": "step2",
      "service": "security",
      "tool": "scan_code",
      "dependsOn": ["step1"]
    }
  ]
}
```

### Parallel Execution

Independent steps are executed in parallel for optimal performance:

```json
{
  "steps": [
    { "id": "profile-cpu", "service": "performance", "tool": "profile_cpu" },
    { "id": "profile-memory", "service": "performance", "tool": "profile_memory" },
    { "id": "analyze", "service": "codegen", "tool": "analyze", "dependsOn": ["profile-cpu", "profile-memory"] }
  ]
}
```

### Variable Interpolation

Reference outputs from previous steps using `{{variable}}` syntax:

```json
{
  "inputs": {
    "code": "{{generate-code.output}}",
    "language": "{{language}}"
  }
}
```

### Conditional Execution

Execute steps conditionally based on previous results:

```json
{
  "condition": "{{security-scan.score}} >= 80"
}
```

### Error Handling

Configure error handling strategies per workflow:

```json
{
  "errorHandling": {
    "onStepFailure": "stop",
    "notifyOnError": true
  }
}
```

### Retry Policies

Configure retry behavior for individual steps:

```json
{
  "retryPolicy": {
    "maxAttempts": 3,
    "backoffMs": 1000,
    "backoffMultiplier": 2
  }
}
```

## Creating Custom Workflows

Create a JSON file in the `workflows/` directory:

```json
{
  "id": "my-custom-workflow",
  "name": "My Custom Workflow",
  "description": "Description of what this workflow does",
  "version": "1.0.0",
  "metadata": {
    "category": "development",
    "tags": ["custom", "example"]
  },
  "steps": [
    {
      "id": "step1",
      "service": "codegen",
      "tool": "generate_code",
      "inputs": {
        "requirements": "{{requirements}}",
        "language": "{{language}}"
      },
      "outputs": ["code"],
      "retryPolicy": {
        "maxAttempts": 2,
        "backoffMs": 1000,
        "backoffMultiplier": 2
      }
    }
  ],
  "errorHandling": {
    "onStepFailure": "stop"
  },
  "timeout": 600000
}
```

## Troubleshooting

### Service Connection Errors

If you see connection errors:

1. Verify all services are running
2. Check service URLs in environment variables
3. Ensure network connectivity
4. Check service logs for errors

### Workflow Validation Errors

If workflow validation fails:

1. Check for circular dependencies
2. Verify all step IDs are unique
3. Ensure all dependencies reference existing steps
4. Validate JSON syntax

### Performance Issues

If workflows are slow:

1. Check service response times
2. Review parallel execution opportunities
3. Optimize step dependencies
4. Increase timeout values if needed

## Development

### Building

```bash
npm run build
```

### Watching for Changes

```bash
npm run watch
```

### Running Tests

```bash
npm test
```

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please visit the Stark project repository.
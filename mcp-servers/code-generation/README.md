# Stark Code Generation MCP Server

MCP server for code generation, validation, and sandbox execution.

## Tools

### generate_code
Generate code from natural language requirements.

**Parameters:**
- `requirements` (required): Description of what the code should do
- `language` (required): Programming language (python, javascript, typescript, java, go, rust)
- `context` (optional): Additional context or constraints

### validate_code
Validate code for syntax and semantic correctness.

**Parameters:**
- `code` (required): Code to validate
- `language` (required): Programming language

### run_in_sandbox
Execute code in a secure sandbox environment.

**Parameters:**
- `code` (required): Code to execute
- `language` (required): Programming language (python, javascript, typescript)
- `input_data` (optional): Input data for the code
- `timeout` (optional): Execution timeout in seconds (default: 30)

### analyze_code
Perform static code analysis.

**Parameters:**
- `code` (required): Code to analyze
- `language` (required): Programming language
- `checks` (optional): Types of checks (complexity, style, performance, maintainability)

### scan_security
Scan code for security vulnerabilities.

**Parameters:**
- `code` (required): Code to scan
- `language` (required): Programming language

## Installation

```bash
cd mcp-servers/code-generation
npm install
npm run build
```

## Configuration

```json
{
  "mcpServers": {
    "stark-codegen": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/code-generation/build/index.js"],
      "env": {
        "CODEGEN_API_URL": "http://localhost:8002"
      }
    }
  }
}
```

## Requirements

- Node.js 18+
- Running Stark Code Generation service on port 8002
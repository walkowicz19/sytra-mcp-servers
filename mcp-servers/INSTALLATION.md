# Stark MCP Servers - Installation Guide

This guide will help you install and configure all Stark MCP servers for use with Claude Desktop or other MCP clients.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Running Stark FastAPI services (ports 8001-8009)

## Quick Start

### 1. Install Dependencies

Install dependencies for the shared library first:

```bash
cd mcp-servers/shared
npm install
npm run build
```

### 2. Build All Servers

Run this script to build all MCP servers:

```bash
# Windows PowerShell
cd mcp-servers
foreach ($dir in Get-ChildItem -Directory -Exclude shared) {
    cd $dir.Name
    npm install
    npm run build
    cd ..
}

# Linux/Mac
cd mcp-servers
for dir in */; do
    if [ "$dir" != "shared/" ]; then
        cd "$dir"
        npm install
        npm run build
        cd ..
    fi
done
```

Or build each server individually:

```bash
cd mcp-servers/orchestrator && npm install && npm run build
cd ../intelligence-amplification && npm install && npm run build
cd ../schema-intelligence && npm install && npm run build
cd ../security-guardrails && npm install && npm run build
cd ../code-generation && npm install && npm run build
cd ../memory-management && npm install && npm run build
cd ../token-optimization && npm install && npm run build
cd ../sdlc-integration && npm install && npm run build
cd ../legacy-support && npm install && npm run build
cd ../performance-optimizer && npm install && npm run build
```

### 3. Start Stark Services

Ensure all Stark FastAPI services are running:

```bash
# From the project root
docker-compose -f deployment/docker-compose.yml up -d
```

Or start services individually:

```bash
# Security Guardrails (port 8001)
cd services/security-guardrails && uvicorn src.main:app --port 8001

# Code Generation (port 8002)
cd services/code-generation && uvicorn src.main:app --port 8002

# Memory Management (port 8003)
cd services/memory-management && uvicorn src.main:app --port 8003

# Intelligence Amplification (port 8004)
cd services/intelligence-amplification && uvicorn src.main:app --port 8004

# Token Optimization (port 8005)
cd services/token-optimization && uvicorn src.main:app --port 8005

# SDLC Integration (port 8006)
cd services/sdlc-integration && uvicorn src.main:app --port 8006

# Legacy Support (port 8007)
cd services/legacy-support && uvicorn src.main:app --port 8007

# Schema Intelligence (port 8008)
cd services/schema-intelligence && uvicorn src.main:app --port 8008

# Performance Optimizer (port 8009)
cd services/performance-optimizer && uvicorn src.main:app --port 8009
```

### 4. Configure Claude Desktop

#### Windows

1. Locate your Claude Desktop config file:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Copy the contents of `mcp-servers/claude_desktop_config.json` into your Claude Desktop config

3. Update the paths to match your installation directory

4. Restart Claude Desktop

#### macOS

1. Locate your Claude Desktop config file:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. Copy the contents of `mcp-servers/claude_desktop_config.json` into your Claude Desktop config

3. Update the paths to use forward slashes and match your installation directory

4. Restart Claude Desktop

#### Linux

1. Locate your Claude Desktop config file:
   ```
   ~/.config/Claude/claude_desktop_config.json
   ```

2. Copy the contents of `mcp-servers/claude_desktop_config.json` into your Claude Desktop config

3. Update the paths to match your installation directory

4. Restart Claude Desktop

## Verification

After restarting Claude Desktop, you should see the Stark MCP servers available in the tools menu. You can verify by:

1. Opening Claude Desktop
2. Looking for the MCP server indicators in the UI
3. Trying a simple command like "classify this data as public or confidential"

## Troubleshooting

### Servers Not Appearing

1. Check that all servers built successfully:
   ```bash
   ls mcp-servers/*/build/index.js
   ```

2. Verify Node.js version:
   ```bash
   node --version  # Should be 18 or higher
   ```

3. Check Claude Desktop logs for errors

### Connection Errors

1. Verify Stark services are running:
   ```bash
   curl http://localhost:8001/health
   curl http://localhost:8002/health
   # ... etc for all services
   ```

2. Check firewall settings

3. Verify port numbers in configuration match running services

### Build Errors

1. Clear node_modules and rebuild:
   ```bash
   cd mcp-servers/[server-name]
   rm -rf node_modules build
   npm install
   npm run build
   ```

2. Check for TypeScript errors:
   ```bash
   npm run build 2>&1 | grep error
   ```

## Development Mode

To run servers in development mode with auto-rebuild:

```bash
cd mcp-servers/[server-name]
npm run watch
```

## Testing

Test individual servers using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node mcp-servers/[server-name]/build/index.js
```

## Next Steps

- Read the [Usage Guide](USAGE_GUIDE.md) for examples
- Check individual server READMEs for tool-specific documentation
- Review the [Troubleshooting Guide](TROUBLESHOOTING.md) for common issues
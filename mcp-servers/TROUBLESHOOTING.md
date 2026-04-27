# Stark MCP Servers - Troubleshooting Guide

Common issues and solutions for Stark MCP servers.

## Installation Issues

### npm install fails

**Problem**: Dependencies fail to install

**Solutions**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

### TypeScript build errors

**Problem**: `npm run build` fails with TypeScript errors

**Solutions**:
1. Ensure shared library is built first:
   ```bash
   cd mcp-servers/shared
   npm install
   npm run build
   ```

2. Check TypeScript version:
   ```bash
   npx tsc --version  # Should be 5.3+
   ```

3. Clean and rebuild:
   ```bash
   npm run clean
   npm run build
   ```

## Runtime Issues

### Server not appearing in Claude Desktop

**Problem**: MCP server doesn't show up in Claude Desktop

**Solutions**:
1. Verify server built successfully:
   ```bash
   ls mcp-servers/[server-name]/build/index.js
   ```

2. Check Claude Desktop config file location:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

3. Verify JSON syntax in config file

4. Restart Claude Desktop completely

5. Check Claude Desktop logs for errors

### Connection refused errors

**Problem**: "ECONNREFUSED" or "Connection refused" errors

**Solutions**:
1. Verify Stark services are running:
   ```bash
   curl http://localhost:8001/health
   curl http://localhost:8002/health
   # etc.
   ```

2. Check if ports are in use:
   ```bash
   # Windows
   netstat -ano | findstr :8001
   
   # Linux/Mac
   lsof -i :8001
   ```

3. Verify environment variables in Claude config:
   ```json
   "env": {
     "SECURITY_API_URL": "http://localhost:8001"
   }
   ```

4. Check firewall settings

### Tool execution fails

**Problem**: Tool calls return errors

**Solutions**:
1. Check server logs in Claude Desktop

2. Verify API endpoint exists:
   ```bash
   curl http://localhost:8001/api/v1/classify
   ```

3. Test with MCP Inspector:
   ```bash
   npx @modelcontextprotocol/inspector node mcp-servers/[server-name]/build/index.js
   ```

4. Check request parameters match tool schema

## Service Issues

### FastAPI service not starting

**Problem**: Stark service fails to start

**Solutions**:
1. Check Python version:
   ```bash
   python --version  # Should be 3.9+
   ```

2. Install dependencies:
   ```bash
   cd services/[service-name]
   pip install -r requirements.txt
   ```

3. Check for port conflicts:
   ```bash
   # Windows
   netstat -ano | findstr :8001
   
   # Linux/Mac
   lsof -i :8001
   ```

4. Check service logs:
   ```bash
   cd services/[service-name]
   uvicorn src.main:app --port 8001 --log-level debug
   ```

### Docker services not starting

**Problem**: `docker-compose up` fails

**Solutions**:
1. Check Docker is running:
   ```bash
   docker ps
   ```

2. Check Docker Compose version:
   ```bash
   docker-compose --version
   ```

3. Rebuild containers:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

4. Check logs:
   ```bash
   docker-compose logs [service-name]
   ```

## Performance Issues

### Slow response times

**Problem**: Tools take too long to respond

**Solutions**:
1. Check service health:
   ```bash
   curl http://localhost:8001/health
   ```

2. Monitor resource usage:
   ```bash
   # Windows
   taskmgr
   
   # Linux/Mac
   top
   ```

3. Increase timeout in client.ts:
   ```typescript
   const client = new StarkApiClient(
     { baseUrl: API_BASE_URL, timeout: 60000 }, // Increase timeout
     "Service Name"
   );
   ```

4. Check network latency

### High memory usage

**Problem**: Servers consume too much memory

**Solutions**:
1. Restart services periodically

2. Optimize context window usage

3. Use token optimization tools

4. Check for memory leaks in logs

## Configuration Issues

### Wrong API URLs

**Problem**: Servers connecting to wrong endpoints

**Solutions**:
1. Verify environment variables in Claude config:
   ```json
   "env": {
     "SECURITY_API_URL": "http://localhost:8001"
   }
   ```

2. Check .env files in service directories

3. Verify port numbers match running services

### Path issues on Windows

**Problem**: Backslashes in paths cause errors

**Solutions**:
1. Use forward slashes in config:
   ```json
   "args": ["C:/path/to/server/build/index.js"]
   ```

2. Or escape backslashes:
   ```json
   "args": ["C:\\path\\to\\server\\build\\index.js"]
   ```

## Debugging

### Enable debug logging

Add debug logging to servers:

```typescript
// In index.ts
console.error("Debug: Tool called:", name);
console.error("Debug: Arguments:", JSON.stringify(args));
```

### Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node mcp-servers/[server-name]/build/index.js
```

### Check API responses

```bash
curl -X POST http://localhost:8001/api/v1/classify \
  -H "Content-Type: application/json" \
  -d '{"content": "test data"}'
```

### Monitor network traffic

Use tools like Wireshark or browser DevTools to monitor requests

## Getting Help

If you're still experiencing issues:

1. Check the [Installation Guide](INSTALLATION.md)
2. Review the [Usage Guide](USAGE_GUIDE.md)
3. Check individual server READMEs
4. Review service logs
5. Check GitHub issues
6. Contact support

## Common Error Messages

### "Cannot find module"

**Cause**: Missing dependencies or incorrect import paths

**Solution**: Run `npm install` and verify import paths use `.js` extensions

### "EADDRINUSE"

**Cause**: Port already in use

**Solution**: Stop the process using the port or use a different port

### "Permission denied"

**Cause**: Insufficient permissions

**Solution**: Run with appropriate permissions or check file ownership

### "Timeout"

**Cause**: Service not responding or network issues

**Solution**: Increase timeout, check service health, verify network connectivity
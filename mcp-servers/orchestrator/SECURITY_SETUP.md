# Security Setup Guide

Quick guide to configure security features in Sytra MCP Orchestrator.

## Admin Password Setup

The orchestrator requires an admin password for dangerous operations (file deletion, system path access, etc.).

### Dashboard Configuration (Recommended)

Admin passwords are configured exclusively through the **dashboard interface** for enhanced security. This ensures passwords are never stored in configuration files or environment variables.

**Setup Steps**:

1. **Start the orchestrator** and ensure it's running
2. **Open the dashboard** at `http://localhost:3000`
3. **Navigate to Security Settings** in the dashboard
4. **Set your admin password** when prompted
5. **Confirm the password** meets requirements

**Password Requirements**:
- Minimum 8 characters
- Password strength indicator guides you to create strong passwords
- Stored as PBKDF2 hash with 100,000 iterations
- Automatically encrypted in the database

**How It Works**:
- When dangerous operations are requested, a password prompt modal appears in the dashboard
- Enter your admin password to authorize the operation
- Session tokens are valid for 1 hour after successful authentication
- All password verification attempts are logged in the audit trail

## Workspace Configuration

Set your workspace directory to enforce file operation boundaries:

```powershell
$env:WORKSPACE_DIR = "C:\path\to\your\project"
```

All file operations are restricted to this directory unless admin password is provided.

## IDE Configuration

> **⚠️ IMPORTANT**: Admin passwords are NOT configured in IDE settings. They are configured exclusively through the dashboard interface at `http://localhost:3000`.

### Claude Desktop

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sytra-orchestrator": {
      "command": "node",
      "args": ["C:\\path\\to\\sytra-mcp\\mcp-servers\\orchestrator\\build\\index.js"],
      "env": {
        "WORKSPACE_DIR": "C:\\path\\to\\your\\project"
      }
    }
  }
}
```

**Note**: The `SYTRA_ADMIN_PASSWORD` environment variable is no longer used. Password prompts will appear in the dashboard when needed.

### Cursor

Edit `.cursor/config.json` in your project:

```json
{
  "mcp": {
    "servers": {
      "sytra-orchestrator": {
        "command": "node",
        "args": ["C:\\path\\to\\sytra-mcp\\mcp-servers\\orchestrator\\build\\index.js"],
        "env": {
          "WORKSPACE_DIR": "${workspaceFolder}"
        }
      }
    }
  }
}
```

### Windsurf

Edit Windsurf settings:

```json
{
  "mcp.servers": {
    "sytra-orchestrator": {
      "command": "node",
      "args": ["C:\\path\\to\\sytra-mcp\\mcp-servers\\orchestrator\\build\\index.js"],
      "env": {
        "WORKSPACE_DIR": "${workspaceFolder}"
      }
    }
  }
}
```

## Security Features

### Dashboard-Based Password Prompts

When dangerous operations are requested (file deletion, system path access, etc.), the orchestrator triggers a password prompt modal in the dashboard:

- **Interactive prompts**: Password entry happens in the dashboard UI at `http://localhost:3000`
- **Session management**: Successful authentication creates a 1-hour session token
- **Automatic expiration**: Tokens expire after 1 hour, requiring re-authentication
- **Audit logging**: All password verification attempts are logged with timestamps and outcomes
- **Real-time feedback**: Immediate validation and error messages in the dashboard

### Admin Authentication

- **Rate limiting**: 5 password attempts per 15-minute window
- **Automatic blocking**: Account locked for 1 hour after exceeding max attempts
- **PBKDF2 hashing**: Passwords stored with 100,000 iterations for maximum security
- **Session tokens**: 1-hour validity with automatic renewal on activity
- **Audit trail**: Complete logging of all authentication events

### Credential Redaction
- **Automatic credential protection**: Passwords, tokens, and API keys are automatically redacted from file content
- **MCP config file protection**: Reading MCP configuration files (e.g., [`configs/antigravity.json`](configs/antigravity.json)) automatically redacts sensitive credentials
- **Comprehensive pattern matching**: Detects and redacts:
  - Passwords: `"password": "..."` → `"password": "[REDACTED]"`
  - API keys: `"api_key": "..."`, `"apiKey": "..."` → `"[REDACTED]"`
  - Tokens: `"token": "..."`, Bearer tokens, JWT tokens → `"[REDACTED]"`
  - AWS credentials: `AWS_SECRET_ACCESS_KEY`, `AWS_ACCESS_KEY_ID` → `"[REDACTED]"`
  - Database connection strings: `postgres://user:password@host` → `postgres://user:[REDACTED]@host`
  - SSH private keys: Content between `-----BEGIN/END PRIVATE KEY-----` → `[REDACTED]`
  - Generic secrets: `"secret": "..."`, `"client_secret": "..."` → `"[REDACTED]"`
- **Audit logging**: All redaction events are logged with file path, redaction count, and patterns matched
- **Zero configuration**: Enabled by default, no setup required

**Example - Reading MCP Config**:
```json
// Original file content (configs/api-config.json):
{
  "api_key": "sk-1234567890abcdef",
  "database_password": "mysecretpassword123",
  "aws_secret": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
}

// What the agent sees (automatically redacted):
{
  "api_key": "[REDACTED]",
  "database_password": "[REDACTED]",
  "aws_secret": "[REDACTED]"
}
```

> **Note**: Admin passwords are managed through the dashboard and are never stored in configuration files, so they don't appear in file content that could be read by the agent.

### Workspace Boundary Enforcement
- All file paths validated against workspace directory
- Path traversal attempts blocked (`../`, symlinks outside workspace)
- System paths require admin authentication

### Security Guardrails
- Dangerous operations blocked (delete, rm -rf, sudo, chmod 777)
- Sensitive files protected (.env, .key, credentials.*)
- MCP config files protected (configs/*.json)
- All operations logged in audit trail

## Testing Your Setup

1. **Test workspace validation**:
   ```
   Try to read a file outside workspace - should require auth
   ```

2. **Test sensitive file protection**:
   ```
   Try to delete .env file - should be blocked
   ```

3. **Test admin password**:
   ```
   Provide password when prompted for dangerous operations
   ```

## Troubleshooting

### "Admin password not configured"
- **Solution**: Open the dashboard at `http://localhost:3000` and configure your admin password in the Security Settings
- The password must be set through the dashboard interface, not via environment variables or config files

### "Dashboard not accessible"
- **Check orchestrator is running**: Ensure the MCP server is started and running
- **Verify port**: Dashboard should be accessible at `http://localhost:3000`
- **Check firewall**: Ensure port 3000 is not blocked by firewall rules
- **Browser console**: Check for JavaScript errors in browser developer tools

### "Too many failed attempts"
- **Wait period**: Account is locked for 1 hour after 5 failed attempts
- **Check password**: Verify you're using the correct password set in the dashboard
- **Session expired**: Your session token may have expired (1-hour validity)
- **Clear and retry**: Wait for the rate limit window to expire (15 minutes)

### "Path is outside workspace boundaries"
- **Set workspace**: Configure `WORKSPACE_DIR` environment variable in your IDE config
- **Admin authorization**: Provide admin password via dashboard prompt for out-of-workspace access
- **Check path**: Ensure the path you're trying to access is correct

### "Password prompt not appearing"
- **Dashboard connection**: Ensure dashboard is open at `http://localhost:3000`
- **Browser refresh**: Try refreshing the dashboard page
- **Check logs**: Review orchestrator logs for authentication errors
- **Session state**: Your session may be in an invalid state - restart the orchestrator

## Security Best Practices

1. **Configure passwords via dashboard only**: Never store admin passwords in environment variables, config files, or version control
2. **Use strong passwords**: Minimum 12 characters with a mix of letters, numbers, and symbols - use the dashboard's password strength indicator as a guide
3. **Rotate passwords regularly**: Change admin password periodically through the dashboard Security Settings
4. **Limit workspace scope**: Set `WORKSPACE_DIR` to your project directory only to enforce file operation boundaries
5. **Review audit logs**: Regularly check audit logs for suspicious authentication attempts or unauthorized access
6. **Monitor session activity**: Be aware of the 1-hour session token validity and re-authenticate when needed
7. **Secure dashboard access**: Ensure the dashboard at `http://localhost:3000` is only accessible from trusted networks
8. **Never share passwords**: Admin passwords should be known only to authorized personnel
9. **Use rate limiting**: The built-in rate limiting (5 attempts/15 minutes) helps prevent brute force attacks
10. **Keep credentials secure**: Never commit passwords, tokens, or API keys to version control

## Advanced Configuration

Edit [`mcp-servers/orchestrator/security-config.json`](mcp-servers/orchestrator/security-config.json) to customize security behavior:

```json
{
  "workspaceOnly": true,
  "requirePasswordFor": ["delete", "execute_command"],
  "sensitiveFilePatterns": [
    ".env*",
    "*.key",
    "credentials.*",
    "**/configs/*.json",
    "**/*config*.json"
  ],
  "dangerousOperations": ["delete", "rm", "sudo"],
  "systemPaths": ["/etc", "/sys", "/proc", "C:\\Windows"],
  "credentialRedaction": {
    "enabled": true,
    "patterns": [
      "password",
      "token",
      "api_key",
      "apiKey",
      "secret",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_ACCESS_KEY_ID",
      "private_key"
    ],
    "filePatterns": [
      "**/configs/*.json",
      "**/*config*.json",
      "**/.env*",
      "**/credentials*",
      "**/*.pem",
      "**/*.key"
    ]
  }
}
```

**Configuration Options**:

- **workspaceOnly**: Enforce all operations within workspace boundaries (default: `true`)
- **requirePasswordFor**: Operations requiring admin password authentication
- **sensitiveFilePatterns**: File patterns that trigger additional security checks
- **dangerousOperations**: Commands that are blocked or require authentication
- **systemPaths**: System directories requiring admin authentication
- **credentialRedaction**: Automatic credential protection settings

### Credential Redaction Configuration

- **enabled**: Enable/disable automatic credential redaction (default: `true`)
- **patterns**: List of credential field names to redact (case-insensitive matching)
- **filePatterns**: Glob patterns for files that should have credentials redacted

> **Note**: `SYTRA_ADMIN_PASSWORD` has been removed from redaction patterns as admin passwords are now managed exclusively through the dashboard and never stored in configuration files.

**To disable credential redaction** (not recommended):
```json
{
  "credentialRedaction": {
    "enabled": false
  }
}
```

**To add custom patterns**:
```json
{
  "credentialRedaction": {
    "enabled": true,
    "patterns": [
      "password",
      "my_custom_secret",
      "internal_token",
      "company_api_key"
    ]
  }
}
```

## Support

For issues or questions:
- Check logs in orchestrator output
- Review audit trail for blocked operations
- See SECURITY_TESTING.md for test cases
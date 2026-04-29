# Security Implementation Guide

## Overview

This document describes the secure admin password configuration system implemented in the Sytra MCP Dashboard. Admin passwords are configured exclusively through the secure dashboard interface and are never stored in MCP config files. The system implements password prompts for dangerous actions to enhance security.

## Architecture

### Components

1. **Dashboard UI** (`dashboard/index.html`)
   - Security settings section with password configuration form
   - Password prompt modal for dangerous actions
   - Real-time password strength indicator
   - Session management options

2. **Dashboard API** (`dashboard-api/server.js`)
   - Password management endpoints
   - Password verification endpoints
   - Audit logging
   - Rate limiting

3. **Credential Vault** (`dashboard-api/services/credential-vault.js`)
   - Secure password hashing (PBKDF2 with 100,000 iterations)
   - Session token management
   - Password strength validation

4. **MCP Security Middleware** (`mcp-servers/orchestrator/src/security/`)
   - Dangerous action detection
   - Workspace boundary validation
   - Security guardrails integration

## Features Implemented

### 1. Admin Password Configuration UI

**Location:** Dashboard → Security Section

**Features:**
- Set/update admin password
- Password strength indicator (weak/medium/strong)
- Password confirmation field
- Current password requirement for updates
- Visual feedback for successful/failed operations

**Password Requirements:**
- Minimum 8 characters
- Recommended: Mix of uppercase, lowercase, numbers, and special characters
- Strength scoring based on complexity

### 2. Password Prompt Popup

**Triggers:**
- File operations outside workspace directory
- Execution of dangerous commands
- Access to system paths
- Sensitive file modifications

**Features:**
- Clear description of the action being attempted
- Display of target file/command
- Reason for security prompt
- "Remember for this session" option (1 hour)
- Allow/Deny buttons

### 3. Backend Security

**Password Storage:**
- Stored in `~/.sytra/admin.hash` with 0600 permissions
- Uses PBKDF2 with SHA-512 and 100,000 iterations
- Salt generated per password
- Never stored in plain text

**Rate Limiting:**
- Maximum 5 failed attempts per 15-minute window
- 1-hour block after exceeding limit
- Context-based tracking (prevents bypass)

**Session Management:**
- Optional session tokens for "remember me" functionality
- 1-hour expiry
- Automatic cleanup of expired tokens

## API Endpoints

### POST `/api/admin/set-password`

Set or update the admin password.

**Request Body:**
```json
{
  "newPassword": "string (min 8 chars)",
  "currentPassword": "string (optional, required for updates)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin password set successfully"
}
```

### POST `/api/admin/verify-password`

Verify admin password for dangerous actions.

**Request Body:**
```json
{
  "password": "string",
  "context": "string (e.g., 'file_operation')",
  "rememberSession": "boolean"
}
```

**Response:**
```json
{
  "valid": true,
  "sessionToken": "string (if rememberSession=true)"
}
```

### GET `/api/admin/password-status`

Check if admin password is configured.

**Response:**
```json
{
  "configured": true
}
```

### GET `/api/admin/audit-log?limit=50`

Retrieve security audit log.

**Response:**
```json
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2026-04-29T20:00:00Z",
      "action": "admin_password_set",
      "user": "admin",
      "resource": "/api/admin/set-password",
      "details": "{\"action\":\"created\"}",
      "ip_address": "127.0.0.1"
    }
  ]
}
```

## Security Middleware Integration

### Dangerous Action Detection

The security middleware automatically detects dangerous actions:

```typescript
// Example: Check if action requires password
const securityCheck = await middleware.checkToolExecution(toolName, args);

if (securityCheck.requiresAuth) {
  // Show password prompt
  const result = await middleware.requestPasswordVerification({
    type: toolName,
    target: args.path || args.command,
    reason: securityCheck.reason
  });
  
  if (!result.allowed) {
    // Block the action
    throw new Error('Action denied by security policy');
  }
}
```

### Workspace Validation

All file operations are validated against the workspace directory:

- Operations inside workspace: Allowed
- Operations outside workspace: Require password
- System paths: Blocked or require password (configurable)

## Configuration

### Environment Variables

```bash
# Master encryption key for credential vault
export MASTER_KEY="your-master-key"
```

**Note:** Admin passwords should be configured exclusively through the dashboard interface, not via environment variables or config files.

### Security Config

Located in `mcp-servers/orchestrator/security-config.json`:

```json
{
  "workspaceOnly": true,
  "requirePasswordFor": [
    "file_operations_outside_workspace",
    "system_commands",
    "network_requests"
  ],
  "rateLimiting": {
    "maxAttempts": 5,
    "windowMs": 900000,
    "blockDurationMs": 3600000
  }
}
```

## Usage Guide

### Setting Up Admin Password

1. Open the dashboard at `http://localhost:3000`
2. Navigate to the "Security" section
3. Enter a strong password (minimum 8 characters)
4. Confirm the password
5. Click "Set Admin Password"

### Updating Admin Password

1. Navigate to Security section
2. Enter new password and confirmation
3. Enter current password in the "Current Password" field
4. Click "Set Admin Password"

### Handling Dangerous Actions

When the AI attempts a dangerous action:

1. A modal will appear describing the action
2. Review the action details carefully
3. Enter your admin password
4. Optionally check "Remember for this session"
5. Click "Allow Action" to proceed or "Deny" to block

## Security Best Practices

### For Administrators

1. **Use Strong Passwords:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and special characters
   - Avoid common words or patterns

2. **Regular Password Updates:**
   - Change password periodically
   - Update immediately if compromised

3. **Monitor Audit Logs:**
   - Review security events regularly
   - Investigate suspicious activities
   - Check for failed authentication attempts

4. **Session Management:**
   - Use "Remember for this session" sparingly
   - Only on trusted devices
   - Clear sessions when done

### For Developers

1. **Never Log Passwords:**
   - Passwords are redacted in logs
   - Use secure logging practices

2. **Validate All Inputs:**
   - Check password length and complexity
   - Sanitize user inputs

3. **Rate Limiting:**
   - Implement on all authentication endpoints
   - Use context-based tracking

4. **Secure Storage:**
   - Never store passwords in plain text
   - Use strong hashing algorithms
   - Protect file permissions

## Testing Recommendations

### Manual Testing

1. **Password Configuration:**
   ```bash
   # Test setting password
   curl -X POST http://localhost:3000/api/admin/set-password \
     -H "Content-Type: application/json" \
     -d '{"newPassword":"TestPassword123!"}'
   
   # Test password verification
   curl -X POST http://localhost:3000/api/admin/verify-password \
     -H "Content-Type: application/json" \
     -d '{"password":"TestPassword123!","context":"test"}'
   ```

2. **Rate Limiting:**
   - Attempt 6 failed password verifications
   - Verify account is blocked for 1 hour
   - Check audit log for failed attempts

3. **Session Tokens:**
   - Enable "Remember for this session"
   - Verify token works for 1 hour
   - Verify token expires after 1 hour

### Automated Testing

```javascript
// Example test suite
describe('Admin Password Security', () => {
  it('should reject weak passwords', async () => {
    const response = await setPassword('weak');
    expect(response.status).toBe(400);
  });
  
  it('should enforce rate limiting', async () => {
    for (let i = 0; i < 6; i++) {
      await verifyPassword('wrong');
    }
    const response = await verifyPassword('wrong');
    expect(response.status).toBe(429);
  });
  
  it('should validate session tokens', async () => {
    const { sessionToken } = await verifyPassword('correct', true);
    const isValid = await validateSessionToken(sessionToken);
    expect(isValid).toBe(true);
  });
});
```

## Troubleshooting

### Password Not Working

1. Check if password file exists: `~/.sytra/admin.hash`
2. Verify file permissions: `chmod 600 ~/.sytra/admin.hash`
3. Verify password was set via dashboard (Security section)
4. Review audit logs for failed attempts

### Rate Limiting Issues

1. Check current rate limit status via API
2. Wait for block duration to expire (1 hour)
3. Clear rate limit (admin only):
   ```javascript
   vault.clearRateLimit('context');
   ```

### Session Token Issues

1. Verify token hasn't expired (1 hour limit)
2. Check token storage in memory
3. Clear expired tokens manually if needed

## File Structure

```
sytra-mcp/
├── dashboard/
│   ├── index.html                 # Security UI section added
│   ├── css/
│   │   └── components.css         # Security component styles
│   └── js/
│       └── security.js            # Security management logic
├── dashboard-api/
│   ├── server.js                  # Password endpoints added
│   ├── db/
│   │   └── sqlite.js              # Audit log support
│   └── services/
│       └── credential-vault.js    # Password management
└── mcp-servers/orchestrator/src/security/
    ├── middleware.ts              # Dangerous action detection
    ├── auth.ts                    # Password verification
    ├── guardrails.ts              # Security policies
    └── workspace-validator.ts     # Workspace boundaries
```

## Future Enhancements

1. **Multi-Factor Authentication (MFA):**
   - TOTP support
   - SMS verification
   - Hardware key support

2. **Advanced Session Management:**
   - Device fingerprinting
   - IP-based restrictions
   - Concurrent session limits

3. **Enhanced Audit Logging:**
   - Detailed action tracking
   - Export to SIEM systems
   - Real-time alerts

4. **Password Policies:**
   - Configurable complexity requirements
   - Password history
   - Expiration policies

5. **WebSocket Integration:**
   - Real-time password prompts
   - Live security notifications
   - Instant action blocking

## Support

For issues or questions:
- Review audit logs: Dashboard → Security → Audit Log
- Check server logs: `dashboard-api/server.js` console output
- Verify configuration: `mcp-servers/orchestrator/security-config.json`

## Made with Bob
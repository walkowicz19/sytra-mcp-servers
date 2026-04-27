# Stark Security Guardrails MCP Server

MCP server providing data classification, access control, encryption, and audit logging capabilities from the Stark Security Guardrails service.

## Tools

### classify_data
Classify data sensitivity level (public, internal, confidential, restricted).

**Parameters:**
- `content` (required): Content to classify
- `context` (optional): Additional context about the data

### check_access
Check if access to a file or resource is allowed.

**Parameters:**
- `file_path` (required): Path to the file or resource
- `user_id` (required): User ID requesting access
- `action` (required): Action to perform (read, write, execute, delete)

### scan_for_sensitive_data
Scan content for PII, credentials, and other sensitive data.

**Parameters:**
- `content` (required): Content to scan
- `scan_types` (optional): Types of sensitive data to scan for

### encrypt_data
Encrypt sensitive data using AES-256.

**Parameters:**
- `data` (required): Data to encrypt
- `key_id` (optional): Encryption key ID

### decrypt_data
Decrypt previously encrypted data.

**Parameters:**
- `encrypted_data` (required): Encrypted data to decrypt
- `key_id` (required): Encryption key ID used for encryption

### audit_log
Query audit logs for security events.

**Parameters:**
- `start_time` (optional): Start time for log query (ISO 8601)
- `end_time` (optional): End time for log query (ISO 8601)
- `event_type` (optional): Filter by event type
- `user_id` (optional): Filter by user ID
- `limit` (optional): Maximum results (default: 100)

## Installation

```bash
cd mcp-servers/security-guardrails
npm install
npm run build
```

## Configuration

Add to Claude Desktop config:

```json
{
  "mcpServers": {
    "stark-security": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/security-guardrails/build/index.js"],
      "env": {
        "SECURITY_API_URL": "http://localhost:8001"
      }
    }
  }
}
```

## Requirements

- Node.js 18+
- Running Stark Security Guardrails service on port 8001
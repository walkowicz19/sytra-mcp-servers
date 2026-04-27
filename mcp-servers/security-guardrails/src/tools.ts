/**
 * Tool definitions for Security Guardrails MCP server
 */

export const tools = [
  {
    name: "classify_data",
    description: "Classify data sensitivity level (public, internal, confidential, restricted)",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Content to classify"
        },
        context: {
          type: "string",
          description: "Additional context about the data"
        }
      },
      required: ["content"]
    }
  },
  {
    name: "check_access",
    description: "Check if access to a file or resource is allowed",
    inputSchema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Path to the file or resource"
        },
        user_id: {
          type: "string",
          description: "User ID requesting access"
        },
        action: {
          type: "string",
          enum: ["read", "write", "execute", "delete"],
          description: "Action to perform"
        }
      },
      required: ["file_path", "user_id", "action"]
    }
  },
  {
    name: "scan_for_sensitive_data",
    description: "Scan content for PII, credentials, and other sensitive data",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "Content to scan"
        },
        scan_types: {
          type: "array",
          items: {
            type: "string",
            enum: ["pii", "credentials", "api_keys", "secrets"]
          },
          description: "Types of sensitive data to scan for"
        }
      },
      required: ["content"]
    }
  },
  {
    name: "encrypt_data",
    description: "Encrypt sensitive data using AES-256",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "string",
          description: "Data to encrypt"
        },
        key_id: {
          type: "string",
          description: "Encryption key ID (optional, uses default if not provided)"
        }
      },
      required: ["data"]
    }
  },
  {
    name: "decrypt_data",
    description: "Decrypt previously encrypted data",
    inputSchema: {
      type: "object",
      properties: {
        encrypted_data: {
          type: "string",
          description: "Encrypted data to decrypt"
        },
        key_id: {
          type: "string",
          description: "Encryption key ID used for encryption"
        }
      },
      required: ["encrypted_data"]
    }
  },
  {
    name: "audit_log",
    description: "Query audit logs for security events",
    inputSchema: {
      type: "object",
      properties: {
        start_time: {
          type: "string",
          description: "Start time for log query (ISO 8601 format)"
        },
        end_time: {
          type: "string",
          description: "End time for log query (ISO 8601 format)"
        },
        event_type: {
          type: "string",
          description: "Filter by event type (e.g., 'access_denied', 'data_classified')"
        },
        user_id: {
          type: "string",
          description: "Filter by user ID"
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return",
          default: 100
        }
      },
      required: []
    }
  }
];

// Made with Bob

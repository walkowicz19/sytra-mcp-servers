/**
 * HTTP client for Security Guardrails FastAPI service
 */

import { StarkApiClient, ToolResult } from "../../shared/src/index.js";

const API_BASE_URL = process.env.SECURITY_API_URL || "http://localhost:8001";

const client = new StarkApiClient(
  { baseUrl: API_BASE_URL },
  "Security Guardrails"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "classify_data":
        return await client.callEndpoint("/api/v1/classify", "POST", {
          content: args.content,
          context: args.context
        });

      case "check_access":
        return await client.callEndpoint("/api/v1/access/check", "POST", {
          file_path: args.file_path,
          user_id: args.user_id,
          action: args.action
        });

      case "scan_for_sensitive_data":
        return await client.callEndpoint("/api/v1/scan", "POST", {
          content: args.content,
          scan_types: args.scan_types || ["pii", "credentials", "api_keys", "secrets"]
        });

      case "encrypt_data":
        return await client.callEndpoint("/api/v1/encrypt", "POST", {
          data: args.data,
          key_id: args.key_id
        });

      case "decrypt_data":
        return await client.callEndpoint("/api/v1/decrypt", "POST", {
          encrypted_data: args.encrypted_data,
          key_id: args.key_id
        });

      case "audit_log":
        return await client.callEndpoint("/api/v1/audit/logs", "GET", {
          start_time: args.start_time,
          end_time: args.end_time,
          event_type: args.event_type,
          user_id: args.user_id,
          limit: args.limit || 100
        });

      default:
        return {
          content: [{
            type: "text",
            text: `Unknown tool: ${name}`
          }],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error calling tool ${name}: ${error}`
      }],
      isError: true
    };
  }
}

// Made with Bob

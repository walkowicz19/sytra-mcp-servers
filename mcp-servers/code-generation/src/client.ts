import { StarkApiClient, ToolResult } from "../../shared/src/index.js";

const API_BASE_URL = process.env.CODEGEN_API_URL || "http://localhost:8002";

const client = new StarkApiClient(
  { baseUrl: API_BASE_URL },
  "Code Generation"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "generate_code":
        return await client.callEndpoint("/api/v1/generate", "POST", {
          requirements: args.requirements,
          language: args.language,
          context: args.context
        });

      case "validate_code":
        return await client.callEndpoint("/api/v1/validate", "POST", {
          code: args.code,
          language: args.language
        });

      case "run_in_sandbox":
        return await client.callEndpoint("/api/v1/sandbox/execute", "POST", {
          code: args.code,
          language: args.language,
          input_data: args.input_data,
          timeout: args.timeout || 30
        });

      case "analyze_code":
        return await client.callEndpoint("/api/v1/analyze", "POST", {
          code: args.code,
          language: args.language,
          checks: args.checks || ["complexity", "style", "performance", "maintainability"]
        });

      case "scan_security":
        return await client.callEndpoint("/api/v1/security/scan", "POST", {
          code: args.code,
          language: args.language
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

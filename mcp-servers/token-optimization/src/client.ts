import { StarkApiClient, ToolResult } from '../../shared/src/index.js';

const API_URL = process.env.TOKEN_API_URL || "http://localhost:8005";

const tokenClient = new StarkApiClient(
  { baseUrl: API_URL },
  "Token Optimization"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "count_tokens":
        return await tokenClient.callEndpoint("/api/v1/token/count", "POST", args);
      
      case "optimize_context":
        return await tokenClient.callEndpoint("/api/v1/token/optimize-context", "POST", args);
      
      case "compress_text":
        return await tokenClient.callEndpoint("/api/v1/token/compress", "POST", args);
      
      case "prune_context":
        return await tokenClient.callEndpoint("/api/v1/token/prune", "POST", args);
      
      case "summarize_content":
        return await tokenClient.callEndpoint("/api/v1/token/summarize", "POST", args);
      
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

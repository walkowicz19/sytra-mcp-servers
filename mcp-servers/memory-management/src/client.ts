import { StarkApiClient, ToolResult } from '../../shared/src/index.js';

const API_URL = process.env.MEMORY_API_URL || "http://localhost:8003";

const memoryClient = new StarkApiClient(
  { baseUrl: API_URL },
  "Memory Management"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "store_memory":
        return await memoryClient.callEndpoint("/api/v1/memory/store", "POST", args);
      
      case "retrieve_memory":
        return await memoryClient.callEndpoint("/api/v1/memory/retrieve", "POST", args);
      
      case "search_memory":
        return await memoryClient.callEndpoint("/api/v1/memory/search", "POST", args);
      
      case "compress_context":
        return await memoryClient.callEndpoint("/api/v1/memory/compress", "POST", args);
      
      case "get_session_history":
        return await memoryClient.callEndpoint("/api/v1/memory/session/history", "GET", args);
      
      case "store_large_codebase_context":
        return await memoryClient.callEndpoint("/api/v1/context/codebase/store", "POST", args);
      
      case "retrieve_codebase_context":
        return await memoryClient.callEndpoint("/api/v1/context/codebase/retrieve", "POST", args);
      
      case "store_schema_context":
        return await memoryClient.callEndpoint("/api/v1/context/schema/store", "POST", args);
      
      case "retrieve_schema_context":
        return await memoryClient.callEndpoint("/api/v1/context/schema/retrieve", "POST", args);
      
      case "store_legacy_context":
        return await memoryClient.callEndpoint("/api/v1/context/legacy/store", "POST", args);
      
      case "retrieve_legacy_context":
        return await memoryClient.callEndpoint("/api/v1/context/legacy/retrieve", "POST", args);
      
      case "prioritize_context":
        return await memoryClient.callEndpoint("/api/v1/context/prioritize", "POST", args);
      
      case "merge_contexts":
        return await memoryClient.callEndpoint("/api/v1/context/merge", "POST", args);
      
      case "get_context_statistics":
        return await memoryClient.callEndpoint("/api/v1/context/statistics", "GET", args);
      
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

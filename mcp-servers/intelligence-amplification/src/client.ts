import { StarkApiClient, ToolResult } from '../../shared/src/index.js';

const API_URL = process.env.INTELLIGENCE_API_URL || "http://localhost:8004";

const intelligenceClient = new StarkApiClient(
  { baseUrl: API_URL },
  "Intelligence Amplification"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "optimize_prompt":
        return await intelligenceClient.callEndpoint("/api/v1/intelligence/optimize-prompt", "POST", args);
      
      case "rag_query":
        return await intelligenceClient.callEndpoint("/api/v1/intelligence/rag-query", "POST", args);
      
      case "chain_of_thought":
        return await intelligenceClient.callEndpoint("/api/v1/intelligence/chain-of-thought", "POST", args);
      
      case "self_reflect":
        return await intelligenceClient.callEndpoint("/api/v1/intelligence/self-reflect", "POST", args);
      
      case "decompose_task":
        return await intelligenceClient.callEndpoint("/api/v1/intelligence/decompose-task", "POST", args);
      
      case "route_to_model":
        return await intelligenceClient.callEndpoint("/api/v1/intelligence/route-to-model", "POST", args);
      
      case "index_repository":
        return await intelligenceClient.callEndpoint("/api/v1/repositories/index", "POST", args);
      
      case "semantic_code_search":
        return await intelligenceClient.callEndpoint("/api/v1/search/semantic", "POST", args);
      
      case "analyze_dependencies":
        return await intelligenceClient.callEndpoint("/api/v1/dependencies/analyze", "POST", args);
      
      case "get_index_status":
        return await intelligenceClient.callEndpoint("/api/v1/repositories/status", "GET", args);
      
      case "find_symbol_references":
        return await intelligenceClient.callEndpoint("/api/v1/symbols/references", "POST", args);
      
      case "analyze_code_complexity":
        return await intelligenceClient.callEndpoint("/api/v1/analysis/complexity", "POST", args);
      
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

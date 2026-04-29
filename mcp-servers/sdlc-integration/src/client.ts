import { StarkApiClient, ToolResult } from '../../shared/src/index.js';

const API_URL = process.env.SDLC_API_URL || "http://localhost:8006";

const sdlcClient = new StarkApiClient(
  { baseUrl: API_URL },
  "SDLC Integration"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "generate_tests":
        return await sdlcClient.callEndpoint("/api/v1/sdlc/generate-tests", "POST", args);
      
      case "review_code":
        return await sdlcClient.callEndpoint("/api/v1/sdlc/review-code", "POST", args);
      
      case "analyze_requirements":
        return await sdlcClient.callEndpoint("/api/v1/sdlc/analyze-requirements", "POST", args);
      
      case "generate_documentation":
        return await sdlcClient.callEndpoint("/api/v1/sdlc/generate-docs", "POST", args);
      
      case "suggest_design_patterns":
        return await sdlcClient.callEndpoint("/api/v1/sdlc/suggest-patterns", "POST", args);
      
      case "track_tech_debt":
        return await sdlcClient.callEndpoint("/api/v1/sdlc/track-debt", "POST", args);
      
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

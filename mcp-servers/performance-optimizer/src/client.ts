import { StarkApiClient, ToolResult } from '../../shared/src/index.js';

const API_URL = process.env.PERFORMANCE_API_URL || "http://localhost:8009";

const performanceClient = new StarkApiClient(
  { baseUrl: API_URL },
  "Performance Optimizer"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "run_benchmark":
        return await performanceClient.callEndpoint("/api/v1/performance/benchmark", "POST", args);
      
      case "optimize_cache":
        return await performanceClient.callEndpoint("/api/v1/performance/optimize/cache", "POST", args);
      
      case "monitor_system":
        return await performanceClient.callEndpoint("/api/v1/performance/monitor/system", "POST", args);
      
      case "profile_cpu":
        return await performanceClient.callEndpoint("/api/v1/performance/profile/cpu", "POST", args);
      
      case "profile_memory":
        return await performanceClient.callEndpoint("/api/v1/performance/profile/memory", "POST", args);
      
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

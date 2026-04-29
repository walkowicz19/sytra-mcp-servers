import { StarkApiClient, ToolResult } from '../../shared/src/index.js';

const API_URL = process.env.SCHEMA_API_URL || "http://localhost:8011";

const schemaClient = new StarkApiClient(
  { baseUrl: API_URL },
  "Schema Intelligence"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "profile_data":
        return await schemaClient.callEndpoint("/api/v1/analysis/profile-data", "POST", args);
      
      case "get_schema_status":
        return await schemaClient.callEndpoint("/api/v1/schema/status", "GET", args);
      
      case "generate_migration":
        return await schemaClient.callEndpoint("/api/v1/generate/migration", "POST", args);
      
      case "detect_relationships":
        return await schemaClient.callEndpoint("/api/v1/schema/relationships/detect", "POST", args);
      
      case "analyze_query_patterns":
        return await schemaClient.callEndpoint("/api/v1/analysis/query-patterns", "POST", args);
      
      case "delete_schema":
        return await schemaClient.callEndpoint("/api/v1/schema/delete", "POST", args);
      
      case "generate_documentation":
        return await schemaClient.callEndpoint("/api/v1/generate/documentation", "POST", args);
      
      case "list_schemas":
        return await schemaClient.callEndpoint("/api/v1/schema/list", "GET", args);
      
      case "extract_schema":
        return await schemaClient.callEndpoint("/api/v1/schema/extract", "POST", args);
      
      case "compare_schemas":
        return await schemaClient.callEndpoint("/api/v1/schema/compare", "POST", args);
      
      case "generate_erd":
        return await schemaClient.callEndpoint("/api/v1/generate/erd", "POST", args);
      
      case "suggest_indexes":
        return await schemaClient.callEndpoint("/api/v1/analysis/suggest-indexes", "POST", args);
      
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

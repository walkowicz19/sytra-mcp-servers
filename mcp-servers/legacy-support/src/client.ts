import { StarkApiClient, ToolResult } from '../../shared/src/index.js';

const API_URL = process.env.LEGACY_API_URL || "http://localhost:8003";

const legacyClient = new StarkApiClient(
  { baseUrl: API_URL },
  "Legacy Support"
);

export async function callTool(name: string, args: any): Promise<ToolResult> {
  try {
    switch (name) {
      case "analyze_mainframe_integration":
        return await legacyClient.callEndpoint("/api/v1/legacy/analyze/mainframe", "POST", args);
      
      case "extract_business_logic":
        return await legacyClient.callEndpoint("/api/v1/legacy/extract/business-logic", "POST", args);
      
      case "generate_migration_plan":
        return await legacyClient.callEndpoint("/api/v1/legacy/migration/plan", "POST", args);
      
      case "detect_legacy_patterns":
        return await legacyClient.callEndpoint("/api/v1/legacy/detect/patterns", "POST", args);
      
      case "map_legacy_database":
        return await legacyClient.callEndpoint("/api/v1/legacy/map/database", "POST", args);
      
      case "visualize_data_flow":
        return await legacyClient.callEndpoint("/api/v1/legacy/visualize/data-flow", "POST", args);
      
      case "suggest_modernization_path":
        return await legacyClient.callEndpoint("/api/v1/legacy/suggest/modernization", "POST", args);
      
      case "translate_cobol_to_java":
        return await legacyClient.callEndpoint("/api/v1/legacy/translate/cobol-to-java", "POST", args);
      
      case "analyze_dependencies":
        return await legacyClient.callEndpoint("/api/v1/legacy/analyze/dependencies", "POST", args);
      
      case "parse_fortran":
        return await legacyClient.callEndpoint("/api/v1/legacy/parse/fortran", "POST", args);
      
      case "generate_migration_report":
        return await legacyClient.callEndpoint("/api/v1/legacy/generate/migration-report", "POST", args);
      
      case "parse_cobol":
        return await legacyClient.callEndpoint("/api/v1/legacy/parse/cobol", "POST", args);
      
      case "translate_cobol_to_python":
        return await legacyClient.callEndpoint("/api/v1/legacy/translate/cobol-to-python", "POST", args);
      
      case "analyze_batch_jobs":
        return await legacyClient.callEndpoint("/api/v1/legacy/analyze/batch-jobs", "POST", args);
      
      case "extract_copybooks":
        return await legacyClient.callEndpoint("/api/v1/legacy/extract/copybooks", "POST", args);
      
      case "analyze_legacy_codebase":
        return await legacyClient.callEndpoint("/api/v1/legacy/analyze/codebase", "POST", args);
      
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

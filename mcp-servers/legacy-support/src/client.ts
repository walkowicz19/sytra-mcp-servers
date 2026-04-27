import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.LEGACY_API_URL || "http://localhost:8007";

export const legacyClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  parse_cobol: "/api/v1/legacy/parse/cobol",
  parse_fortran: "/api/v1/legacy/parse/fortran",
  translate_cobol_to_python: "/api/v1/legacy/translate/cobol-to-python",
  translate_cobol_to_java: "/api/v1/legacy/translate/cobol-to-java",
  analyze_dependencies: "/api/v1/legacy/analyze/dependencies",
  generate_migration_plan: "/api/v1/legacy/migration/plan"
};

// Made with Bob

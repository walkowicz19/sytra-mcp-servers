import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.SDLC_API_URL || "http://localhost:8006";

export const sdlcClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  analyze_requirements: "/api/v1/sdlc/analyze-requirements",
  suggest_design_patterns: "/api/v1/sdlc/suggest-patterns",
  review_code: "/api/v1/sdlc/review-code",
  generate_tests: "/api/v1/sdlc/generate-tests",
  track_tech_debt: "/api/v1/sdlc/track-debt",
  generate_documentation: "/api/v1/sdlc/generate-docs"
};

// Made with Bob

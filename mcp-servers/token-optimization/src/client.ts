import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.TOKEN_API_URL || "http://localhost:8005";

export const tokenClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  count_tokens: "/api/v1/token/count",
  optimize_context: "/api/v1/token/optimize-context",
  compress_text: "/api/v1/token/compress",
  summarize_content: "/api/v1/token/summarize",
  prune_context: "/api/v1/token/prune"
};

// Made with Bob

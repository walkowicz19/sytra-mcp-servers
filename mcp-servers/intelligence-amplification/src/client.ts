import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.INTELLIGENCE_API_URL || "http://localhost:8004";

export const intelligenceClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  optimize_prompt: "/api/v1/intelligence/optimize-prompt",
  rag_query: "/api/v1/intelligence/rag-query",
  chain_of_thought: "/api/v1/intelligence/chain-of-thought",
  self_reflect: "/api/v1/intelligence/self-reflect",
  decompose_task: "/api/v1/intelligence/decompose-task",
  route_to_model: "/api/v1/intelligence/route-to-model"
};

// Made with Bob

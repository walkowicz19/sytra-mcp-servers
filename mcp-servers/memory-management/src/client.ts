import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.MEMORY_API_URL || "http://localhost:8003";

export const memoryClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  store_memory: "/api/v1/memory/store",
  retrieve_memory: "/api/v1/memory/retrieve",
  search_memory: "/api/v1/memory/search",
  compress_context: "/api/v1/memory/compress",
  get_session_history: "/api/v1/memory/session/history"
};

// Made with Bob

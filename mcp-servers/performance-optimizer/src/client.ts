import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.PERFORMANCE_API_URL || "http://localhost:8009";

export const performanceClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  profile_cpu: "/api/v1/performance/profile/cpu",
  profile_memory: "/api/v1/performance/profile/memory",
  optimize_cache: "/api/v1/performance/optimize/cache",
  monitor_system: "/api/v1/performance/monitor/system",
  run_benchmark: "/api/v1/performance/benchmark"
};

// Made with Bob

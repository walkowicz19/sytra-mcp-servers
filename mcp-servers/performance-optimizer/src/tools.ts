import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "profile_cpu",
    description: "Profile CPU usage of code or system. Identifies CPU-intensive operations and bottlenecks.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Code to profile (optional if profiling running system)"
        },
        language: {
          type: "string",
          description: "Programming language",
          default: "python"
        },
        duration: {
          type: "integer",
          description: "Profiling duration in seconds",
          default: 10,
          minimum: 1,
          maximum: 300
        },
        sampling_interval: {
          type: "number",
          description: "Sampling interval in milliseconds",
          default: 10,
          minimum: 1,
          maximum: 1000
        },
        include_call_graph: {
          type: "boolean",
          description: "Include call graph in results",
          default: true
        },
        threshold_percent: {
          type: "number",
          description: "Only show functions using more than this % of CPU",
          default: 1,
          minimum: 0,
          maximum: 100
        }
      },
      required: []
    }
  },
  {
    name: "profile_memory",
    description: "Profile memory usage and identify memory leaks or inefficient allocations.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Code to profile (optional if profiling running system)"
        },
        language: {
          type: "string",
          description: "Programming language",
          default: "python"
        },
        duration: {
          type: "integer",
          description: "Profiling duration in seconds",
          default: 10,
          minimum: 1,
          maximum: 300
        },
        track_allocations: {
          type: "boolean",
          description: "Track individual allocations",
          default: true
        },
        detect_leaks: {
          type: "boolean",
          description: "Detect memory leaks",
          default: true
        },
        snapshot_interval: {
          type: "integer",
          description: "Interval between memory snapshots in seconds",
          default: 1,
          minimum: 1,
          maximum: 60
        },
        include_traceback: {
          type: "boolean",
          description: "Include allocation tracebacks",
          default: true
        }
      },
      required: []
    }
  },
  {
    name: "optimize_cache",
    description: "Optimize caching strategy based on access patterns. Suggests cache sizes, eviction policies, and improvements.",
    inputSchema: {
      type: "object",
      properties: {
        access_pattern: {
          type: "string",
          description: "Description of access pattern or log data"
        },
        current_cache_config: {
          type: "object",
          description: "Current cache configuration",
          properties: {
            size: { type: "integer" },
            eviction_policy: { type: "string" },
            ttl: { type: "integer" }
          }
        },
        optimization_goals: {
          type: "array",
          items: {
            type: "string",
            enum: ["hit_rate", "latency", "memory_usage", "cost"]
          },
          description: "Optimization goals"
        },
        constraints: {
          type: "object",
          description: "Optimization constraints",
          properties: {
            max_memory_mb: { type: "integer" },
            max_latency_ms: { type: "number" },
            budget: { type: "number" }
          }
        },
        cache_type: {
          type: "string",
          enum: ["in_memory", "distributed", "cdn", "database"],
          description: "Type of cache",
          default: "in_memory"
        }
      },
      required: []
    }
  },
  {
    name: "monitor_system",
    description: "Get comprehensive system metrics including CPU, memory, disk, and network usage.",
    inputSchema: {
      type: "object",
      properties: {
        duration: {
          type: "integer",
          description: "Monitoring duration in seconds",
          default: 60,
          minimum: 1,
          maximum: 3600
        },
        interval: {
          type: "integer",
          description: "Sampling interval in seconds",
          default: 5,
          minimum: 1,
          maximum: 60
        },
        metrics: {
          type: "array",
          items: {
            type: "string",
            enum: ["cpu", "memory", "disk", "network", "processes", "gpu"]
          },
          description: "Metrics to collect",
          default: ["cpu", "memory", "disk", "network"]
        },
        include_processes: {
          type: "boolean",
          description: "Include per-process metrics",
          default: false
        },
        alert_thresholds: {
          type: "object",
          description: "Alert thresholds",
          properties: {
            cpu_percent: { type: "number" },
            memory_percent: { type: "number" },
            disk_percent: { type: "number" }
          }
        }
      },
      required: []
    }
  },
  {
    name: "run_benchmark",
    description: "Run performance benchmarks on code or system. Compares against baselines and provides detailed metrics.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Code to benchmark"
        },
        language: {
          type: "string",
          description: "Programming language",
          default: "python"
        },
        benchmark_type: {
          type: "string",
          enum: ["throughput", "latency", "scalability", "stress", "endurance"],
          description: "Type of benchmark",
          default: "throughput"
        },
        iterations: {
          type: "integer",
          description: "Number of iterations",
          default: 1000,
          minimum: 1,
          maximum: 1000000
        },
        warmup_iterations: {
          type: "integer",
          description: "Number of warmup iterations",
          default: 100,
          minimum: 0,
          maximum: 10000
        },
        concurrency: {
          type: "integer",
          description: "Number of concurrent executions",
          default: 1,
          minimum: 1,
          maximum: 1000
        },
        compare_to_baseline: {
          type: "boolean",
          description: "Compare results to baseline",
          default: false
        },
        baseline_id: {
          type: "string",
          description: "Baseline identifier for comparison"
        },
        include_percentiles: {
          type: "boolean",
          description: "Include percentile statistics",
          default: true
        }
      },
      required: []
    }
  }
];

// Made with Bob

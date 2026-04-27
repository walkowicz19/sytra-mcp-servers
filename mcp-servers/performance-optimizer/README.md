# Stark Performance Optimizer MCP Server

MCP server for the Stark Performance Optimizer service, providing comprehensive performance profiling, monitoring, and optimization tools.

## Features

- **CPU Profiling**: Profile CPU usage and identify bottlenecks
- **Memory Profiling**: Track memory usage and detect leaks
- **Cache Optimization**: Optimize caching strategies
- **System Monitoring**: Real-time system metrics
- **Benchmarking**: Run performance benchmarks with detailed metrics

## Installation

```bash
cd mcp-servers/performance-optimizer
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `PERFORMANCE_API_URL`: URL of the Performance Optimizer service (default: `http://localhost:8009`)

## Available Tools

### profile_cpu

Profile CPU usage of code or system to identify bottlenecks.

**Parameters:**
- `code` (optional): Code to profile
- `language` (optional): Programming language (default: "python")
- `duration` (optional): Profiling duration in seconds (default: 10, max: 300)
- `sampling_interval` (optional): Sampling interval in ms (default: 10, max: 1000)
- `include_call_graph` (optional): Include call graph (default: true)
- `threshold_percent` (optional): Only show functions using more than this % of CPU (default: 1)

**Example:**
```json
{
  "code": "def compute():\n    result = sum(range(1000000))\n    return result",
  "language": "python",
  "duration": 30,
  "include_call_graph": true,
  "threshold_percent": 2
}
```

### profile_memory

Profile memory usage and identify memory leaks or inefficient allocations.

**Parameters:**
- `code` (optional): Code to profile
- `language` (optional): Programming language (default: "python")
- `duration` (optional): Profiling duration in seconds (default: 10, max: 300)
- `track_allocations` (optional): Track individual allocations (default: true)
- `detect_leaks` (optional): Detect memory leaks (default: true)
- `snapshot_interval` (optional): Interval between snapshots in seconds (default: 1, max: 60)
- `include_traceback` (optional): Include allocation tracebacks (default: true)

**Example:**
```json
{
  "code": "data = []\nfor i in range(10000):\n    data.append([0] * 1000)",
  "language": "python",
  "duration": 20,
  "detect_leaks": true,
  "include_traceback": true
}
```

### optimize_cache

Optimize caching strategy based on access patterns.

**Parameters:**
- `access_pattern` (optional): Description of access pattern or log data
- `current_cache_config` (optional): Current cache configuration
  - `size`: Cache size
  - `eviction_policy`: Eviction policy
  - `ttl`: Time to live
- `optimization_goals` (optional): Array of goals - "hit_rate", "latency", "memory_usage", "cost"
- `constraints` (optional): Optimization constraints
  - `max_memory_mb`: Maximum memory
  - `max_latency_ms`: Maximum latency
  - `budget`: Budget constraint
- `cache_type` (optional): Type - "in_memory", "distributed", "cdn", "database" (default: "in_memory")

**Example:**
```json
{
  "access_pattern": "High read frequency with 80/20 distribution",
  "current_cache_config": {
    "size": 1000,
    "eviction_policy": "LRU",
    "ttl": 3600
  },
  "optimization_goals": ["hit_rate", "latency"],
  "constraints": {
    "max_memory_mb": 512,
    "max_latency_ms": 10
  },
  "cache_type": "in_memory"
}
```

### monitor_system

Get comprehensive system metrics including CPU, memory, disk, and network usage.

**Parameters:**
- `duration` (optional): Monitoring duration in seconds (default: 60, max: 3600)
- `interval` (optional): Sampling interval in seconds (default: 5, max: 60)
- `metrics` (optional): Array of metrics - "cpu", "memory", "disk", "network", "processes", "gpu" (default: ["cpu", "memory", "disk", "network"])
- `include_processes` (optional): Include per-process metrics (default: false)
- `alert_thresholds` (optional): Alert thresholds
  - `cpu_percent`: CPU threshold
  - `memory_percent`: Memory threshold
  - `disk_percent`: Disk threshold

**Example:**
```json
{
  "duration": 120,
  "interval": 10,
  "metrics": ["cpu", "memory", "disk", "network"],
  "include_processes": true,
  "alert_thresholds": {
    "cpu_percent": 80,
    "memory_percent": 90,
    "disk_percent": 85
  }
}
```

### run_benchmark

Run performance benchmarks on code or system with detailed metrics.

**Parameters:**
- `code` (optional): Code to benchmark
- `language` (optional): Programming language (default: "python")
- `benchmark_type` (optional): Type - "throughput", "latency", "scalability", "stress", "endurance" (default: "throughput")
- `iterations` (optional): Number of iterations (default: 1000, max: 1000000)
- `warmup_iterations` (optional): Number of warmup iterations (default: 100, max: 10000)
- `concurrency` (optional): Number of concurrent executions (default: 1, max: 1000)
- `compare_to_baseline` (optional): Compare to baseline (default: false)
- `baseline_id` (optional): Baseline identifier for comparison
- `include_percentiles` (optional): Include percentile statistics (default: true)

**Example:**
```json
{
  "code": "def process_data(data):\n    return sorted(data)",
  "language": "python",
  "benchmark_type": "throughput",
  "iterations": 10000,
  "warmup_iterations": 500,
  "concurrency": 4,
  "compare_to_baseline": true,
  "baseline_id": "v1.0",
  "include_percentiles": true
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "stark-performance": {
      "command": "node",
      "args": ["/path/to/mcp-servers/performance-optimizer/dist/index.js"],
      "env": {
        "PERFORMANCE_API_URL": "http://localhost:8009"
      }
    }
  }
}
```

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Start
npm start
```

## API Endpoints

The server communicates with these Performance Optimizer API endpoints:

- `POST /api/v1/performance/profile/cpu` - Profile CPU usage
- `POST /api/v1/performance/profile/memory` - Profile memory usage
- `POST /api/v1/performance/optimize/cache` - Optimize cache
- `POST /api/v1/performance/monitor/system` - Monitor system
- `POST /api/v1/performance/benchmark` - Run benchmark

## License

MIT
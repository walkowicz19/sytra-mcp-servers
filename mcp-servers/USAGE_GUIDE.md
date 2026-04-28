# Stark MCP Servers - Usage Guide

This guide provides examples of how to use each Stark MCP server through Claude Desktop or other MCP clients.

## Orchestrator

### Route Request

```
Route this request to the appropriate server: "Analyze this Python code for security vulnerabilities"
```

### Execute Workflow

```
Execute the legacy-modernization workflow for a COBOL banking system
```

### Get Available Tools

```
List all available tools across all servers
```

### Coordinate Multi-Server Task

```
Coordinate a task that requires code generation, security scanning, and performance profiling
```

## Intelligence Amplification

### Analyze Code Structure

```
Analyze the structure of this Python module:
[code content]
```

### Detect Code Patterns

```
Detect design patterns in this codebase: [code]
```

### Suggest Refactoring

```
Suggest refactoring improvements for this function:
def process_data(data):
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    return result
```

### Extract Code Metrics

```
Extract complexity metrics from this codebase
```

## Schema Intelligence

### Analyze Schema

```
Analyze this database schema:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Optimize Schema

```
Suggest optimizations for this database schema with 1M+ records
```

### Generate Migration

```
Generate a migration plan to add full-text search to the products table
```

### Validate Schema

```
Validate this schema for best practices and potential issues
```

## Security Guardrails

### Classify Data Sensitivity

```
Classify this data: "John Doe, SSN: 123-45-6789, lives at 123 Main St"
```

### Check File Access

```
Check if user 'john.doe' can read the file '/secure/data/financial_records.csv'
```

### Scan for Sensitive Data

```
Scan this code for sensitive data:
```python
api_key = "sk-1234567890abcdef"
password = "MySecretPass123"
```
```

### Encrypt Data

```
Encrypt this sensitive information: "Credit Card: 4532-1234-5678-9010"
```

## Code Generation

### Generate Code

```
Generate a Python function that calculates the Fibonacci sequence up to n terms
```

### Validate Code

```
Validate this Python code:
def add(a, b)
    return a + b
```

### Run in Sandbox

```
Run this Python code in a sandbox:
print("Hello, World!")
for i in range(5):
    print(f"Count: {i}")
```

### Analyze Code Quality

```
Analyze this code for complexity and maintainability:
def complex_function(x, y, z):
    if x > 0:
        if y > 0:
            if z > 0:
                return x + y + z
            else:
                return x + y
        else:
            return x
    return 0
```

## Memory Management

### Store Memory

```
Store this information: "The project deadline is December 15th, 2024"
```

### Retrieve Memories

```
What do you remember about project deadlines?
```

### Search Memories

```
Search for all memories related to "API integration"
```

### Compress Context

```
Compress this long conversation while preserving key points: [long text]
```

## Intelligence Amplification

### Optimize Prompt

```
Optimize this prompt for better results: "write code"
```

### RAG Query

```
Query the knowledge base about "microservices architecture best practices"
```

### Chain of Thought Reasoning

```
Use chain-of-thought to solve: "If a train travels 60 mph for 2.5 hours, how far does it go?"
```

### Decompose Task

```
Break down this task: "Build a full-stack web application with authentication"
```

## Token Optimization

### Count Tokens

```
Count tokens in this text: "The quick brown fox jumps over the lazy dog"
```

### Optimize Context

```
Optimize this context window to fit within 4000 tokens: [large text]
```

### Compress Text

```
Compress this text semantically: [long document]
```

### Summarize Content

```
Summarize this article: [article text]
```

## SDLC Integration

### Analyze Requirements

```
Analyze these requirements:
- User authentication with OAuth2
- RESTful API with CRUD operations
- PostgreSQL database
- Docker deployment
```

### Suggest Design Patterns

```
Suggest design patterns for a notification system that needs to support email, SMS, and push notifications
```

### Review Code

```
Review this code:
class UserService:
    def get_user(self, id):
        return db.query(User).filter(User.id == id).first()
```

### Generate Tests

```
Generate test cases for this function:
def calculate_discount(price, discount_percent):
    return price * (1 - discount_percent / 100)
```

## Legacy Support

### Parse COBOL

```
Parse this COBOL code:
IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.
PROCEDURE DIVISION.
    DISPLAY 'Hello, World!'.
    STOP RUN.
```

### Translate COBOL to Python

```
Translate this COBOL to Python:
COMPUTE TOTAL = PRICE * QUANTITY.
```

### Analyze Dependencies

```
Analyze dependencies in this legacy codebase: [code]
```

### Generate Migration Plan

```
Generate a migration plan for moving from COBOL to Java for a banking application
```

## Performance Optimizer

### Profile CPU Usage

```
Profile CPU usage for this function: [code]
```

### Profile Memory

```
Profile memory usage for this application: [code]
```

### Optimize Cache

```
Suggest caching strategy for an e-commerce product catalog with 100,000 items
```

### Monitor System

```
Get current system metrics
```

### Run Benchmark

```
Benchmark this code:
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

## Combining Multiple Servers

You can use multiple servers together for complex workflows:

### Example 1: Secure Code Development
```
1. Generate a Python function for user authentication (Code Generation)
2. Scan it for security vulnerabilities (Security Guardrails)
3. Analyze its complexity (Intelligence Amplification)
4. Generate test cases (SDLC Integration)
5. Profile its performance (Performance Optimizer)
```

### Example 2: Legacy System Modernization
```
1. Parse legacy COBOL code (Legacy Support)
2. Analyze database schema (Schema Intelligence)
3. Generate migration plan (Legacy Support)
4. Translate to modern language (Legacy Support)
5. Optimize performance (Performance Optimizer)
```

### Example 3: Using Orchestrator
```
Execute the full-sdlc-cycle workflow which automatically:
1. Analyzes requirements
2. Generates code
3. Reviews security
4. Creates tests
5. Optimizes performance
6. Generates documentation
```

## Best Practices

1. **Be Specific**: Provide clear, detailed requests
2. **Use Context**: Reference previous interactions when relevant
3. **Iterate**: Refine results based on feedback
4. **Combine Tools**: Use multiple servers for comprehensive solutions
5. **Validate Results**: Always review generated code and suggestions

## Tips

- Use Security Guardrails before deploying any code
- Store important context in Memory Management for long sessions
- Use Intelligence Amplification for complex reasoning tasks
- Optimize tokens when working with large documents
- Profile performance for production code

## Getting Help

- Check individual server READMEs for detailed tool documentation
- Review the [Troubleshooting Guide](TROUBLESHOOTING.md)
- Check server logs for error messages
- Verify services are running on correct ports
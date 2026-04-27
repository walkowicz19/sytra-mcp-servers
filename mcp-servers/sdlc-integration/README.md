# Stark SDLC Integration MCP Server

MCP server for the Stark SDLC Integration service, providing comprehensive software development lifecycle tools including requirements analysis, code review, test generation, and documentation.

## Features

- **Requirements Analysis**: Analyze requirements for completeness and clarity
- **Design Patterns**: Suggest appropriate design patterns
- **Code Review**: Automated code review for bugs and best practices
- **Test Generation**: Generate comprehensive test cases
- **Technical Debt**: Track and manage technical debt
- **Documentation**: Generate API docs, README files, and more

## Installation

```bash
cd mcp-servers/sdlc-integration
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `SDLC_API_URL`: URL of the SDLC Integration service (default: `http://localhost:8006`)

## Available Tools

### analyze_requirements

Analyze software requirements for completeness, clarity, and feasibility.

**Parameters:**
- `requirements` (required): The requirements document or text
- `analysis_type` (optional): Type - "functional", "non_functional", or "comprehensive" (default: "comprehensive")
- `check_for` (optional): Array of aspects - "completeness", "clarity", "consistency", "feasibility", "testability"
- `domain` (optional): Application domain (e.g., "web", "mobile", "embedded")

**Example:**
```json
{
  "requirements": "The system shall allow users to login with username and password...",
  "analysis_type": "comprehensive",
  "check_for": ["completeness", "clarity", "testability"],
  "domain": "web"
}
```

### suggest_design_patterns

Suggest appropriate design patterns based on requirements and code structure.

**Parameters:**
- `problem_description` (required): Description of the design problem
- `code_context` (optional): Existing code context
- `language` (optional): Programming language (default: "python")
- `constraints` (optional): Array of design constraints
- `pattern_categories` (optional): Array of categories - "creational", "structural", "behavioral", "architectural"

**Example:**
```json
{
  "problem_description": "Need to create different types of database connections based on configuration",
  "language": "python",
  "constraints": ["must be thread-safe", "support connection pooling"],
  "pattern_categories": ["creational"]
}
```

### review_code

Perform automated code review checking for bugs, security issues, and best practices.

**Parameters:**
- `code` (required): The code to review
- `language` (optional): Programming language (default: "python")
- `review_focus` (optional): Array of areas - "security", "performance", "maintainability", "bugs", "style", "documentation"
- `severity_threshold` (optional): Minimum severity - "low", "medium", "high", "critical" (default: "medium")
- `include_suggestions` (optional): Include fix suggestions (default: true)

**Example:**
```json
{
  "code": "def process_data(data):\n    result = []\n    for item in data:\n        result.append(item * 2)\n    return result",
  "language": "python",
  "review_focus": ["performance", "maintainability"],
  "severity_threshold": "low",
  "include_suggestions": true
}
```

### generate_tests

Generate test cases for code including unit tests, integration tests, and edge cases.

**Parameters:**
- `code` (required): The code to generate tests for
- `language` (optional): Programming language (default: "python")
- `test_framework` (optional): Testing framework (e.g., "pytest", "jest", "junit")
- `test_types` (optional): Array of types - "unit", "integration", "edge_cases", "error_handling", "performance" (default: ["unit", "edge_cases"])
- `coverage_target` (optional): Target coverage percentage 0-100 (default: 80)
- `include_mocks` (optional): Include mock objects (default: true)

**Example:**
```json
{
  "code": "class UserService:\n    def create_user(self, username, email):\n        # implementation\n        pass",
  "language": "python",
  "test_framework": "pytest",
  "test_types": ["unit", "edge_cases", "error_handling"],
  "coverage_target": 90,
  "include_mocks": true
}
```

### track_tech_debt

Track and analyze technical debt in codebase.

**Parameters:**
- `code_or_description` (required): Code snippet or description of technical debt
- `debt_type` (optional): Type - "code_quality", "architecture", "documentation", "testing", "security", "performance"
- `action` (optional): Action - "add", "update", "list", "prioritize" (default: "add")
- `project_id` (optional): Project identifier
- `metadata` (optional): Additional metadata
  - `severity`: "low", "medium", "high", "critical"
  - `estimated_effort`: Estimated effort to resolve
  - `impact`: Impact on system

**Example:**
```json
{
  "code_or_description": "Legacy authentication module needs refactoring",
  "debt_type": "architecture",
  "action": "add",
  "project_id": "main-app",
  "metadata": {
    "severity": "high",
    "estimated_effort": "2 weeks",
    "impact": "Security and maintainability concerns"
  }
}
```

### generate_documentation

Generate comprehensive documentation for code.

**Parameters:**
- `code` (required): The code to document
- `language` (optional): Programming language (default: "python")
- `doc_type` (optional): Type - "api", "readme", "inline", "architecture", "user_guide" (default: "api")
- `doc_format` (optional): Format - "markdown", "rst", "html", "docstring" (default: "markdown")
- `include_examples` (optional): Include usage examples (default: true)
- `detail_level` (optional): Level - "brief", "standard", "detailed" (default: "standard")

**Example:**
```json
{
  "code": "class DataProcessor:\n    def process(self, data):\n        pass",
  "language": "python",
  "doc_type": "api",
  "doc_format": "markdown",
  "include_examples": true,
  "detail_level": "detailed"
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "stark-sdlc": {
      "command": "node",
      "args": ["/path/to/mcp-servers/sdlc-integration/dist/index.js"],
      "env": {
        "SDLC_API_URL": "http://localhost:8006"
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

The server communicates with these SDLC Integration API endpoints:

- `POST /api/v1/sdlc/analyze-requirements` - Analyze requirements
- `POST /api/v1/sdlc/suggest-patterns` - Suggest design patterns
- `POST /api/v1/sdlc/review-code` - Review code
- `POST /api/v1/sdlc/generate-tests` - Generate tests
- `POST /api/v1/sdlc/track-debt` - Track technical debt
- `POST /api/v1/sdlc/generate-docs` - Generate documentation

## License

MIT
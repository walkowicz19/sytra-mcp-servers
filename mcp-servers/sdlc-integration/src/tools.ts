import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "analyze_requirements",
    description: "Analyze software requirements for completeness, clarity, and feasibility. Identifies ambiguities, conflicts, and missing information.",
    inputSchema: {
      type: "object",
      properties: {
        requirements: {
          type: "string",
          description: "The requirements document or text to analyze"
        },
        analysis_type: {
          type: "string",
          enum: ["functional", "non_functional", "comprehensive"],
          description: "Type of requirements analysis",
          default: "comprehensive"
        },
        check_for: {
          type: "array",
          items: {
            type: "string",
            enum: ["completeness", "clarity", "consistency", "feasibility", "testability"]
          },
          description: "Specific aspects to check"
        },
        domain: {
          type: "string",
          description: "Application domain (e.g., 'web', 'mobile', 'embedded')"
        }
      },
      required: ["requirements"]
    }
  },
  {
    name: "suggest_design_patterns",
    description: "Suggest appropriate design patterns based on requirements and code structure. Provides pattern recommendations with implementation guidance.",
    inputSchema: {
      type: "object",
      properties: {
        problem_description: {
          type: "string",
          description: "Description of the design problem"
        },
        code_context: {
          type: "string",
          description: "Existing code context (optional)"
        },
        language: {
          type: "string",
          description: "Programming language",
          default: "python"
        },
        constraints: {
          type: "array",
          items: { type: "string" },
          description: "Design constraints or preferences"
        },
        pattern_categories: {
          type: "array",
          items: {
            type: "string",
            enum: ["creational", "structural", "behavioral", "architectural"]
          },
          description: "Pattern categories to consider"
        }
      },
      required: ["problem_description"]
    }
  },
  {
    name: "review_code",
    description: "Perform automated code review checking for bugs, security issues, code smells, and best practices violations.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to review"
        },
        language: {
          type: "string",
          description: "Programming language",
          default: "python"
        },
        review_focus: {
          type: "array",
          items: {
            type: "string",
            enum: ["security", "performance", "maintainability", "bugs", "style", "documentation"]
          },
          description: "Areas to focus the review on"
        },
        severity_threshold: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
          description: "Minimum severity level to report",
          default: "medium"
        },
        include_suggestions: {
          type: "boolean",
          description: "Include fix suggestions",
          default: true
        }
      },
      required: ["code"]
    }
  },
  {
    name: "generate_tests",
    description: "Generate test cases for code including unit tests, integration tests, and edge cases.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to generate tests for"
        },
        language: {
          type: "string",
          description: "Programming language",
          default: "python"
        },
        test_framework: {
          type: "string",
          description: "Testing framework to use (e.g., 'pytest', 'jest', 'junit')"
        },
        test_types: {
          type: "array",
          items: {
            type: "string",
            enum: ["unit", "integration", "edge_cases", "error_handling", "performance"]
          },
          description: "Types of tests to generate",
          default: ["unit", "edge_cases"]
        },
        coverage_target: {
          type: "number",
          description: "Target code coverage percentage",
          minimum: 0,
          maximum: 100,
          default: 80
        },
        include_mocks: {
          type: "boolean",
          description: "Include mock objects for dependencies",
          default: true
        }
      },
      required: ["code"]
    }
  },
  {
    name: "track_tech_debt",
    description: "Track and analyze technical debt in codebase. Identifies debt items, estimates impact, and suggests prioritization.",
    inputSchema: {
      type: "object",
      properties: {
        code_or_description: {
          type: "string",
          description: "Code snippet or description of technical debt"
        },
        debt_type: {
          type: "string",
          enum: ["code_quality", "architecture", "documentation", "testing", "security", "performance"],
          description: "Type of technical debt"
        },
        action: {
          type: "string",
          enum: ["add", "update", "list", "prioritize"],
          description: "Action to perform",
          default: "add"
        },
        project_id: {
          type: "string",
          description: "Project identifier"
        },
        metadata: {
          type: "object",
          description: "Additional metadata",
          properties: {
            severity: {
              type: "string",
              enum: ["low", "medium", "high", "critical"]
            },
            estimated_effort: {
              type: "string",
              description: "Estimated effort to resolve"
            },
            impact: {
              type: "string",
              description: "Impact on system"
            }
          }
        }
      },
      required: ["code_or_description"]
    }
  },
  {
    name: "generate_documentation",
    description: "Generate comprehensive documentation for code including API docs, README files, and inline comments.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to document"
        },
        language: {
          type: "string",
          description: "Programming language",
          default: "python"
        },
        doc_type: {
          type: "string",
          enum: ["api", "readme", "inline", "architecture", "user_guide"],
          description: "Type of documentation to generate",
          default: "api"
        },
        doc_format: {
          type: "string",
          enum: ["markdown", "rst", "html", "docstring"],
          description: "Documentation format",
          default: "markdown"
        },
        include_examples: {
          type: "boolean",
          description: "Include usage examples",
          default: true
        },
        detail_level: {
          type: "string",
          enum: ["brief", "standard", "detailed"],
          description: "Level of detail",
          default: "standard"
        }
      },
      required: ["code"]
    }
  }
];

// Made with Bob

export const tools = [
  {
    name: "generate_code",
    description: "Generate code from natural language requirements",
    inputSchema: {
      type: "object",
      properties: {
        requirements: {
          type: "string",
          description: "Natural language description of what the code should do"
        },
        language: {
          type: "string",
          enum: ["python", "javascript", "typescript", "java", "go", "rust"],
          description: "Programming language for generated code"
        },
        context: {
          type: "string",
          description: "Additional context or constraints"
        }
      },
      required: ["requirements", "language"]
    }
  },
  {
    name: "validate_code",
    description: "Validate generated code for syntax and semantic correctness",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Code to validate"
        },
        language: {
          type: "string",
          enum: ["python", "javascript", "typescript", "java", "go", "rust"],
          description: "Programming language of the code"
        }
      },
      required: ["code", "language"]
    }
  },
  {
    name: "run_in_sandbox",
    description: "Execute code in a secure sandbox environment",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Code to execute"
        },
        language: {
          type: "string",
          enum: ["python", "javascript", "typescript"],
          description: "Programming language"
        },
        input_data: {
          type: "string",
          description: "Input data for the code"
        },
        timeout: {
          type: "number",
          description: "Execution timeout in seconds",
          default: 30
        }
      },
      required: ["code", "language"]
    }
  },
  {
    name: "analyze_code",
    description: "Perform static code analysis for quality and best practices",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Code to analyze"
        },
        language: {
          type: "string",
          enum: ["python", "javascript", "typescript", "java", "go", "rust"],
          description: "Programming language"
        },
        checks: {
          type: "array",
          items: {
            type: "string",
            enum: ["complexity", "style", "performance", "maintainability"]
          },
          description: "Types of checks to perform"
        }
      },
      required: ["code", "language"]
    }
  },
  {
    name: "scan_security",
    description: "Scan code for security vulnerabilities",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Code to scan"
        },
        language: {
          type: "string",
          enum: ["python", "javascript", "typescript", "java", "go", "rust"],
          description: "Programming language"
        }
      },
      required: ["code", "language"]
    }
  }
];

// Made with Bob

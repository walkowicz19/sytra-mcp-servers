import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "parse_cobol",
    description: "Parse COBOL code to extract structure, data definitions, and program logic. Provides detailed AST and analysis.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The COBOL code to parse"
        },
        include_ast: {
          type: "boolean",
          description: "Include abstract syntax tree in output",
          default: true
        },
        extract_data_division: {
          type: "boolean",
          description: "Extract data division details",
          default: true
        },
        extract_procedure_division: {
          type: "boolean",
          description: "Extract procedure division details",
          default: true
        },
        identify_copybooks: {
          type: "boolean",
          description: "Identify COPY statements and dependencies",
          default: true
        }
      },
      required: ["code"]
    }
  },
  {
    name: "parse_fortran",
    description: "Parse Fortran code (F77, F90, F95) to extract structure, subroutines, and data types.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The Fortran code to parse"
        },
        fortran_version: {
          type: "string",
          enum: ["f77", "f90", "f95", "f2003", "f2008"],
          description: "Fortran version",
          default: "f90"
        },
        include_ast: {
          type: "boolean",
          description: "Include abstract syntax tree",
          default: true
        },
        extract_modules: {
          type: "boolean",
          description: "Extract module definitions",
          default: true
        },
        extract_subroutines: {
          type: "boolean",
          description: "Extract subroutine definitions",
          default: true
        }
      },
      required: ["code"]
    }
  },
  {
    name: "translate_cobol_to_python",
    description: "Translate COBOL code to Python, preserving business logic and data structures.",
    inputSchema: {
      type: "object",
      properties: {
        cobol_code: {
          type: "string",
          description: "The COBOL code to translate"
        },
        target_python_version: {
          type: "string",
          description: "Target Python version (e.g., '3.9', '3.10', '3.11')",
          default: "3.11"
        },
        preserve_comments: {
          type: "boolean",
          description: "Preserve original comments",
          default: true
        },
        use_type_hints: {
          type: "boolean",
          description: "Add Python type hints",
          default: true
        },
        modernize_patterns: {
          type: "boolean",
          description: "Use modern Python patterns",
          default: true
        },
        include_tests: {
          type: "boolean",
          description: "Generate unit tests",
          default: false
        }
      },
      required: ["cobol_code"]
    }
  },
  {
    name: "translate_cobol_to_java",
    description: "Translate COBOL code to Java, maintaining business logic and creating appropriate class structures.",
    inputSchema: {
      type: "object",
      properties: {
        cobol_code: {
          type: "string",
          description: "The COBOL code to translate"
        },
        target_java_version: {
          type: "string",
          description: "Target Java version (e.g., '11', '17', '21')",
          default: "17"
        },
        package_name: {
          type: "string",
          description: "Java package name for generated classes"
        },
        use_spring: {
          type: "boolean",
          description: "Use Spring Framework patterns",
          default: false
        },
        preserve_comments: {
          type: "boolean",
          description: "Preserve original comments",
          default: true
        },
        generate_interfaces: {
          type: "boolean",
          description: "Generate interfaces for main components",
          default: true
        },
        include_tests: {
          type: "boolean",
          description: "Generate JUnit tests",
          default: false
        }
      },
      required: ["cobol_code"]
    }
  },
  {
    name: "analyze_dependencies",
    description: "Analyze code dependencies including COPY statements, CALL statements, and external references.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The legacy code to analyze"
        },
        language: {
          type: "string",
          enum: ["cobol", "fortran", "pl1", "rpg", "assembly"],
          description: "Source language",
          default: "cobol"
        },
        include_external_deps: {
          type: "boolean",
          description: "Include external dependencies",
          default: true
        },
        include_data_deps: {
          type: "boolean",
          description: "Include data dependencies",
          default: true
        },
        generate_graph: {
          type: "boolean",
          description: "Generate dependency graph",
          default: true
        },
        depth: {
          type: "integer",
          description: "Analysis depth for transitive dependencies",
          default: 3,
          minimum: 1,
          maximum: 10
        }
      },
      required: ["code"]
    }
  },
  {
    name: "generate_migration_plan",
    description: "Generate a comprehensive migration plan for legacy code modernization.",
    inputSchema: {
      type: "object",
      properties: {
        source_code: {
          type: "string",
          description: "The legacy source code or description"
        },
        source_language: {
          type: "string",
          enum: ["cobol", "fortran", "pl1", "rpg", "assembly"],
          description: "Source language"
        },
        target_language: {
          type: "string",
          enum: ["python", "java", "csharp", "javascript", "go"],
          description: "Target language"
        },
        migration_strategy: {
          type: "string",
          enum: ["big_bang", "incremental", "strangler_fig", "parallel_run"],
          description: "Migration strategy",
          default: "incremental"
        },
        include_risk_analysis: {
          type: "boolean",
          description: "Include risk analysis",
          default: true
        },
        include_timeline: {
          type: "boolean",
          description: "Include estimated timeline",
          default: true
        },
        include_resource_estimate: {
          type: "boolean",
          description: "Include resource estimates",
          default: true
        },
        complexity_threshold: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Complexity threshold for detailed analysis",
          default: "medium"
        }
      },
      required: ["source_code", "source_language", "target_language"]
    }
  }
];

// Made with Bob

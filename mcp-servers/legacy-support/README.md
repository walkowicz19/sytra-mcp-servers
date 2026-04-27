# Stark Legacy Support MCP Server

MCP server for the Stark Legacy Support service, providing tools for parsing, translating, and migrating legacy code from COBOL, Fortran, and other mainframe languages.

## Features

- **COBOL Parsing**: Parse and analyze COBOL code structure
- **Fortran Parsing**: Parse Fortran code (F77, F90, F95+)
- **Code Translation**: Translate COBOL to Python or Java
- **Dependency Analysis**: Analyze code dependencies and relationships
- **Migration Planning**: Generate comprehensive migration plans

## Installation

```bash
cd mcp-servers/legacy-support
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `LEGACY_API_URL`: URL of the Legacy Support service (default: `http://localhost:8007`)

## Available Tools

### parse_cobol

Parse COBOL code to extract structure, data definitions, and program logic.

**Parameters:**
- `code` (required): The COBOL code to parse
- `include_ast` (optional): Include abstract syntax tree (default: true)
- `extract_data_division` (optional): Extract data division details (default: true)
- `extract_procedure_division` (optional): Extract procedure division details (default: true)
- `identify_copybooks` (optional): Identify COPY statements (default: true)

**Example:**
```json
{
  "code": "IDENTIFICATION DIVISION.\nPROGRAM-ID. SAMPLE.\n...",
  "include_ast": true,
  "extract_data_division": true,
  "identify_copybooks": true
}
```

### parse_fortran

Parse Fortran code to extract structure, subroutines, and data types.

**Parameters:**
- `code` (required): The Fortran code to parse
- `fortran_version` (optional): Version - "f77", "f90", "f95", "f2003", "f2008" (default: "f90")
- `include_ast` (optional): Include abstract syntax tree (default: true)
- `extract_modules` (optional): Extract module definitions (default: true)
- `extract_subroutines` (optional): Extract subroutine definitions (default: true)

**Example:**
```json
{
  "code": "PROGRAM example\n  IMPLICIT NONE\n  ...",
  "fortran_version": "f90",
  "include_ast": true,
  "extract_modules": true
}
```

### translate_cobol_to_python

Translate COBOL code to Python, preserving business logic.

**Parameters:**
- `cobol_code` (required): The COBOL code to translate
- `target_python_version` (optional): Target Python version (default: "3.11")
- `preserve_comments` (optional): Preserve original comments (default: true)
- `use_type_hints` (optional): Add Python type hints (default: true)
- `modernize_patterns` (optional): Use modern Python patterns (default: true)
- `include_tests` (optional): Generate unit tests (default: false)

**Example:**
```json
{
  "cobol_code": "IDENTIFICATION DIVISION.\nPROGRAM-ID. CALC.\n...",
  "target_python_version": "3.11",
  "use_type_hints": true,
  "modernize_patterns": true,
  "include_tests": true
}
```

### translate_cobol_to_java

Translate COBOL code to Java, maintaining business logic.

**Parameters:**
- `cobol_code` (required): The COBOL code to translate
- `target_java_version` (optional): Target Java version (default: "17")
- `package_name` (optional): Java package name
- `use_spring` (optional): Use Spring Framework patterns (default: false)
- `preserve_comments` (optional): Preserve original comments (default: true)
- `generate_interfaces` (optional): Generate interfaces (default: true)
- `include_tests` (optional): Generate JUnit tests (default: false)

**Example:**
```json
{
  "cobol_code": "IDENTIFICATION DIVISION.\nPROGRAM-ID. PROCESS.\n...",
  "target_java_version": "17",
  "package_name": "com.example.legacy",
  "use_spring": true,
  "include_tests": true
}
```

### analyze_dependencies

Analyze code dependencies including COPY statements and external references.

**Parameters:**
- `code` (required): The legacy code to analyze
- `language` (optional): Source language - "cobol", "fortran", "pl1", "rpg", "assembly" (default: "cobol")
- `include_external_deps` (optional): Include external dependencies (default: true)
- `include_data_deps` (optional): Include data dependencies (default: true)
- `generate_graph` (optional): Generate dependency graph (default: true)
- `depth` (optional): Analysis depth for transitive dependencies (default: 3, max: 10)

**Example:**
```json
{
  "code": "COPY CUSTOMER-RECORD.\nCALL 'VALIDATE' USING WS-DATA.\n...",
  "language": "cobol",
  "include_external_deps": true,
  "generate_graph": true,
  "depth": 5
}
```

### generate_migration_plan

Generate a comprehensive migration plan for legacy code modernization.

**Parameters:**
- `source_code` (required): The legacy source code or description
- `source_language` (required): Source language - "cobol", "fortran", "pl1", "rpg", "assembly"
- `target_language` (required): Target language - "python", "java", "csharp", "javascript", "go"
- `migration_strategy` (optional): Strategy - "big_bang", "incremental", "strangler_fig", "parallel_run" (default: "incremental")
- `include_risk_analysis` (optional): Include risk analysis (default: true)
- `include_timeline` (optional): Include estimated timeline (default: true)
- `include_resource_estimate` (optional): Include resource estimates (default: true)
- `complexity_threshold` (optional): Complexity threshold - "low", "medium", "high" (default: "medium")

**Example:**
```json
{
  "source_code": "Large COBOL batch processing system with 50+ programs",
  "source_language": "cobol",
  "target_language": "python",
  "migration_strategy": "strangler_fig",
  "include_risk_analysis": true,
  "include_timeline": true,
  "complexity_threshold": "high"
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "stark-legacy": {
      "command": "node",
      "args": ["/path/to/mcp-servers/legacy-support/dist/index.js"],
      "env": {
        "LEGACY_API_URL": "http://localhost:8007"
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

The server communicates with these Legacy Support API endpoints:

- `POST /api/v1/legacy/parse/cobol` - Parse COBOL code
- `POST /api/v1/legacy/parse/fortran` - Parse Fortran code
- `POST /api/v1/legacy/translate/cobol-to-python` - Translate COBOL to Python
- `POST /api/v1/legacy/translate/cobol-to-java` - Translate COBOL to Java
- `POST /api/v1/legacy/analyze/dependencies` - Analyze dependencies
- `POST /api/v1/legacy/migration/plan` - Generate migration plan

## License

MIT
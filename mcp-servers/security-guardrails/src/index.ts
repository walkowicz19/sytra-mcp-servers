#!/usr/bin/env node

/**
 * Security Guardrails MCP Server
 * 
 * Provides data classification, access control, encryption, and audit logging
 * capabilities through the Model Context Protocol.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools.js";
import { callTool } from "./client.js";

/**
 * Create MCP server instance
 */
const server = new Server(
  {
    name: "stark-security-guardrails",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Handler for tool execution requests
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    return await callTool(name, args || {});
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${error}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr to avoid interfering with MCP communication
  console.error("Stark Security Guardrails MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

// Made with Bob

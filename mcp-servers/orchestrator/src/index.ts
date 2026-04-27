#!/usr/bin/env node

/**
 * Stark Orchestrator MCP Server
 * Main entry point for the orchestrator with intelligent routing and workflow engine
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { tools, toolHandlers } from './tools.js';
import { logger } from './utils/logger.js';
import { ErrorHandler } from './utils/error-handler.js';

/**
 * Create and configure the MCP server
 */
async function main() {
  logger.info('Starting Stark Orchestrator MCP Server');

  const server = new Server(
    {
      name: 'stark-orchestrator',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  /**
   * List available tools
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug('Listing tools');
    
    return {
      tools: tools as Tool[],
    };
  });

  /**
   * Handle tool execution
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    logger.info('Tool execution requested', { tool: name });

    try {
      // Get the appropriate handler
      const handler = toolHandlers[name as keyof typeof toolHandlers];

      if (!handler) {
        throw new Error(`Unknown tool: ${name}`);
      }

      // Execute the tool
      const result = await handler(args || {});

      logger.info('Tool execution completed', { tool: name });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error('Tool execution failed', error as Error, { tool: name });

      const sanitizedError = ErrorHandler.sanitizeError(error as Error);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: sanitizedError.message,
              details: sanitizedError,
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  /**
   * Start the server
   */
  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info('Stark Orchestrator MCP Server started successfully');

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Shutting down Stark Orchestrator MCP Server');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Shutting down Stark Orchestrator MCP Server');
    await server.close();
    process.exit(0);
  });
}

// Run the server
main().catch((error) => {
  logger.error('Fatal error starting server', error);
  process.exit(1);
});

// Made with Bob

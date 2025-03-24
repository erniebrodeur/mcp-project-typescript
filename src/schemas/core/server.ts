import { z } from 'zod';

/**
 * Server Configuration Schemas
 * Defines structure for MCP server configuration
 */

// Server options schema
export const serverOptionsSchema = z.object({
  name: z.string(),
  version: z.string(),
  maxRequestSize: z.number().optional(),
  timeout: z.number().optional(),
  securityOptions: z.object({
    validatePaths: z.boolean().optional(),
    approvedDirectories: z.array(z.string()).optional(),
    projectRoots: z.array(z.string()).optional(),
  }).optional(),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).optional(),
});

// Server capabilities schema
export const serverCapabilitiesSchema = z.object({
  resources: z.object({}).optional(),
  tools: z.object({}).optional(),
  prompts: z.object({}).optional(),
});

// Request handler signature
export type RequestHandler<Request, Response> = (
  request: Request
) => Promise<Response>;

// TypeScript types
export type ServerOptions = z.infer<typeof serverOptionsSchema>;
export type ServerCapabilities = z.infer<typeof serverCapabilitiesSchema>;

// Helper function to create default server options
export function createDefaultServerOptions(
  name: string,
  version: string
): ServerOptions {
  return {
    name,
    version,
    maxRequestSize: 1024 * 1024, // 1MB
    timeout: 30000, // 30 seconds
    securityOptions: {
      validatePaths: true,
      approvedDirectories: [],
      projectRoots: [process.cwd()],
    },
    logLevel: 'info',
  };
}

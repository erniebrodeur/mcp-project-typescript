import { z } from 'zod';

/**
 * Capabilities Schemas
 * Defines the structure of MCP server capabilities
 */

// Resource capability schema
export const resourceCapabilitySchema = z.object({
  // Resource-specific configuration options could go here
}).optional();

// Tool capability schema
export const toolCapabilitySchema = z.object({
  // Tool-specific configuration options could go here
}).optional();

// Prompt capability schema
export const promptCapabilitySchema = z.object({
  // Prompt-specific configuration options could go here
}).optional();

// Combined capabilities schema
export const capabilitiesSchema = z.object({
  resources: resourceCapabilitySchema,
  tools: toolCapabilitySchema,
  prompts: promptCapabilitySchema,
});

// Server info schema
export const serverInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  capabilities: capabilitiesSchema.optional(),
});

// TypeScript types
export type ResourceCapability = z.infer<typeof resourceCapabilitySchema>;
export type ToolCapability = z.infer<typeof toolCapabilitySchema>;
export type PromptCapability = z.infer<typeof promptCapabilitySchema>;
export type Capabilities = z.infer<typeof capabilitiesSchema>;
export type ServerInfo = z.infer<typeof serverInfoSchema>;

// Helper function to create server info object
export function createServerInfo(
  name: string,
  version: string,
  capabilities?: Partial<Capabilities>
): ServerInfo {
  return {
    name,
    version,
    capabilities: capabilities as Capabilities,
  };
}

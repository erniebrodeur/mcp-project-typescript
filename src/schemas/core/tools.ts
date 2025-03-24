import { z } from 'zod';

/**
 * Tool Schemas
 * Defines the structure of MCP tools and their handlers
 */

// Tool content type schema
export const toolContentTypeSchema = z.enum([
  'text',
  'html',
  'markdown',
  'json',
  'image',
]);

// Tool content item schema
export const toolContentItemSchema = z.object({
  type: toolContentTypeSchema,
  text: z.string(),
  mediaType: z.string().optional(),
});

// Tool response schema
export const toolResponseSchema = z.object({
  content: z.array(toolContentItemSchema),
  isError: z.boolean().optional(),
});

// Tool definition schema
export const toolDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  arguments: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      required: z.boolean().optional(),
      schema: z.unknown().optional(), // Will be a JSON Schema
    })
  ),
});

// Tool request schema
export const toolRequestSchema = z.object({
  name: z.string(),
  arguments: z.record(z.unknown()),
});

// TypeScript types
export type ToolContentType = z.infer<typeof toolContentTypeSchema>;
export type ToolContentItem = z.infer<typeof toolContentItemSchema>;
export type ToolResponse = z.infer<typeof toolResponseSchema>;
export type ToolDefinition = z.infer<typeof toolDefinitionSchema>;
export type ToolRequest = z.infer<typeof toolRequestSchema>;

// Tool handler function type
export type ToolHandler<T = unknown> = (args: T) => Promise<ToolResponse>;

// Helper functions
export function createToolResponse(
  content: ToolContentItem[],
  isError?: boolean
): ToolResponse {
  return {
    content,
    isError,
  };
}

export function createTextToolResponse(
  text: string,
  isError?: boolean
): ToolResponse {
  return createToolResponse(
    [{ type: 'text', text }],
    isError
  );
}

export function createErrorToolResponse(message: string): ToolResponse {
  return createToolResponse(
    [{ type: 'text', text: message }],
    true
  );
}

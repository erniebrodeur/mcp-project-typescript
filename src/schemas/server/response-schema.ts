import { z } from 'zod';

/**
 * Generic Resource Response Schema
 * Defines the standard structure for all MCP resource responses
 */

// Resource content schema
export const resourceContentSchema = z.object({
  uri: z.string().url(),
  text: z.string()
});

// Generic resource response schema
export const resourceResponseSchema = z.object({
  contents: z.array(resourceContentSchema)
});

// TypeScript type for resource response
export type ResourceResponse<T = unknown> = {
  contents: Array<{
    uri: string;
    text: string;
  }>;
  data?: T; // Optional parsed data (not in wire format)
};

// Helper for creating consistent resource responses
export function createResourceResponse<T>(
  uri: string, 
  data: T
): ResourceResponse<T> {
  return {
    contents: [{
      uri,
      text: JSON.stringify(data)
    }]
  };
}

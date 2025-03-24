import { z } from 'zod';

/**
 * Resource Schemas
 * Defines the structure of MCP resources and their handlers
 */

// Resource content item schema
export const resourceContentSchema = z.object({
  uri: z.string(),
  text: z.string(),
  mediaType: z.string().optional(),
});

// Resource response schema
export const resourceResponseSchema = z.object({
  contents: z.array(resourceContentSchema),
});

// Resource error schema
export const resourceErrorSchema = z.object({
  message: z.string(),
  status: z.number(),
});

// Resource error response schema
export const resourceErrorResponseSchema = z.object({
  error: resourceErrorSchema,
});

// Combined resource handler response schema
export const resourceHandlerResponseSchema = z.union([
  resourceResponseSchema,
  resourceErrorResponseSchema,
]);

// Resource URI schema
export const resourceUriSchema = z.object({
  scheme: z.string(),
  path: z.string(),
  query: z.record(z.string()).optional(),
  href: z.string(),
});

// Resource template parameter schema
export const resourceTemplateParamSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  required: z.boolean().optional(),
});

// Resource template schema
export const resourceTemplateSchema = z.object({
  template: z.string(),
  parameters: z.array(resourceTemplateParamSchema).optional(),
  list: z.unknown().optional(), // Will be defined by specific resources
});

// Resource handler function type
export type ResourceHandler = (
  uri: z.infer<typeof resourceUriSchema>,
  params: Record<string, string>
) => Promise<z.infer<typeof resourceHandlerResponseSchema>>;

// TypeScript types
export type ResourceContent = z.infer<typeof resourceContentSchema>;
export type ResourceResponse = z.infer<typeof resourceResponseSchema>;
export type ResourceError = z.infer<typeof resourceErrorSchema>;
export type ResourceErrorResponse = z.infer<typeof resourceErrorResponseSchema>;
export type ResourceHandlerResponse = z.infer<typeof resourceHandlerResponseSchema>;
export type ResourceUri = z.infer<typeof resourceUriSchema>;
export type ResourceTemplateParam = z.infer<typeof resourceTemplateParamSchema>;
export type ResourceTemplate = z.infer<typeof resourceTemplateSchema>;

// Helper functions
export function createResourceResponse(contents: ResourceContent[]): ResourceResponse {
  return { contents };
}

export function createResourceErrorResponse(
  message: string,
  status: number
): ResourceErrorResponse {
  return {
    error: {
      message,
      status,
    },
  };
}

// Parse a resource URI
export function parseResourceUri(uriString: string): ResourceUri {
  try {
    const [scheme, remainder] = uriString.split('://');
    if (!scheme || !remainder) {
      throw new Error(`Invalid resource URI: ${uriString}`);
    }

    const [path, queryString] = remainder.split('?');
    const query: Record<string, string> = {};
    
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) {
          query[key] = value || '';
        }
      });
    }

    return {
      scheme,
      path,
      query: Object.keys(query).length > 0 ? query : undefined,
      href: uriString,
    };
  } catch (error) {
    throw new Error(`Failed to parse resource URI: ${uriString}`);
  }
}

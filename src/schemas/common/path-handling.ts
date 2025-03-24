import { z } from 'zod';

/**
 * Path Handling Schema
 * Defines types and validation for path handling in MCP
 */

// Resource URI schema
export const resourceUriSchema = z.object({
  scheme: z.string(),
  path: z.string(),
  params: z.record(z.string()).optional()
});

// TypeScript type for resource URI
export type ResourceUri = z.infer<typeof resourceUriSchema>;

// Path validation status
export enum PathValidationStatus {
  Valid = 'valid',
  Invalid = 'invalid',
  Suspicious = 'suspicious',
  NeedsResolution = 'needs_resolution'
}

// Path validation result
export const pathValidationResultSchema = z.object({
  status: z.nativeEnum(PathValidationStatus),
  normalizedPath: z.string(),
  originalPath: z.string(),
  isApproved: z.boolean()
});

// TypeScript type for path validation result
export type PathValidationResult = z.infer<typeof pathValidationResultSchema>;

// Parse a resource URI string into components
export function parseResourceUri(uri: string): ResourceUri {
  const parts = uri.split('://');
  if (parts.length !== 2) {
    throw new Error(`Invalid resource URI format: ${uri}`);
  }
  
  return {
    scheme: parts[0],
    path: parts[1]
  };
}

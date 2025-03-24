import { z } from 'zod';
import * as path from 'path';

/**
 * Path Handling Schemas
 * Defines structures for path normalization and validation
 */

// Path validation status enum
export enum PathValidationStatus {
  Valid = 'valid',
  Invalid = 'invalid',
  Suspicious = 'suspicious',
  NeedsResolution = 'needs_resolution',
}

// Path validation result schema
export const pathValidationResultSchema = z.object({
  status: z.nativeEnum(PathValidationStatus),
  normalizedPath: z.string(),
  originalPath: z.string(),
  isApproved: z.boolean(),
  message: z.string().optional(),
});

// Path validation options schema
export const pathValidationOptionsSchema = z.object({
  allowTraversal: z.boolean().optional(),
  approvedDirectories: z.array(z.string()).optional(),
  projectRoots: z.array(z.string()).optional(),
});

// TypeScript types
export type PathValidationResult = z.infer<typeof pathValidationResultSchema>;
export type PathValidationOptions = z.infer<typeof pathValidationOptionsSchema>;

// Helper functions

/**
 * Normalize a path by resolving traversals and removing trailing slashes
 */
export function normalizePath(filePath: string, baseDir?: string): string {
  try {
    // Resolve relative paths if base directory is provided
    const resolvedPath = baseDir 
      ? path.resolve(baseDir, filePath)
      : path.resolve(filePath);
    
    // Remove trailing slashes
    return resolvedPath.replace(/[/\\]+$/, '');
  } catch (error) {
    // Return original path if normalization fails
    return filePath;
  }
}

/**
 * Create a path validation result
 */
export function createPathValidationResult(
  status: PathValidationStatus,
  normalizedPath: string,
  originalPath: string,
  isApproved: boolean,
  message?: string
): PathValidationResult {
  return {
    status,
    normalizedPath,
    originalPath,
    isApproved,
    message,
  };
}

/**
 * Extract path parameters from a template string and input path
 * Example: template "users/{id}/profile" with path "users/123/profile"
 * Returns: { id: "123" }
 */
export function extractPathParams(
  template: string,
  path: string
): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Convert template to regex pattern
  const pattern = template.replace(/{([^}]+)}/g, (_, paramName) => {
    return `(?<${paramName}>[^/]+)`;
  });
  
  const regex = new RegExp(`^${pattern}$`);
  const match = regex.exec(path);
  
  if (match && match.groups) {
    Object.entries(match.groups).forEach(([key, value]) => {
      params[key] = value || '';
    });
  }
  
  return params;
}

import { z } from 'zod';

/**
 * Error Response Schema
 * Defines standard error responses for MCP resources
 */

// Error status codes
export enum ErrorStatusCode {
  NotFound = 404,
  Forbidden = 403,
  BadRequest = 400,
  InternalError = 500
}

// Error response schema
export const errorResponseSchema = z.object({
  status: z.nativeEnum(ErrorStatusCode),
  message: z.string()
});

// TypeScript type for error response
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Helper for creating standard error responses
export function createErrorResponse(
  status: ErrorStatusCode, 
  message: string
): ErrorResponse {
  return {
    status,
    message
  };
}

// Predefined error responses
export const ERRORS = {
  NOT_FOUND: (resource: string) => 
    createErrorResponse(
      ErrorStatusCode.NotFound, 
      `${resource} not found at specified path`
    ),
  FORBIDDEN: (path: string) => 
    createErrorResponse(
      ErrorStatusCode.Forbidden, 
      `Access denied to path: ${path}`
    ),
  INVALID_PATH: (path: string) => 
    createErrorResponse(
      ErrorStatusCode.BadRequest, 
      `Invalid path format: ${path}`
    )
};

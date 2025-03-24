import { z } from 'zod';

/**
 * Core MCP Message Schemas
 * Defines the standard structure of all MCP protocol messages
 */

// JSON-RPC 2.0 base message structure
export const baseMessageSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.string().or(z.number()).optional(),
});

// Request message schema
export const requestMessageSchema = baseMessageSchema.extend({
  method: z.string(),
  params: z.record(z.unknown()).optional(),
});

// Success response schema
export const successResponseSchema = baseMessageSchema.extend({
  result: z.unknown(),
});

// Error response schema
export const errorResponseSchema = baseMessageSchema.extend({
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.unknown().optional(),
  }),
});

// Combined response schema (success or error)
export const responseMessageSchema = z.union([
  successResponseSchema,
  errorResponseSchema,
]);

// TypeScript types derived from schemas
export type BaseMessage = z.infer<typeof baseMessageSchema>;
export type RequestMessage = z.infer<typeof requestMessageSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ResponseMessage = z.infer<typeof responseMessageSchema>;

// Standard error codes (based on JSON-RPC 2.0 spec)
export enum ErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  // MCP specific error codes
  ResourceNotFound = -32000,
  ResourceError = -32001,
  ToolExecutionError = -32002,
  CapabilityNotSupported = -32003,
}

// Helper function to create standard error responses
export function createErrorResponse(
  code: ErrorCode | number, 
  message: string, 
  id?: string | number,
  data?: unknown
): ErrorResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data,
    },
  };
}

// Helper function to create standard success responses
export function createSuccessResponse(
  result: unknown,
  id?: string | number
): SuccessResponse {
  return {
    jsonrpc: '2.0',
    id,
    result,
  };
}

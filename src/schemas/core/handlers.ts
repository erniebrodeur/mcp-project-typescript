import { z } from 'zod';
import { ResourceHandler } from './resources';
import { ToolHandler } from './tools';
import { PromptHandler } from './prompts';

/**
 * Handler Registration Schemas
 * Defines structures for registering handlers with the MCP server
 */

// Handler types enum
export enum HandlerType {
  Resource = 'resource',
  Tool = 'tool',
  Prompt = 'prompt',
}

// Base handler registration schema
export const handlerRegistrationSchema = z.object({
  type: z.nativeEnum(HandlerType),
  name: z.string(),
  handler: z.function(),
});

// Resource handler registration schema
export const resourceHandlerRegistrationSchema = handlerRegistrationSchema.extend({
  type: z.literal(HandlerType.Resource),
  template: z.string().or(z.object({
    template: z.string(),
    list: z.unknown().optional(),
  })),
  handler: z.custom<ResourceHandler>(),
});

// Tool handler registration schema
export const toolHandlerRegistrationSchema = handlerRegistrationSchema.extend({
  type: z.literal(HandlerType.Tool),
  parameters: z.record(z.any()),
  handler: z.custom<ToolHandler<any>>(),
});

// Prompt handler registration schema
export const promptHandlerRegistrationSchema = handlerRegistrationSchema.extend({
  type: z.literal(HandlerType.Prompt),
  parameters: z.record(z.any()),
  handler: z.custom<PromptHandler<any>>(),
});

// TypeScript types
export type HandlerRegistration = z.infer<typeof handlerRegistrationSchema>;
export type ResourceHandlerRegistration = z.infer<typeof resourceHandlerRegistrationSchema>;
export type ToolHandlerRegistration = z.infer<typeof toolHandlerRegistrationSchema>;
export type PromptHandlerRegistration = z.infer<typeof promptHandlerRegistrationSchema>;

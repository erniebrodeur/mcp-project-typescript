import { z } from 'zod';

/**
 * Prompt Schemas
 * Defines the structure of MCP prompts and their handlers
 */

// Role enum for message roles
export const messageRoleSchema = z.enum([
  'system',
  'user',
  'assistant',
]);

// Content type enum for message content
export const contentTypeSchema = z.enum([
  'text',
  'image',
]);

// Text content schema
export const textContentSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

// Image content schema
export const imageContentSchema = z.object({
  type: z.literal('image'),
  url: z.string(),
});

// Combined content schema
export const contentSchema = z.discriminatedUnion('type', [
  textContentSchema,
  imageContentSchema,
]);

// Message schema
export const messageSchema = z.object({
  role: messageRoleSchema,
  content: contentSchema.or(z.array(contentSchema)),
});

// Prompt schema
export const promptSchema = z.object({
  description: z.string().optional(),
  messages: z.array(messageSchema),
});

// Prompt definition schema
export const promptDefinitionSchema = z.object({
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

// TypeScript types
export type MessageRole = z.infer<typeof messageRoleSchema>;
export type ContentType = z.infer<typeof contentTypeSchema>;
export type TextContent = z.infer<typeof textContentSchema>;
export type ImageContent = z.infer<typeof imageContentSchema>;
export type Content = z.infer<typeof contentSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Prompt = z.infer<typeof promptSchema>;
export type PromptDefinition = z.infer<typeof promptDefinitionSchema>;

// Prompt handler function type
export type PromptHandler<T = unknown> = (args: T) => Prompt;

// Helper functions
export function createTextMessage(
  role: MessageRole,
  text: string
): Message {
  return {
    role,
    content: {
      type: 'text',
      text,
    },
  };
}

export function createPrompt(
  messages: Message[],
  description?: string
): Prompt {
  return {
    description,
    messages,
  };
}

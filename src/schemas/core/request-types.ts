import { z } from 'zod';
import { baseMessageSchema } from './messages';

/**
 * MCP Request/Response Type Schemas
 * Defines specific request and response schemas for MCP methods
 */

// ======= SERVER INFO =======

// Server info request schema
export const serverInfoRequestSchema = baseMessageSchema.extend({
  method: z.literal('mcp.server.info'),
  params: z.object({}).optional(),
});

// Server info response schema
export const serverInfoResponseSchema = baseMessageSchema.extend({
  result: z.object({
    name: z.string(),
    version: z.string(),
    capabilities: z.record(z.unknown()).optional(),
  }),
});

// ======= RESOURCES =======

// List resources request schema
export const listResourcesRequestSchema = baseMessageSchema.extend({
  method: z.literal('mcp.resources.list'),
  params: z.object({}).optional(),
});

// List resources response schema
export const listResourcesResponseSchema = baseMessageSchema.extend({
  result: z.object({
    resources: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      template: z.string(),
    })),
  }),
});

// Read resource request schema
export const readResourceRequestSchema = baseMessageSchema.extend({
  method: z.literal('mcp.resources.read'),
  params: z.object({
    uri: z.string(),
  }),
});

// Read resource response schema
export const readResourceResponseSchema = baseMessageSchema.extend({
  result: z.object({
    contents: z.array(z.object({
      uri: z.string(),
      text: z.string(),
      mediaType: z.string().optional(),
    })),
  }),
});

// ======= TOOLS =======

// List tools request schema
export const listToolsRequestSchema = baseMessageSchema.extend({
  method: z.literal('mcp.tools.list'),
  params: z.object({}).optional(),
});

// List tools response schema
export const listToolsResponseSchema = baseMessageSchema.extend({
  result: z.object({
    tools: z.array(z.object({
      name: z.string(),
      description: z.string(),
      arguments: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        required: z.boolean().optional(),
        schema: z.unknown().optional(),
      })),
    })),
  }),
});

// Call tool request schema
export const callToolRequestSchema = baseMessageSchema.extend({
  method: z.literal('mcp.tools.call'),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.unknown()),
  }),
});

// Call tool response schema
export const callToolResponseSchema = baseMessageSchema.extend({
  result: z.object({
    content: z.array(z.object({
      type: z.string(),
      text: z.string(),
      mediaType: z.string().optional(),
    })),
    isError: z.boolean().optional(),
  }),
});

// ======= PROMPTS =======

// List prompts request schema
export const listPromptsRequestSchema = baseMessageSchema.extend({
  method: z.literal('mcp.prompts.list'),
  params: z.object({}).optional(),
});

// List prompts response schema
export const listPromptsResponseSchema = baseMessageSchema.extend({
  result: z.object({
    prompts: z.array(z.object({
      name: z.string(),
      description: z.string(),
      arguments: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        required: z.boolean().optional(),
        schema: z.unknown().optional(),
      })),
    })),
  }),
});

// Get prompt request schema
export const getPromptRequestSchema = baseMessageSchema.extend({
  method: z.literal('mcp.prompts.get'),
  params: z.object({
    name: z.string(),
    arguments: z.record(z.unknown()).optional(),
  }),
});

// Get prompt response schema
export const getPromptResponseSchema = baseMessageSchema.extend({
  result: z.object({
    description: z.string().optional(),
    messages: z.array(z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.object({
        type: z.string(),
        text: z.string(),
      }).or(z.array(z.object({
        type: z.string(),
        text: z.string().optional(),
        url: z.string().optional(),
      }))),
    })),
  }),
});

// TypeScript types export
export type ServerInfoRequest = z.infer<typeof serverInfoRequestSchema>;
export type ServerInfoResponse = z.infer<typeof serverInfoResponseSchema>;

export type ListResourcesRequest = z.infer<typeof listResourcesRequestSchema>;
export type ListResourcesResponse = z.infer<typeof listResourcesResponseSchema>;
export type ReadResourceRequest = z.infer<typeof readResourceRequestSchema>;
export type ReadResourceResponse = z.infer<typeof readResourceResponseSchema>;

export type ListToolsRequest = z.infer<typeof listToolsRequestSchema>;
export type ListToolsResponse = z.infer<typeof listToolsResponseSchema>;
export type CallToolRequest = z.infer<typeof callToolRequestSchema>;
export type CallToolResponse = z.infer<typeof callToolResponseSchema>;

export type ListPromptsRequest = z.infer<typeof listPromptsRequestSchema>;
export type ListPromptsResponse = z.infer<typeof listPromptsResponseSchema>;
export type GetPromptRequest = z.infer<typeof getPromptRequestSchema>;
export type GetPromptResponse = z.infer<typeof getPromptResponseSchema>;

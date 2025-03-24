import { z } from 'zod';
import { RequestMessage, ResponseMessage } from './messages';

/**
 * Transport Schemas
 * Defines interfaces for MCP transport mechanisms
 */

// Transport handler function types
export type MessageHandler = (message: RequestMessage) => Promise<void>;
export type TransportConnectOptions = Record<string, unknown>;

// Transport interface schema
export const transportSchema = z.object({
  connect: z.function()
    .args(z.record(z.unknown()).optional())
    .returns(z.promise(z.void())),
  
  disconnect: z.function()
    .args()
    .returns(z.promise(z.void())),
  
  sendMessage: z.function()
    .args(z.unknown())
    .returns(z.promise(z.void())),
  
  onMessage: z.function()
    .args(z.function())
    .returns(z.void()),
});

// Transport status enum
export enum TransportStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Error = 'error',
}

// Transport status schema
export const transportStatusSchema = z.nativeEnum(TransportStatus);

// Transport config for different transport types
export const stdioTransportConfigSchema = z.object({
  type: z.literal('stdio'),
});

export const sseTransportConfigSchema = z.object({
  type: z.literal('sse'),
  sseEndpoint: z.string(),
  postEndpoint: z.string(),
});

// Combined transport config schema
export const transportConfigSchema = z.discriminatedUnion('type', [
  stdioTransportConfigSchema,
  sseTransportConfigSchema,
]);

// TypeScript types
export type Transport = z.infer<typeof transportSchema>;
export type TransportConfig = z.infer<typeof transportConfigSchema>;
export type StdioTransportConfig = z.infer<typeof stdioTransportConfigSchema>;
export type SseTransportConfig = z.infer<typeof sseTransportConfigSchema>;

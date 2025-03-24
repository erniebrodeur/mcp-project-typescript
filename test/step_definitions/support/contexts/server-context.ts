/**
 * Server Context
 * Manages server-related state and operations
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export class ServerContext {
  // Core server instance
  server: McpServer;
  
  // Server metadata
  name: string = '';
  version: string = '';
  
  // Server capabilities
  capabilities: string[] = [];
  
  // Server state
  isInitialized: boolean = false;
  
  // Transport properties
  transportType: string = '';
  transportInitialized: boolean = false;
  transportConnected: boolean = false;
  transportConfig: Record<string, string> = {};
  sseEndpoint: string = '';
  postEndpoint: string = '';
  
  // Client session info
  clientConnected: boolean = false;
  concurrentClients: number = 0;
  
  constructor() {
    // Create the server instance
    this.server = new McpServer({
      name: "TestServer",
      version: "1.0.0"
    });
    
    this.name = "TestServer";
    this.version = "1.0.0";
    this.isInitialized = true;
  }
  
  /**
   * Configure server with name and version
   */
  configure(name: string, version: string): void {
    this.server = new McpServer({
      name,
      version
    });
    
    this.name = name;
    this.version = version;
  }
  
  /**
   * Register a capability
   */
  registerCapability(capability: string): void {
    if (!this.capabilities.includes(capability)) {
      this.capabilities.push(capability);
    }
  }
}

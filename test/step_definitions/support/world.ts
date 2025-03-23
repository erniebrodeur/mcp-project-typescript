import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export class McpWorld extends World {
  server: McpServer;
  mockExecutor: any;
  mockFs: any;
  response: any = null;
  projectType: string = '';
  projectPath: string = '';
  
  constructor(options: IWorldOptions) {
    super(options);
    this.server = new McpServer({
      name: "TestServer",
      version: "1.0.0"
    });
    // Mock implementations will be added when needed
    this.mockExecutor = { execute: async () => ({}) };
    this.mockFs = {};
  }

  loadFixture(category: string, type: string) {
    try {
      return require(`../../../fixtures/${category}/${type}.json`);
    } catch (error) {
      throw new Error(`Failed to load fixture: fixtures/${category}/${type}.json`);
    }
  }
}

setWorldConstructor(McpWorld);
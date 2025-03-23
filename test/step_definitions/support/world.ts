import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { MockCommandExecutor } from '../../helpers/mock-command-executor';
import { setupMockFilesystem } from '../../helpers/mock-filesystem';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export class McpWorld extends World {
  server: McpServer;
  mockExecutor: MockCommandExecutor;
  mockFs: any; // memfs volume
  response: any;
  projectType: string;
  projectPath: string;
  
  constructor(options: IWorldOptions) {
    super(options);
    this.mockExecutor = new MockCommandExecutor();
    this.mockFs = setupMockFilesystem();
    this.server = new McpServer({
      name: "TestServer",
      version: "1.0.0"
    });
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
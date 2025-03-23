import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { MockCommandExecutor } from '../../helpers/mock-command-executor';
import { MockFileSystem } from '../../helpers/mock-filesystem';

export class McpWorld extends World {
  server: McpServer;
  mockExecutor: MockCommandExecutor;
  mockFs: MockFileSystem;
  response: any = null;
  projectType: string = '';
  projectPath: string = '';
  
  // Server metadata
  serverName: string = '';
  serverVersion: string = '';
  
  // Directory validation properties
  approvedDirectories: string[] = [];
  currentPath: string = '';
  validationResult: boolean = false;
  symlinkTarget: string = '';
  
  constructor(options: IWorldOptions) {
    super(options);
    this.server = new McpServer({
      name: "TestServer",
      version: "1.0.0"
    });
    
    // Initialize mocks
    this.mockExecutor = new MockCommandExecutor();
    this.mockFs = new MockFileSystem();
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
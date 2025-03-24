import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { MockCommandExecutor } from '../../helpers/mock-command-executor';
import { MockFileSystem } from '../../helpers/mock-filesystem';

export class McpWorld extends World {
  // Package resource properties
  packagePath: string = '';
  packageExists: boolean = true;
  packageHasOptionalFields: boolean = false;
  
  // Transport properties
  transportType: string = '';
  transportInitialized: boolean = false;
  transportConnected: boolean = false;
  transportComponentsAvailable: boolean = false;
  transportConfig: Record<string, string> = {};
  sseEndpoint: string = '';
  postEndpoint: string = '';
  rawMessage: string = '';
  concurrentClients: number = 0;
  transportError: {type: string, message: string} | null = null;
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
  
  // Resource registration tracking
  registeredResources: string[] = [];
  
  // Path handling properties
  pathNormalizationEnabled: boolean = false;
  requestedUri: string = '';
  
  // URI template processing
  uri: string = '';
  uriTemplate: string = '';
  extractedParam: string = '';
  
  // Path normalization
  inputPath: string = '';
  normalizedPath: string = '';
  securityResult: string = '';
  
  // Project roots for path handling
  projectRoots: string[] = [];
  pathHandlingEnabled: boolean = false;
  
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
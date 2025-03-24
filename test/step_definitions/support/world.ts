import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { ServerContext } from './contexts/server-context';
import { ResourceContext } from './contexts/resource-context';
import { PathContext } from './contexts/path-context';
import { TestContext } from './contexts/test-context';

/**
 * McpWorld - The main Cucumber World object
 * Organized by contexts to manage different aspects of the test state
 */
export class McpWorld extends World {
  // Contexts for different aspects of the system
  server: ServerContext;
  resources: ResourceContext;
  paths: PathContext;
  mocks: TestContext;
  
  constructor(options: IWorldOptions) {
    super(options);
    
    // Initialize contexts
    this.server = new ServerContext();
    this.resources = new ResourceContext();
    this.paths = new PathContext();
    this.mocks = new TestContext();
  }
  
  // Legacy accessor methods for backward compatibility
  // These will be deprecated once all step definitions are updated
  
  get mockExecutor() {
    return this.mocks.mockExecutor;
  }
  
  get mockFs() {
    return this.mocks.mockFs;
  }
  
  get response() {
    return this.resources.response;
  }
  
  set response(value) {
    this.resources.response = value;
  }
  
  get projectType() {
    return this.resources.projectType;
  }
  
  set projectType(value) {
    this.resources.projectType = value;
  }
  
  get projectPath() {
    return this.resources.projectPath;
  }
  
  set projectPath(value) {
    this.resources.projectPath = value;
  }
  
  get packagePath() {
    return this.resources.packagePath;
  }
  
  set packagePath(value) {
    this.resources.packagePath = value;
  }
  
  // Helper method for loading fixtures
  loadFixture<T>(category: string, type: string) {
    return this.mocks.loadFixture<T>(category, type);
  }
}

setWorldConstructor(McpWorld);

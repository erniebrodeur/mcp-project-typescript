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
  
  // Path context accessors
  get pathHandlingEnabled() {
    return this.paths.pathNormalizationEnabled;
  }
  
  set pathHandlingEnabled(value: boolean) {
    this.paths.pathNormalizationEnabled = value;
  }
  
  get pathNormalizationEnabled() {
    return this.paths.pathNormalizationEnabled;
  }
  
  set pathNormalizationEnabled(value: boolean) {
    this.paths.pathNormalizationEnabled = value;
  }
  
  get currentPath() {
    return this.paths.currentPath;
  }
  
  set currentPath(value: string) {
    this.paths.currentPath = value;
  }
  
  get inputPath() {
    return this.paths.currentPath;
  }
  
  set inputPath(value: string) {
    this.paths.currentPath = value;
  }
  
  get normalizedPath() {
    return this.paths.normalizedPath;
  }
  
  set normalizedPath(value: string) {
    this.paths.normalizedPath = value;
  }
  
  get validationResult() {
    return this.paths.validationResult?.isApproved ?? false;
  }
  
  set validationResult(value: boolean) {
    if (this.paths.validationResult) {
      this.paths.validationResult.isApproved = value;
    }
  }
  
  get approvedDirectories() {
    return this.paths.approvedDirectories;
  }
  
  set approvedDirectories(value: string[]) {
    this.paths.approvedDirectories = value;
  }
  
  get projectRoots() {
    return this.paths.projectRoots;
  }
  
  set projectRoots(value: string[]) {
    this.paths.projectRoots = value;
  }
  
  get uri() {
    return this.paths.uri;
  }
  
  set uri(value: string) {
    this.paths.uri = value;
  }
  
  get uriTemplate() {
    return this.paths.uriTemplate;
  }
  
  set uriTemplate(value: string) {
    this.paths.uriTemplate = value;
  }
  
  get extractedParam() {
    return this.paths.extractedParam;
  }
  
  set extractedParam(value: string) {
    this.paths.extractedParam = value;
  }
  
  get securityResult() {
    return this.paths.securityResult;
  }
  
  set securityResult(value: string) {
    this.paths.securityResult = value;
  }
  
  // TestContext accessors
  
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

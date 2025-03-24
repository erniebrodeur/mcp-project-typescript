import { Before, After } from '@cucumber/cucumber';
import { McpWorld } from './world';

// Reset test environment before each scenario
Before(function(this: McpWorld) {
  // Reset contexts
  this.server = new ServerContext();
  this.resources = new ResourceContext();
  this.paths = new PathContext();
  this.mocks = new TestContext();
});

// Import after the class reference to avoid circular dependency issues
import { ServerContext } from './contexts/server-context';
import { ResourceContext } from './contexts/resource-context';
import { PathContext } from './contexts/path-context';
import { TestContext } from './contexts/test-context';

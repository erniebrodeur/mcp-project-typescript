import { Before, After } from '@cucumber/cucumber';
import { McpWorld } from './world';
import { setupMockFilesystem } from '../../helpers/mock-filesystem';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Reset test environment before each scenario
Before(function(this: McpWorld) {
  // Reset mock filesystem
  this.mockFs = setupMockFilesystem();
  
  // Fresh server instance
  this.server = new McpServer({
    name: "TestServer",
    version: "1.0.0"
  });
  
  // Reset mock executor
  this.mockExecutor = new MockCommandExecutor();
  
  // Reset response data
  this.response = null;
});
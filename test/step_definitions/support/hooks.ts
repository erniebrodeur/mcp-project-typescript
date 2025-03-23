import { Before, After } from '@cucumber/cucumber';
import { McpWorld } from './world';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Reset test environment before each scenario
Before(function(this: McpWorld) {
  // Reset server instance
  this.server = new McpServer({
    name: "TestServer",
    version: "1.0.0"
  });
  
  // Reset mock executor
  this.mockExecutor = { execute: async () => ({}) };
  
  // Reset mock filesystem
  this.mockFs = {};
  
  // Reset response data
  this.response = null;
  
  // Reset project info
  this.projectType = '';
  this.projectPath = '';
});
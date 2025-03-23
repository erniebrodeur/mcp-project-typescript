import { Before, After } from '@cucumber/cucumber';
import { McpWorld } from './world';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { MockFileSystem } from '../../helpers/mock-filesystem';
import { MockCommandExecutor } from '../../helpers/mock-command-executor';

// Reset test environment before each scenario
Before(function(this: McpWorld) {
  // Reset server instance
  this.server = new McpServer({
    name: "TestServer",
    version: "1.0.0"
  });
  
  // Reset mock executor
  this.mockExecutor = new MockCommandExecutor();
  
  // Reset mock filesystem
  this.mockFs = new MockFileSystem();
  
  // Reset response data
  this.response = null;
  
  // Reset project info
  this.projectType = '';
  this.projectPath = '';
  
  // Reset directory validation properties
  this.approvedDirectories = [];
  this.currentPath = '';
  this.validationResult = false;
  this.symlinkTarget = '';
});
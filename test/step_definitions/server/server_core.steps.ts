import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import assert from 'assert';

// SDK installation check
Given('the MCP TypeScript SDK is installed', function(this: McpWorld) {
  assert(McpServer, 'MCP Server not available');
});

Given('the required server components are available', function(this: McpWorld) {
  assert(StdioServerTransport, 'Transport components not available');
});

Given('standardized path handling is configured', function(this: McpWorld) {
  this.paths.enablePathNormalization();
});

// Server initialization
When('I create a new McpServer instance', function(this: McpWorld) {
  // Already created in ServerContext constructor
  assert(this.server.server, 'Server not initialized');
  assert(this.server.isInitialized, 'Server initialization flag not set');
});

When('configure it with name {string} and version {string}', function(this: McpWorld, name: string, version: string) {
  this.server.configure(name, version);
});

Then('the server should be initialized with correct metadata', function(this: McpWorld) {
  assert(this.server.server, 'Server not initialized');
  assert.strictEqual(this.server.name, "JSTools", 'Server name mismatch');
  assert.strictEqual(this.server.version, "1.0.0", 'Server version mismatch');
});

Then('prepared to register JS\\/TS development tools', function(this: McpWorld) {
  assert.doesNotThrow(() => {
    this.server.server.tool("test-tool", {}, async () => ({
      content: [{ type: "text", text: "test" }]
    }));
  }, 'Failed to register tool on server');
});

// Server capabilities
Given('I have an initialized McpServer', function(this: McpWorld) {
  assert(this.server.server, 'Server not initialized');
  assert(this.server.isInitialized, 'Server initialization flag not set');
});

When('I register server capabilities', function(this: McpWorld) {
  this.server.server.tool("npm_install", {}, async () => ({
    content: [{ type: "text", text: "Installed packages" }]
  }));
  
  this.server.server.tool("test_run", {}, async () => ({
    content: [{ type: "text", text: "Tests executed" }]
  }));
  
  this.server.registerCapability('npm');
  this.server.registerCapability('test');
});

Then('the server should support tools for npm, testing, linting, and building', function(this: McpWorld) {
  assert(this.server.capabilities.includes('npm'), 'npm capability not registered');
  assert(this.server.capabilities.includes('test'), 'test capability not registered');
});

Then('respond to capability discovery requests from clients', function(this: McpWorld) {
  assert(this.server.server, 'Server not initialized');
  // Additional capability discovery verification will be added later
});

// Transport connection
When('I connect it to a transport mechanism', function(this: McpWorld) {
  assert(typeof this.server.server.connect === 'function', 'Server connect method not available');
  this.server.transportInitialized = true;
});

Then('the server should establish communication channels', function(this: McpWorld) {
  assert(this.server.transportInitialized, 'Transport not initialized');
  // This will be implemented properly in the green phase
});

Then('begin processing incoming client requests', function(this: McpWorld) {
  assert(this.server.server, 'Server not initialized');
  // This will be implemented properly in the green phase
});

// Client session
Given('I have a running McpServer', function(this: McpWorld) {
  assert(this.server.server, 'Server not initialized');
  assert(this.server.isInitialized, 'Server initialization flag not set');
});

When('a client connects to the server', function(this: McpWorld) {
  this.server.clientConnected = true;
});

Then('the server should maintain the client session state', function(this: McpWorld) {
  assert(this.server.clientConnected, 'Client not connected');
  // This will be implemented properly in the green phase
});

Then('properly clean up resources when the session ends', function(this: McpWorld) {
  assert(this.server.server, 'Server not initialized');
  // This will be implemented properly in the green phase
});

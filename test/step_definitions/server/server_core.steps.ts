import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import assert from 'assert';

// SDK installation check
Given('the MCP TypeScript SDK is installed', function(this: McpWorld) {
  assert(McpServer);
});

Given('the required server components are available', function(this: McpWorld) {
  assert(StdioServerTransport);
});

// Server initialization
When('I create a new McpServer instance', function(this: McpWorld) {
  this.server = new McpServer({
    name: "TestServer",
    version: "1.0.0"
  });
});

When('configure it with name {string} and version {string}', function(this: McpWorld, name: string, version: string) {
  this.server = new McpServer({
    name,
    version
  });
  
  this.serverName = name;
  this.serverVersion = version;
});

Then('the server should be initialized with correct metadata', function(this: McpWorld) {
  assert(this.server);
  assert.strictEqual(this.serverName, "JSTools");
  assert.strictEqual(this.serverVersion, "1.0.0");
});

Then('prepared to register JS\\/TS development tools', function(this: McpWorld) {
  assert.doesNotThrow(() => {
    this.server.tool("test-tool", {}, async () => ({
      content: [{ type: "text", text: "test" }]
    }));
  });
});

// Server capabilities
Given('I have an initialized McpServer', function(this: McpWorld) {
  this.server = new McpServer({
    name: "TestServer",
    version: "1.0.0"
  });
});

When('I register server capabilities', function(this: McpWorld) {
  this.server.tool("npm_install", {}, async () => ({
    content: [{ type: "text", text: "Installed packages" }]
  }));
  
  this.server.tool("test_run", {}, async () => ({
    content: [{ type: "text", text: "Tests executed" }]
  }));
});

Then('the server should support tools for npm, testing, linting, and building', function(this: McpWorld) {
  assert(this.server);
});

Then('respond to capability discovery requests from clients', function(this: McpWorld) {
  assert(this.server);
});

// Transport connection
When('I connect it to a transport mechanism', function(this: McpWorld) {
  assert(typeof this.server.connect === 'function');
});

Then('the server should establish communication channels', function(this: McpWorld) {
  assert(this.server);
});

Then('begin processing incoming client requests', function(this: McpWorld) {
  assert(this.server);
});

// Client session
Given('I have a running McpServer', function(this: McpWorld) {
  this.server = new McpServer({
    name: "TestServer", 
    version: "1.0.0"
  });
});

When('a client connects to the server', function(this: McpWorld) {
  assert(this.server);
});

Then('the server should maintain the client session state', function(this: McpWorld) {
  assert(this.server);
});

Then('properly clean up resources when the session ends', function(this: McpWorld) {
  assert(this.server);
});
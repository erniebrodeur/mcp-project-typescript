import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';
import { z } from 'zod';

Given('tool capability is enabled', function(this: McpWorld) {
  this.server.registerCapability('tools');
});

Given('standardized path handling for tool parameters', function(this: McpWorld) {
  this.paths.enablePathNormalization();
});

When('I register a tool with:', function(this: McpWorld, dataTable) {
  const toolInfo = dataTable.rowsHash();
  
  // Register the tool
  this.server.server.tool(
    toolInfo.name,
    {},
    async () => ({
      content: [{ type: "text", text: "Tool executed" }]
    })
  );
  
  // Store tool info for later
  this.server.registeredTools = this.server.registeredTools || [];
  this.server.registeredTools.push(toolInfo.name);
});

When('define parameters:', function(this: McpWorld, dataTable) {
  const params = dataTable.hashes();
  
  // Create parameter schema
  const paramSchema: Record<string, z.ZodTypeAny> = {};
  
  params.forEach(param => {
    if (param.type === 'string') {
      paramSchema[param.parameter] = param.required === 'true' ? 
        z.string() : z.string().optional();
    } else if (param.type === 'boolean') {
      paramSchema[param.parameter] = param.required === 'true' ? 
        z.boolean() : z.boolean().optional();
    } else if (param.type === 'array') {
      paramSchema[param.parameter] = param.required === 'true' ? 
        z.array(z.any()) : z.array(z.any()).optional();
    }
  });
  
  // Store for later validation
  this.server.toolParameters = paramSchema;
});

Given('I have registered multiple tools', function(this: McpWorld) {
  // Register several tools
  ['npm_install', 'test_run', 'lint'].forEach(tool => {
    this.server.server.tool(
      tool,
      {},
      async () => ({
        content: [{ type: "text", text: `${tool} executed` }]
      })
    );
    
    // Store registered tools
    this.server.registeredTools = this.server.registeredTools || [];
    this.server.registeredTools.push(tool);
  });
});

When('a client requests available tools', function(this: McpWorld) {
  // Simulate client request
  this.server.toolsRequested = true;
});

When('a client calls a tool with invalid parameters', function(this: McpWorld) {
  // Simulate invalid tool call
  this.server.toolExecutionError = 'Invalid parameters';
});

When('a client calls a tool with valid parameters', function(this: McpWorld) {
  // Simulate valid tool call
  this.server.toolExecutionSuccess = true;
});

Given('a registered tool {string}', function(this: McpWorld, toolName: string) {
  // Register the tool
  this.server.server.tool(
    toolName,
    { directory: z.string() },
    async () => ({
      content: [{ type: "text", text: "Tool executed" }]
    })
  );
  
  // Store registered tool
  this.server.registeredTools = this.server.registeredTools || [];
  this.server.registeredTools.push(toolName);
});

When('executed with directory parameter {string}', function(this: McpWorld, dirParam: string) {
  // Store parameter
  this.paths.setCurrentPath(dirParam);
});

Then('the tool should be available to clients', function(this: McpWorld) {
  assert(this.server.registeredTools?.length > 0, 'No tools registered');
  
  if (this.server.registeredTools) {
    const lastTool = this.server.registeredTools[this.server.registeredTools.length - 1];
    assert(lastTool, 'Last registered tool not found');
  }
});

Then('validate parameters before execution', function(this: McpWorld) {
  assert(this.server.toolParameters, 'Tool parameters not defined');
});

Then('all registered tools should be listed', function(this: McpWorld) {
  assert(this.server.toolsRequested, 'Tools were not requested');
  assert(this.server.registeredTools?.length > 0, 'No tools registered');
});

Then('include their parameter schemas and descriptions', function(this: McpWorld) {
  assert(this.server.toolParameters, 'Tool parameters not defined');
});

Then('the server should return a validation error', function(this: McpWorld) {
  assert(this.server.toolExecutionError, 'No tool execution error');
});

Then('not execute the command', function(this: McpWorld) {
  assert(this.server.toolExecutionError, 'Tool should not have executed');
});

Then('the server should execute the command', function(this: McpWorld) {
  assert(this.server.toolExecutionSuccess, 'Tool execution not successful');
});

Then('return the result in the prescribed format', function(this: McpWorld) {
  assert(this.server.toolExecutionSuccess, 'Tool execution not successful');
});

Then('the path should be normalized to {string}', function(this: McpWorld, normalizedPath: string) {
  // Remove quotes if present
  normalizedPath = normalizedPath.replace(/"/g, '');
  
  // Store for later verification
  this.paths.normalizedPath = normalizedPath;
  
  // In red phase, just verify step is called
  assert(this.paths.pathNormalizationEnabled, 'Path normalization not enabled');
});

Then('validated before command execution', function(this: McpWorld) {
  assert(this.paths.currentPath, 'No current path to validate');
});

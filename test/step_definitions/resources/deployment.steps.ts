import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';
import { parseDataTable } from '../support/utils/data-table-parser';

// Background setup
Given('an MCP server with Deployment resource capability', function(this: McpWorld) {
  // Register Deployment resource capability
  this.resources.registerResource('deployment');
});

Given('access to JavaScript/TypeScript project deployment files at configured paths', function(this: McpWorld) {
  // Verify mock filesystem is configured
  assert(this.mocks.mockFs, 'Mock filesystem not initialized');
});

// Deployment setup
Given('a {string} codebase with deployment setup at {string}', function(this: McpWorld, projectType: string, deployPath: string) {
  // Remove quotes if present
  this.resources.projectType = projectType.replace(/"/g, '');
  this.resources.projectPath = deployPath.replace(/"/g, '');
});

Given('no deployment configuration exists at {string}', function(this: McpWorld, deployPath: string) {
  // Remove quotes if present
  this.resources.projectPath = deployPath.replace(/"/g, '');
  // Flag invalid path
  this.resources.projectType = 'invalid';
});

Given('a project with {string} deployment at {string}', function(this: McpWorld, platform: string, deployPath: string) {
  // Remove quotes if present
  this.resources.projectType = platform.replace(/"/g, '');
  this.resources.projectPath = deployPath.replace(/"/g, '');
});

// Verification steps
Then('I receive complete deployment metadata including:', function(this: McpWorld, dataTable) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  const expected = parseDataTable(dataTable) as Record<string, any>;
  
  // Verify each expected field
  for (const [key, expectedValue] of Object.entries(expected)) {
    assert.deepStrictEqual(
      responseJson[key],
      expectedValue,
      `Mismatch for field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson[key])}`
    );
  }
});

Then('I receive standard deployment metadata', function(this: McpWorld) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  
  // Check standard fields
  const standardFields = ['ci_cd', 'containerization', 'cloud_services', 'deployment_type'];
  for (const field of standardFields) {
    assert(responseJson[field] !== undefined, `Missing standard field: ${field}`);
  }
});

Then('I receive deployment security analysis:', function(this: McpWorld, dataTable) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  const expected = parseDataTable(dataTable) as Record<string, any>;
  
  // Verify security analysis data
  assert(responseJson.security_analysis, 'No security analysis data in response');
  
  for (const [key, expectedValue] of Object.entries(expected)) {
    assert.deepStrictEqual(
      responseJson.security_analysis[key],
      expectedValue,
      `Mismatch for security analysis field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson.security_analysis[key])}`
    );
  }
});

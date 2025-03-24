import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';
import path from 'path';
import { parseDataTable } from '../support/utils/data-table-parser';

// Background setup
Given('an MCP server with Package resource capability', function(this: McpWorld) {
  // Register Package resource capability 
  this.resources.registerResource('package');
});

Given('access to JavaScript/TypeScript package.json files at configured paths', function(this: McpWorld) {
  // Verify mock filesystem is configured
  assert(this.mocks.mockFs, 'Mock filesystem not initialized');
});

// Package.json setup
Given('a package.json file exists at {string}', function(this: McpWorld, packagePath: string) {
  // Store path for later use
  this.resources.packagePath = packagePath.replace(/"/g, '');
  
  // We're not actually creating it here in the test phase
  // Just verifying the step is called
  assert(this.resources.packagePath, 'No package.json path provided');
});

Given('no package.json exists at {string}', function(this: McpWorld, packagePath: string) {
  // Store invalid path for later use
  this.resources.packagePath = packagePath.replace(/"/g, '');
  
  // Flag that this path should not have a package.json
  this.resources.packageExists = false;
});

Given('a package.json with optional fields at {string}', function(this: McpWorld, packagePath: string) {
  // Store path for later use
  this.resources.packagePath = packagePath.replace(/"/g, '');
  
  // Flag that this package has optional fields
  this.resources.packageHasOptionalFields = true;
});

// Verification steps
Then('I receive standard package metadata', function(this: McpWorld) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has standard fields
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  
  // Check that required standard fields exist
  const requiredFields = ['name', 'version', 'dependencies', 'devDependencies', 'scripts'];
  for (const field of requiredFields) {
    assert(responseJson[field] !== undefined, `Missing required field: ${field}`);
  }
});

Then('I receive optional fields:', function(this: McpWorld, dataTable: any) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  const expected = parseDataTable(dataTable) as Record<string, any>;
  
  // Check each expected optional field
  for (const [key, expectedValue] of Object.entries(expected)) {
    assert.deepStrictEqual(
      responseJson[key],
      expectedValue,
      `Mismatch for optional field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson[key])}`
    );
  }
});

Then('I receive an error response with:', function(this: McpWorld, dataTable: any) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify error response exists
  assert(response && 'error' in response, 'Expected error response not received');
  
  const expected = parseDataTable(dataTable) as Record<string, any>;
  
  // Check error status
  if (expected.status) {
    const expectedStatus = parseInt(expected.status.toString(), 10);
    assert.strictEqual(
      response.error.status,
      expectedStatus,
      `Error status mismatch: expected ${expectedStatus} but got ${response.error.status}`
    );
  }
  
  // Check error message
  if (expected.message) {
    // Remove quotes if present
    const expectedMessage = expected.message.toString().replace(/^"(.*)"$/, '$1');
    assert.strictEqual(
      response.error.message,
      expectedMessage,
      `Error message mismatch: expected "${expectedMessage}" but got "${response.error.message}"`
    );
  }
});

// Path handling
Then('the path should be normalized to {string}', function(this: McpWorld, normalizedPath: string) {
  // Remove quotes if present
  normalizedPath = normalizedPath.replace(/"/g, '');
  
  // Store for later verification when path normalization is implemented
  this.paths.normalizedPath = normalizedPath;
  
  // In red test phase, we just verify the step is called
  assert(this.paths.pathNormalizationEnabled, 'Path normalization not enabled');
  assert(normalizedPath, 'No normalized path to compare against');
});

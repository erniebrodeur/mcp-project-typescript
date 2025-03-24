import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';
import { parseDataTable } from '../support/utils/data-table-parser';

// Background setup
Given('an MCP server with Testing resource capability', function(this: McpWorld) {
  // Register Testing resource capability
  this.resources.registerResource('testing');
});

Given('access to JavaScript/TypeScript project test configurations at configured paths', function(this: McpWorld) {
  // Verify mock filesystem is configured
  assert(this.mocks.mockFs, 'Mock filesystem not initialized');
});

// Testing framework setup
Given('a {string} test setup at {string}', function(this: McpWorld, frameworkName: string, testPath: string) {
  // Remove quotes if present
  const framework = frameworkName.replace(/"/g, '');
  const path = testPath.replace(/"/g, '');
  
  // Store for later use
  this.resources.projectType = framework;
  this.resources.projectPath = path;
});

Given('no testing framework is configured at {string}', function(this: McpWorld, testPath: string) {
  // Remove quotes if present
  const path = testPath.replace(/"/g, '');
  
  // Store for later use
  this.resources.projectPath = path;
  // Flag that this path should not have testing framework
  this.resources.projectType = 'invalid';
});

Given('a project with {string} and coverage reports at {string}', function(this: McpWorld, frameworkName: string, testPath: string) {
  // Remove quotes if present
  const framework = frameworkName.replace(/"/g, '');
  const path = testPath.replace(/"/g, '');
  
  // Store for later use
  this.resources.projectType = framework;
  this.resources.projectPath = path;
});

// Verification steps
Then('I receive complete testing metadata including:', function(this: McpWorld, dataTable) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  const expected = parseDataTable(dataTable);
  
  // Verify each expected field
  for (const [key, expectedValue] of Object.entries(expected)) {
    assert.deepStrictEqual(
      responseJson[key],
      expectedValue,
      `Mismatch for field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson[key])}`
    );
  }
});

Then('I receive standard testing metadata', function(this: McpWorld) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  
  // Check standard fields
  const standardFields = ['framework', 'locations', 'types', 'coverage'];
  for (const field of standardFields) {
    assert(responseJson[field] !== undefined, `Missing standard field: ${field}`);
  }
});

Then('I receive detailed coverage data:', function(this: McpWorld, dataTable) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  const expected = parseDataTable(dataTable);
  
  // Verify coverage data
  assert(responseJson.coverage, 'No coverage data in response');
  
  for (const [key, expectedValue] of Object.entries(expected)) {
    assert.deepStrictEqual(
      responseJson.coverage[key],
      expectedValue,
      `Mismatch for coverage field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson.coverage[key])}`
    );
  }
});

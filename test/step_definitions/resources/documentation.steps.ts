import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';
import { parseDataTable } from '../support/utils/data-table-parser';

// Background setup
Given('an MCP server with Documentation resource capability', function(this: McpWorld) {
  // Register Documentation resource capability
  this.resources.registerResource('documentation');
});

Given('access to JavaScript/TypeScript project documentation at configured paths', function(this: McpWorld) {
  // Verify mock filesystem is configured
  assert(this.mocks.mockFs, 'Mock filesystem not initialized');
});

// Documentation setup
Given('a {string} codebase with documentation at {string}', function(this: McpWorld, projectType: string, docPath: string) {
  // Remove quotes if present
  this.resources.projectType = projectType.replace(/"/g, '');
  this.resources.projectPath = docPath.replace(/"/g, '');
});

Given('no documentation exists at {string}', function(this: McpWorld, docPath: string) {
  // Remove quotes if present
  this.resources.projectPath = docPath.replace(/"/g, '');
  // Flag invalid path
  this.resources.projectType = 'invalid';
});

Given('a project with {string} code comments at {string}', function(this: McpWorld, coverageLevel: string, docPath: string) {
  // Remove quotes if present
  this.resources.projectType = coverageLevel.replace(/"/g, '');
  this.resources.projectPath = docPath.replace(/"/g, '');
});

// Verification steps
Then('I receive complete documentation metadata including:', function(this: McpWorld, dataTable) {
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

Then('I receive standard documentation metadata', function(this: McpWorld) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  
  // Check standard fields
  const standardFields = ['readme', 'code_comments', 'tools', 'files', 'api_documentation'];
  for (const field of standardFields) {
    assert(responseJson[field] !== undefined, `Missing standard field: ${field}`);
  }
});

Then('I receive comment quality analysis:', function(this: McpWorld, dataTable) {
  // Get response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text,
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  const expected = parseDataTable(dataTable);
  
  // Verify comment analysis data
  assert(responseJson.comment_analysis, 'No comment analysis data in response');
  
  for (const [key, expectedValue] of Object.entries(expected)) {
    assert.deepStrictEqual(
      responseJson.comment_analysis[key],
      expectedValue,
      `Mismatch for comment analysis field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson.comment_analysis[key])}`
    );
  }
});

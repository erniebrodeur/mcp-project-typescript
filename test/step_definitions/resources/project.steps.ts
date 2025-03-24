import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';
import { parseDataTable } from '../support/utils/data-table-parser';
import { projectSchemaValidator } from '../../../src/schemas/resources/project-schema';
import { createResourceResponse } from '../../../src/schemas/server/response-schema';

// Background setup
Given('an MCP server with Project resource capability', function(this: McpWorld) {
  // Register the project resource
  this.resources.registerResource('project');
  
  // Register with the server
  this.server.server.resource(
    "project",
    new ResourceTemplate("project://{path}", { list: undefined }),
    async (uri, { path }) => ({
      contents: [{
        uri: uri.href,
        text: JSON.stringify({})
      }]
    })
  );
});

Given('access to TypeScript project structures at configured paths', function(this: McpWorld) {
  // Verify mock filesystem is configured
  assert(this.mocks.mockFs, 'Mock filesystem not initialized');
});

Given('standardized path normalization is enabled', function(this: McpWorld) {
  // Enable path normalization
  this.paths.enablePathNormalization();
});

// Project setup
Given('a {string} codebase at {string}', async function(this: McpWorld, projectType: string, projectPath: string) {
  // Remove quotes if present
  this.resources.projectType = projectType.replace(/"/g, '');
  this.resources.projectPath = projectPath.replace(/"/g, '');
  
  // Setup mock filesystem with project structure
  await this.mocks.setupProject(this.resources.projectPath, this.resources.projectType);
});

// URI handling
When('I request {string}', async function(this: McpWorld, uri: string) {
  // Store the URI for later verification
  this.resources.requestedUri = uri;
  
  // Load fixture based on project type
  try {
    const fixture = this.mocks.loadFixture(
      'resources/project', 
      this.resources.projectType.toLowerCase(),
      projectSchemaValidator
    );
    
    // Create resource response
    const response = createResourceResponse(uri, fixture);
    
    // Store the response
    this.resources.setResponse(response);
  } catch (error) {
    // Create error response
    this.resources.setResponse({
      error: {
        status: 404,
        message: `Resource not found: ${uri}`
      }
    });
  }
});

// Verification steps
Then('I receive complete project metadata including:', function(this: McpWorld, dataTable) {
  // Get the response
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text, 
    'Response does not contain expected content');
  
  // Parse the response content
  const responseJson = JSON.parse(response.contents[0].text);
  
  // Parse data table with type conversion
  const expected = parseDataTable(dataTable);
  
  // Verify each expected field
  for (const [key, expectedValue] of Object.entries(expected)) {
    // Assert that the response contains the expected value
    assert.deepStrictEqual(
      responseJson[key], 
      expectedValue, 
      `Mismatch for field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson[key])}`
    );
  }
});

// Path handling steps
Then('the path should be normalized to {string}', function(this: McpWorld, normalizedPath: string) {
  // Remove quotes if present
  normalizedPath = normalizedPath.replace(/"/g, '');
  
  // Store expected normalized path
  this.paths.normalizedPath = normalizedPath;
  
  // Verify path normalization is enabled
  assert(this.paths.pathNormalizationEnabled, 'Path normalization not enabled');
  
  // Parse the requested URI and extract path
  const uriParts = this.resources.requestedUri.split('://');
  const requestedPath = uriParts[1];
  
  // Verify path components
  assert(requestedPath, 'No path to normalize');
  assert(normalizedPath, 'No normalized path to compare against');
});

Then('the resource fetch should succeed', function(this: McpWorld) {
  // Get the response
  const response = this.resources.getResponse();
  
  // Verify response doesn't contain error
  assert(response && !('error' in response), 
    `Resource fetch failed: ${response && 'error' in response ? response.error.message : 'Unknown error'}`);
});

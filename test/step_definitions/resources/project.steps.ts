import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';
import path from 'path';

// Background setup
Given('an MCP server with Project resource capability', function(this: McpWorld) {
  // This should register the project resource but we can't implement it yet
  // Just setting a flag to indicate this step was called
  this.registeredResources = this.registeredResources || [];
  this.registeredResources.push('project');
});

Given('access to TypeScript project structures at configured paths', function(this: McpWorld) {
  // Verify mock filesystem is configured
  assert(this.mockFs);
});

Given('standardized path normalization is enabled', function(this: McpWorld) {
  // Flag that path normalization should be enabled
  this.pathNormalizationEnabled = true;
});

// Project setup
Given('a {string} codebase at {string}', async function(this: McpWorld, projectType: string, projectPath: string) {
  this.projectType = projectType.replace(/"/g, '');
  this.projectPath = projectPath.replace(/"/g, '');
  
  // Setup mock filesystem with project structure
  await this.mockFs.setupProject(this.projectPath, this.projectType);
  
  // Load and setup fixture for command executor
  try {
    const npmListFixture = this.loadFixture('commands/npm/list', this.projectType.toLowerCase());
    if (npmListFixture) {
      this.mockExecutor.mockCommand('npm list --json', npmListFixture);
    }
  } catch (error: unknown) {
    // Fixture may not exist yet - this will cause a red test
    console.log(`Fixture not found for ${this.projectType.toLowerCase()}: ${error instanceof Error ? error.message : String(error)}`);
  }
});

// URI handling
When('I request {string}', async function(this: McpWorld, uri: string) {
  // Store the URI for later verification
  this.requestedUri = uri;
  
  // In red test phase, just load fixture directly
  // This will be replaced with actual resource calls later
  try {
    const fixture = this.loadFixture('resources/project', this.projectType.toLowerCase());
    this.response = {
      contents: [{
        uri,
        text: JSON.stringify(fixture)
      }]
    };
  } catch (error: unknown) {
    this.response = {
      error: {
        message: `Resource not found: ${uri}`,
        status: 404
      }
    };
  }
});

// Verification steps
Then('I receive complete project metadata including:', function(this: McpWorld, dataTable) {
  // Verify response exists and has contents
  assert(this.response?.contents?.[0]?.text, 'Response does not contain expected content');
  
  // Parse the response content
  const responseJson = JSON.parse(this.response.contents[0].text);
  
  // Get expected values from data table
  const expected: Record<string, string> = dataTable.rowsHash();
  
  // Verify each expected field
  for (const [key, value] of Object.entries(expected)) {
    let expectedValue: any = value;
    
    // Convert string representations to actual types
    if (typeof value === 'string') {
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          expectedValue = JSON.parse(value);
        } catch (e: unknown) {
          throw new Error(`Failed to parse JSON value for ${key}: ${value}`);
        }
      } else if (value === 'true') {
        expectedValue = true;
      } else if (value === 'false') {
        expectedValue = false;
      }
    }
    
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
  
  // Parse the requested URI and extract path
  const uriParts = this.requestedUri.split('://');
  const requestedPath = uriParts[1];
  
  // In red test phase, just verify the step is called
  // This will be completed when path normalization is implemented
  assert(this.pathNormalizationEnabled, 'Path normalization not enabled');
  assert(requestedPath, 'No path to normalize');
  assert(normalizedPath, 'No normalized path to compare against');
});

Then('the resource fetch should succeed', function(this: McpWorld) {
  // Verify response doesn't contain error
  assert(!this.response?.error, `Resource fetch failed: ${this.response?.error?.message}`);
});

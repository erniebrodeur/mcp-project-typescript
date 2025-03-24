import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';
import path from 'path';

// Background setup
Given('an MCP server with Package resource capability', function(this: McpWorld) {
  // Register Package resource capability flag
  this.registeredResources = this.registeredResources || [];
  this.registeredResources.push('package');
});

Given('access to JavaScript/TypeScript package.json files at configured paths', function(this: McpWorld) {
  // Verify mock filesystem is configured
  assert(this.mockFs);
});

// Package.json setup
Given('a package.json file exists at {string}', function(this: McpWorld, packagePath: string) {
  // Store path for later use
  this.packagePath = packagePath.replace(/"/g, '');
  
  // We're not actually creating it here in the test phase
  // Just verifying the step is called
  assert(this.packagePath, 'No package.json path provided');
});

Given('no package.json exists at {string}', function(this: McpWorld, packagePath: string) {
  // Store invalid path for later use
  this.packagePath = packagePath.replace(/"/g, '');
  
  // Flag that this path should not have a package.json
  this.packageExists = false;
});

Given('a package.json with optional fields at {string}', function(this: McpWorld, packagePath: string) {
  // Store path for later use
  this.packagePath = packagePath.replace(/"/g, '');
  
  // Flag that this package has optional fields
  this.packageHasOptionalFields = true;
});

// Verification steps
Then('I receive standard package metadata', function(this: McpWorld) {
  // Verify response exists and has standard fields
  assert(this.response?.contents?.[0]?.text, 'Response does not contain expected content');
  
  const responseJson = JSON.parse(this.response.contents[0].text);
  
  // Check that required standard fields exist
  const requiredFields = ['name', 'version', 'dependencies', 'devDependencies', 'scripts'];
  for (const field of requiredFields) {
    assert(responseJson[field] !== undefined, `Missing required field: ${field}`);
  }
});

Then('I receive optional fields:', function(this: McpWorld, dataTable: any) {
  // Verify response exists
  assert(this.response?.contents?.[0]?.text, 'Response does not contain expected content');
  
  const responseJson = JSON.parse(this.response.contents[0].text);
  const expected: Record<string, string> = dataTable.rowsHash();
  
  // Check each expected optional field
  for (const [key, value] of Object.entries(expected)) {
    let expectedValue: any = value;
    
    // Convert string representations to actual types
    if (typeof value === 'string') {
      if (value === 'null') {
        expectedValue = null;
      } else if (value.startsWith('{') || value.startsWith('[')) {
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
    
    assert.deepStrictEqual(
      responseJson[key],
      expectedValue,
      `Mismatch for optional field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson[key])}`
    );
  }
});

Then('I receive an error response with:', function(this: McpWorld, dataTable: any) {
  // Verify error response exists
  assert(this.response?.error, 'Expected error response not received');
  
  const expected: Record<string, string> = dataTable.rowsHash();
  
  // Check error status
  if (expected.status) {
    const expectedStatus = parseInt(expected.status, 10);
    assert.strictEqual(
      this.response.error.status,
      expectedStatus,
      `Error status mismatch: expected ${expectedStatus} but got ${this.response.error.status}`
    );
  }
  
  // Check error message
  if (expected.message) {
    // Remove quotes if present
    const expectedMessage = expected.message.replace(/^"(.*)"$/, '$1');
    assert.strictEqual(
      this.response.error.message,
      expectedMessage,
      `Error message mismatch: expected "${expectedMessage}" but got "${this.response.error.message}"`
    );
  }
});

// Path handling
Then('the path should be normalized to {string}', function(this: McpWorld, normalizedPath: string) {
  // Remove quotes if present
  normalizedPath = normalizedPath.replace(/"/g, '');
  
  // Store for later verification when path normalization is implemented
  this.normalizedPath = normalizedPath;
  
  // In red test phase, we just verify the step is called
  assert(this.pathNormalizationEnabled, 'Path normalization not enabled');
  assert(normalizedPath, 'No normalized path to compare against');
});

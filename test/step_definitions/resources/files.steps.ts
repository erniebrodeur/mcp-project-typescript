import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';

// Background setup
Given('an MCP server with Files resource capability', function(this: McpWorld) {
  // Use the new resources context instead of direct property access
  this.resources.registerResource('files');
});

Given('access to JavaScript/TypeScript project files at configured paths', function(this: McpWorld) {
  // Verify mock filesystem is configured
  assert(this.mocks.mockFs, 'Mock filesystem not initialized');
});

// File structure parsing
Then('I receive file organization data including:', function(this: McpWorld, dataTable: any) {
  // Get the response from resource context
  const response = this.resources.getResponse();
  
  // Verify response exists and has contents
  assert(response && 'contents' in response && response.contents[0]?.text, 
    'Response does not contain expected content');
  
  const responseJson = JSON.parse(response.contents[0].text);
  const expected: Record<string, string> = dataTable.rowsHash();
  
  // Check each expected field
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
    
    // Handle nested objects differently than arrays
    if (key.includes('_')) {
      // For fields like "organization_pattern", split by underscore
      const parts = key.split('_');
      let currentObj = responseJson;
      
      // Navigate to the nested object
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        assert(currentObj[part] !== undefined, `Missing nested field: ${part} in ${key}`);
        currentObj = currentObj[part];
      }
      
      // Check the value
      const lastPart = parts[parts.length - 1];
      assert.deepStrictEqual(
        currentObj[lastPart],
        expectedValue,
        `Mismatch for field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(currentObj[lastPart])}`
      );
    } else {
      // Direct field
      assert.deepStrictEqual(
        responseJson[key],
        expectedValue,
        `Mismatch for field ${key}: expected ${JSON.stringify(expectedValue)} but got ${JSON.stringify(responseJson[key])}`
      );
    }
  }
});

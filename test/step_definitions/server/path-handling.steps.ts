import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';

// Background setup
Given('an MCP server with path handling capability', function(this: McpWorld) {
  // Setting flag to indicate this server has path handling capability
  this.pathHandlingEnabled = true;
});

Given('the following project roots:', function(this: McpWorld, dataTable) {
  // Store the project roots
  this.projectRoots = dataTable.raw().map((row: string[]) => row[0]);
});

// Path normalization steps
When('a path {string} is normalized', function(this: McpWorld, inputPath: string) {
  // Store input path for later normalization
  this.inputPath = inputPath;
  
  // In red test phase, we'll just store this but not actually normalize yet
  // This will be stubbed out until we implement the actual path normalization
  this.normalizedPath = 'NORMALIZED_STUB';
});

Then('the result should be {string}', function(this: McpWorld, expectedPath: string) {
  // Verify path normalization is enabled and input path exists
  assert(this.pathHandlingEnabled, 'Path handling not enabled');
  assert(this.inputPath, 'No input path to normalize');
  
  // In red test phase, we'll stub this out to fail
  // asserting that expectedPath exists but not comparing it yet
  assert(expectedPath, 'No expected normalized path to compare against');
  
  // This will make the test fail until we implement path normalization
  assert.strictEqual(this.normalizedPath, expectedPath, 
    `Path normalization failed: expected ${expectedPath} but got ${this.normalizedPath}`);
});

// URI processing steps
When('a URI {string} is processed with template {string}', function(this: McpWorld, uri: string, template: string) {
  // Store URI and template for later extraction
  this.uri = uri;
  this.uriTemplate = template;
  
  // In red test phase, we'll stub this but not actually extract
  this.extractedParam = 'EXTRACTED_STUB';
});

Then('path parameter extraction should produce {string}', function(this: McpWorld, expectedParam: string) {
  // Verify URI and template exist
  assert(this.uri, 'No URI to process');
  assert(this.uriTemplate, 'No URI template to match against');
  
  // In red test phase, we'll stub this out to fail
  assert(expectedParam, 'No expected parameter to compare against');
  
  // This will make the test fail until we implement URI parameter extraction
  assert.strictEqual(this.extractedParam, expectedParam,
    `Parameter extraction failed: expected ${expectedParam} but got ${this.extractedParam}`);
});

// Security validation steps
Then('the path security validation result should be {string}', function(this: McpWorld, expectedResult: string) {
  // In red test phase, we'll just verify the step is called
  assert(this.pathHandlingEnabled, 'Path handling not enabled');
  assert(this.inputPath, 'No input path to validate');
  
  // This will make the test fail until we implement security validation
  this.securityResult = 'STUB_INVALID'; // Not matching any expected result
  assert.strictEqual(this.securityResult, expectedResult,
    `Security validation failed: expected ${expectedResult} but got ${this.securityResult}`);
});

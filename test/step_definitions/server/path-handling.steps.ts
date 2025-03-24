import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';

// Background setup
Given('an MCP server with path handling capability', function(this: McpWorld) {
  // Setting flag to indicate this server has path handling capability
  this.paths.enablePathNormalization();
});

Given('the following project roots:', function(this: McpWorld, dataTable) {
  // Store the project roots
  dataTable.raw().forEach((row: string[]) => this.paths.addProjectRoot(row[0]));
});

// Path normalization steps
When('a path {string} is normalized', function(this: McpWorld, inputPath: string) {
  // Store input path for later normalization
  this.paths.setCurrentPath(inputPath);
  
  // In red test phase, we'll just store this but not actually normalize yet
  // This will be stubbed out until we implement the actual path normalization
  this.paths.normalizedPath = 'NORMALIZED_STUB';
});

Then('the result should be {string}', function(this: McpWorld, expectedPath: string) {
  // Verify path normalization is enabled and input path exists
  assert(this.paths.pathNormalizationEnabled, 'Path handling not enabled');
  assert(this.paths.currentPath, 'No input path to normalize');
  
  // In red test phase, we'll stub this out to fail
  // asserting that expectedPath exists but not comparing it yet
  assert(expectedPath, 'No expected normalized path to compare against');
  
  // This will make the test fail until we implement path normalization
  assert.strictEqual(this.paths.normalizedPath, expectedPath, 
    `Path normalization failed: expected ${expectedPath} but got ${this.paths.normalizedPath}`);
});

// URI processing steps
When('a URI {string} is processed with template {string}', function(this: McpWorld, uri: string, template: string) {
  // Store URI and template for later extraction
  this.paths.uri = uri;
  this.paths.uriTemplate = template;
  
  // In red test phase, we'll stub this but not actually extract
  this.paths.extractedParam = 'EXTRACTED_STUB';
});

Then('path parameter extraction should produce {string}', function(this: McpWorld, expectedParam: string) {
  // Verify URI and template exist
  assert(this.paths.uri, 'No URI to process');
  assert(this.paths.uriTemplate, 'No URI template to match against');
  
  // In red test phase, we'll stub this out to fail
  assert(expectedParam, 'No expected parameter to compare against');
  
  // This will make the test fail until we implement URI parameter extraction
  assert.strictEqual(this.paths.extractedParam, expectedParam,
    `Parameter extraction failed: expected ${expectedParam} but got ${this.paths.extractedParam}`);
});

// Security validation steps
Then('the path security validation result should be {string}', function(this: McpWorld, expectedResult: string) {
  // In red test phase, we'll just verify the step is called
  assert(this.paths.pathNormalizationEnabled, 'Path handling not enabled');
  assert(this.paths.currentPath, 'No input path to validate');
  
  // This will make the test fail until we implement security validation
  this.paths.securityResult = 'STUB_INVALID'; // Not matching any expected result
  assert.strictEqual(this.paths.securityResult, expectedResult,
    `Security validation failed: expected ${expectedResult} but got ${this.paths.securityResult}`);
});

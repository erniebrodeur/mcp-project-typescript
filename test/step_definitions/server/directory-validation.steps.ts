import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';
import { PathValidationStatus } from '../../../src/schemas/common/path-handling';

// Setup steps
Given('the MCP server is initialized', function(this: McpWorld) {
  // Already initialized in world.ts constructor
  assert(this.server, 'Server not initialized');
});

Given('directory validation is configured', function(this: McpWorld) {
  // Configure with some approved directories for testing
  this.paths.approvedDirectories = [
    '/approved/project/path',
    '/project/src'
  ];
});

Given('standardized path normalization is enabled', function(this: McpWorld) {
  this.paths.enablePathNormalization();
});

// Directory validation steps
When('a tool attempts to operate in an approved directory', function(this: McpWorld) {
  this.paths.setCurrentPath('/approved/project/path/subdir');
  
  // In red test phase, we'll stub this out but not actually implement validation
  // Stub validation result - will fail in red phase
  this.paths.validationResult = {
    status: PathValidationStatus.Invalid,
    normalizedPath: '/approved/project/path/subdir',
    originalPath: '/approved/project/path/subdir',
    isApproved: false // Will make test fail until implemented
  };
});

When('a tool attempts to operate in an unapproved directory', function(this: McpWorld) {
  this.paths.setCurrentPath('/unapproved/directory');
  
  // In red test phase, we'll stub this out but not actually implement validation
  // Stub validation result - will fail in red phase
  this.paths.validationResult = {
    status: PathValidationStatus.Invalid,
    normalizedPath: '/unapproved/directory',
    originalPath: '/unapproved/directory',
    isApproved: true // Will make test fail until implemented
  };
});

When('a tool attempts to access path {string}', function(this: McpWorld, path: string) {
  this.paths.setCurrentPath(path);
  
  // In red test phase, we'll stub this but not actually implement validation
  // Stub validation result - will fail in red phase
  this.paths.validationResult = {
    status: PathValidationStatus.Invalid,
    normalizedPath: path,
    originalPath: path,
    isApproved: false // Will make test fail until implemented
  };
});

// Configuration steps
When('I configure approved directories:', function(this: McpWorld, dataTable) {
  // Get directories from data table
  const directories = dataTable.hashes().map((row: { directory: string }) => row.directory);
  this.paths.approvedDirectories = directories;
});

// Verification steps
Then('the validation result should be {string}', function(this: McpWorld, result: string) {
  const expected = result === 'success';
  
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult, expected, 
    `Directory validation failed: expected ${expected} but got ${this.paths.validationResult}`);
});

Then('the operation should be permitted', function(this: McpWorld) {
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult, true, 'Operation should be permitted');
});

Then('the directory validation should return success', function(this: McpWorld) {
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult, true, 'Validation should succeed');
});

Then('the operation should be blocked', function(this: McpWorld) {
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult, false, 'Operation should be blocked');
});

Then('the directory validation should return an error message', function(this: McpWorld) {
  // In red test phase, we'll assert the step is called but not check the message
  assert.strictEqual(this.paths.validationResult, false, 'Validation should fail');
});

Then('the error should indicate access restriction', function(this: McpWorld) {
  // In red test phase, we'll assert the step is called but not check the message
  assert.strictEqual(this.paths.validationResult, false, 'Validation should fail with access restriction');
});

Then('operations within these directories should be permitted', function(this: McpWorld) {
  // Will be implemented with proper validation
  assert(this.paths.approvedDirectories.length > 0, 'No approved directories configured');
});

Then('operations outside these directories should be blocked', function(this: McpWorld) {
  // Will be implemented with proper validation
  assert(this.paths.approvedDirectories.length > 0, 'No approved directories configured');
});

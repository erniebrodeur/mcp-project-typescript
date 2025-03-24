import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';
import { PathValidationStatus } from '../../../src/schemas/common/path-handling';

// Setup steps
Given('the MCP server is initialized', function(this: McpWorld) {
  assert(this.server.server, 'Server not initialized');
  assert(this.server.isInitialized, 'Server initialization flag not set');
});

Given('directory validation is configured', function(this: McpWorld) {
  // Configure with some approved directories for testing
  this.paths.addApprovedDirectory('/approved/project/path');
  this.paths.addApprovedDirectory('/project/src');
});

Given('standardized path normalization is enabled', function(this: McpWorld) {
  this.paths.enablePathNormalization();
});

// Directory validation steps
When('a tool attempts to operate in an approved directory', function(this: McpWorld) {
  this.paths.setCurrentPath('/approved/project/path/subdir');
  
  // Stub validation result - will fail in red phase
  this.paths.validationResult = {
    status: PathValidationStatus.Invalid, // Will make test fail
    normalizedPath: '/approved/project/path/subdir',
    originalPath: '/approved/project/path/subdir',
    isApproved: false // Will make test fail
  };
});

When('a tool attempts to operate in an unapproved directory', function(this: McpWorld) {
  this.paths.setCurrentPath('/unapproved/directory');
  
  // Stub validation result - will fail in red phase
  this.paths.validationResult = {
    status: PathValidationStatus.Invalid,
    normalizedPath: '/unapproved/directory',
    originalPath: '/unapproved/directory',
    isApproved: true // Will make test fail
  };
});

When('a tool attempts to access path {string}', function(this: McpWorld, path: string) {
  this.paths.setCurrentPath(path);
  
  // Stub validation result - will fail in red phase
  this.paths.validationResult = {
    status: PathValidationStatus.Invalid,
    normalizedPath: path,
    originalPath: path,
    isApproved: false // Will make test fail
  };
});

// Configuration steps
When('I configure approved directories:', function(this: McpWorld, dataTable) {
  // Get directories from data table
  const directories = dataTable.hashes().map((row: { directory: string }) => row.directory);
  
  // Add each directory
  directories.forEach((dir: string) => this.paths.addApprovedDirectory(dir));
});

// Verification steps
Then('the validation result should be {string}', function(this: McpWorld, result: string) {
  const expected = result === 'success';
  
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult?.isApproved, expected, 
    `Directory validation failed: expected ${expected} but got ${this.paths.validationResult?.isApproved}`);
});

Then('the operation should be permitted', function(this: McpWorld) {
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult?.isApproved, true, 'Operation should be permitted');
});

Then('the directory validation should return success', function(this: McpWorld) {
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult?.isApproved, true, 'Validation should succeed');
});

Then('the operation should be blocked', function(this: McpWorld) {
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult?.isApproved, false, 'Operation should be blocked');
});

Then('the directory validation should return an error message', function(this: McpWorld) {
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult?.isApproved, false, 'Validation should fail');
});

Then('the error should indicate access restriction', function(this: McpWorld) {
  // This will fail in red test phase
  assert.strictEqual(this.paths.validationResult?.status, PathValidationStatus.Invalid, 
    'Validation should fail with access restriction');
});

Then('operations within these directories should be permitted', function(this: McpWorld) {
  assert(this.paths.approvedDirectories.length > 0, 'No approved directories configured');
  // This will be implemented with proper validation in green phase
});

Then('operations outside these directories should be blocked', function(this: McpWorld) {
  assert(this.paths.approvedDirectories.length > 0, 'No approved directories configured');
  // This will be implemented with proper validation in green phase
});

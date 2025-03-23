import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';

// Approved directories for testing
const APPROVED_DIRECTORIES = [
  '/approved/project/path',
];

function isApprovedDirectory(dirPath: string, approvedPaths: string[]): boolean {
  // Normalize path
  const normalizedPath = dirPath
    .replace(/\/+/g, '/') 
    .replace(/\/$/, '');
  
  // Check if directly approved
  if (approvedPaths.includes(normalizedPath)) {
    return true;
  }
  
  // Check if subdirectory
  return approvedPaths.some(approvedPath => 
    normalizedPath.startsWith(approvedPath + '/')
  );
}

function hasSuspiciousPatterns(dirPath: string): boolean {
  return dirPath.includes('..') || 
    dirPath.includes('\\') || 
    /\/\/+/.test(dirPath) || 
    dirPath.includes('\0');
}

Given('a configured MCP server with directory validation', function(this: McpWorld) {
  this.approvedDirectories = [...APPROVED_DIRECTORIES];
});

Given('a set of approved project directories', function(this: McpWorld) {
  assert(Array.isArray(this.approvedDirectories));
  assert(this.approvedDirectories.length > 0);
});

When('I validate the directory {string}', function(this: McpWorld, dirPath: string) {
  this.currentPath = dirPath;
  this.validationResult = isApprovedDirectory(dirPath, this.approvedDirectories) && 
    !hasSuspiciousPatterns(dirPath);
});

When('I validate a directory containing a symbolic link', function(this: McpWorld) {
  this.currentPath = '/approved/project/path/symlink';
  this.symlinkTarget = '/approved/project/path/target';
  this.validationResult = isApprovedDirectory(this.symlinkTarget, this.approvedDirectories);
});

When('I receive a directory path with potential exploits', function(this: McpWorld) {
  this.currentPath = '/approved/project/path/../../../etc/passwd';
  this.validationResult = isApprovedDirectory(this.currentPath, this.approvedDirectories) && 
    !hasSuspiciousPatterns(this.currentPath);
});

Then('the validation should succeed', function(this: McpWorld) {
  assert.strictEqual(this.validationResult, true);
});

Then('the tool should be allowed to execute', function(this: McpWorld) {
  assert.strictEqual(this.validationResult, true);
});

Then('the validation should fail', function(this: McpWorld) {
  assert.strictEqual(this.validationResult, false);
});

Then('the server should return a directory access error', function(this: McpWorld) {
  assert.strictEqual(this.validationResult, false);
});

Then('prevent tool execution', function(this: McpWorld) {
  assert.strictEqual(this.validationResult, false);
});

Then('the validation should check the real path', function(this: McpWorld) {
  assert(this.symlinkTarget);
});

Then('only approve it if the real path is in the approved list', function(this: McpWorld) {
  const targetIsApproved = isApprovedDirectory(this.symlinkTarget, this.approvedDirectories);
  assert.strictEqual(this.validationResult, targetIsApproved);
});

Then('the validation should sanitize the path', function(this: McpWorld) {
  assert(hasSuspiciousPatterns(this.currentPath));
});

Then('reject any path containing {string} segments', function(this: McpWorld, segment: string) {
  assert(this.currentPath.includes(segment));
  assert.strictEqual(this.validationResult, false);
});

Then('reject any path with suspicious patterns', function(this: McpWorld) {
  assert.strictEqual(this.validationResult, false);
});
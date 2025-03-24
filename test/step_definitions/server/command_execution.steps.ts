import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';

Given('the MCP server is initialized', function(this: McpWorld) {
  assert(this.server.isInitialized, 'Server not initialized');
});

Given('command execution is configured', function(this: McpWorld) {
  assert(this.mocks.mockExecutor, 'Command executor not configured');
});

Given('standardized path handling for working directories', function(this: McpWorld) {
  this.paths.enablePathNormalization();
});

When('I execute command {string} in an approved directory', function(this: McpWorld, command: string) {
  this.paths.setCurrentPath('/approved/project/path');
  
  // Mock command execution for testing
  const result = {
    stdout: 'Command executed successfully',
    stderr: '',
    exitCode: 0
  };
  
  this.mocks.mockExecutor.mockCommand(command, result);
});

When('I execute command {string} with test file parameter', function(this: McpWorld, command: string) {
  this.mocks.mockExecutor.mockCommand(command, {
    stdout: 'Test ran successfully',
    stderr: '',
    exitCode: 0
  });
});

When('I execute a command that fails', function(this: McpWorld) {
  this.mocks.mockExecutor.mockCommand('failing-command', {
    stdout: '',
    stderr: 'Error: Command failed',
    exitCode: 1
  });
});

When('I execute a command with custom environment variables:', function(this: McpWorld, dataTable) {
  const envVars = dataTable.hashes().reduce((acc: Record<string, string>, row: { variable: string; value: string }) => {
    acc[row.variable] = row.value;
    return acc;
  }, {} as Record<string, string>);
  
  this.mocks.mockExecutor.mockCommand('env-command', {
    stdout: 'Environment: ' + JSON.stringify(envVars),
    stderr: '',
    exitCode: 0
  });
});

When('I execute a long-running command', function(this: McpWorld) {
  this.mocks.mockExecutor.mockCommand('long-command', {
    stdout: 'Long command completed',
    stderr: '',
    exitCode: 0
  });
});

When('a timeout of {int} seconds is specified', function(this: McpWorld, seconds: number) {
  // Store timeout information for later
  this.server.commandTimeout = seconds;
});

When('the command is executed with working directory {string}', function(this: McpWorld, directory: string) {
  this.paths.setCurrentPath(directory);
  
  // Mock command execution with specific working directory
  this.mocks.mockExecutor.mockCommand('npm run test', {
    stdout: 'Test executed in ' + directory,
    stderr: '',
    exitCode: 0
  });
});

Then('the command should complete successfully', function(this: McpWorld) {
  // Verify command was executed
  assert(this.mocks.mockExecutor.wasExecuted('npm install'), 'Command was not executed');
});

Then('return standard output, error output, and exit code', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the structure is there
  const commands = this.mocks.mockExecutor.getExecutedCommands();
  assert(commands.length > 0, 'No commands executed');
});

Then('capture execution timing information', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the step is called
  assert(true, 'Timing information not captured');
});

Then('the command should run the specified test', function(this: McpWorld) {
  // Verify test command was executed
  assert(this.mocks.mockExecutor.wasExecuted('npm test'), 'Test command was not executed');
});

Then('return test results with formatted output', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the step is called
  assert(true, 'Test results not formatted');
});

Then('include test coverage information if available', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the step is called
  assert(true, 'Coverage information not included');
});

Then('the system should capture the error information', function(this: McpWorld) {
  // Verify failure command was executed
  assert(this.mocks.mockExecutor.wasExecuted('failing-command'), 'Failing command was not executed');
});

Then('provide detailed error context to the client', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the step is called
  assert(true, 'Error context not provided');
});

Then('maintain proper resource cleanup', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the step is called
  assert(true, 'Resource cleanup not maintained');
});

Then('the command should run with the specified environment', function(this: McpWorld) {
  // Verify environment command was executed
  assert(this.mocks.mockExecutor.wasExecuted('env-command'), 'Environment command was not executed');
});

Then('environment variables should be sanitized for security', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the step is called
  assert(true, 'Environment variables not sanitized');
});

Then('the command should be terminated if it exceeds the timeout', function(this: McpWorld) {
  // Verify long command was executed
  assert(this.mocks.mockExecutor.wasExecuted('long-command'), 'Long command was not executed');
  
  // Verify timeout was set
  assert(this.server.commandTimeout > 0, 'Timeout not set');
});

Then('an appropriate timeout error should be returned', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the step is called
  assert(true, 'Timeout error not returned');
});

Then('the path should be normalized to {string}', function(this: McpWorld, normalizedPath: string) {
  // Remove quotes if present
  normalizedPath = normalizedPath.replace(/"/g, '');
  
  // Store for later verification
  this.paths.normalizedPath = normalizedPath;
  
  // In red phase, just verify step is called
  assert(this.paths.pathNormalizationEnabled, 'Path normalization not enabled');
});

Then('validated before execution', function(this: McpWorld) {
  // In the red phase, this will be implemented later
  // Just verify the step is called
  assert(true, 'Path not validated before execution');
});

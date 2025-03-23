Feature: Command Execution
  As a developer implementing JS/TS tools
  I want to safely execute shell commands
  So that LLMs can interact with development tools

  @uses_path_handling

  Background:
    Given the MCP server is initialized
    And command execution is configured
    And standardized path handling for working directories

  Scenario: Execute npm command in approved directory
    When I execute command "npm install" in an approved directory
    Then the command should complete successfully
    And return standard output, error output, and exit code
    And capture execution timing information

  Scenario: Execute test runner command
    When I execute command "npm test" with test file parameter
    Then the command should run the specified test
    And return test results with formatted output
    And include test coverage information if available

  Scenario: Handle command execution errors
    When I execute a command that fails
    Then the system should capture the error information
    And provide detailed error context to the client
    And maintain proper resource cleanup

  Scenario: Command execution with environment variables
    When I execute a command with custom environment variables:
      | variable    | value       |
      | NODE_ENV    | development |
      | DEBUG       | true        |
    Then the command should run with the specified environment
    And environment variables should be sanitized for security

  Scenario: Command execution with timeout
    When I execute a long-running command
    And a timeout of 30 seconds is specified
    Then the command should be terminated if it exceeds the timeout
    And an appropriate timeout error should be returned

  @path_handling
  Scenario Outline: Working directory path normalization
    Given a command "npm run test" to be executed
    When the command is executed with working directory "<input_dir>"
    Then the path should be normalized to "<normalized_dir>"
    And validated before execution
    
    Examples:
      | input_dir                     | normalized_dir                  |
      | ./test                        | {project_root}/test             |
      | ../invalid                    | {project_root}                  |
      | /approved/project/src/        | /approved/project/src           |
@uses_path_handling
Feature: Tool System
  As a developer implementing JS/TS tools
  I want to define and expose tools
  So that LLMs can execute development operations

  Background:
    Given the MCP server is initialized
    And tool capability is enabled
    And standardized path handling for tool parameters

  Scenario: Register npm install tool
    When I register a tool with:
      | name         | description                    |
      | npm_install  | Install npm dependencies       |
    And define parameters:
      | parameter  | type    | required | description               |
      | directory  | string  | true     | Project directory         |
      | packages   | array   | false    | Optional specific packages|
      | dev        | boolean | false    | Install as dev dependency |
    Then the tool should be available to clients
    And validate parameters before execution

  Scenario: Register test execution tool
    When I register a tool with:
      | name           | description                |
      | test_run_file  | Run a specific test file   |
    And define parameters:
      | parameter  | type    | required | description               |
      | directory  | string  | true     | Project directory         |
      | file       | string  | true     | Test file path            |
      | framework  | string  | false    | Test framework            |
      | coverage   | boolean | false    | Generate coverage report  |
    Then the tool should be available to clients
    And validate parameters before execution

  Scenario: Tool discovery mechanism
    Given I have registered multiple tools
    When a client requests available tools
    Then all registered tools should be listed
    And include their parameter schemas and descriptions

  Scenario: Tool execution with parameter validation
    When a client calls a tool with invalid parameters
    Then the server should return a validation error
    And not execute the command

  Scenario: Tool execution with successful result
    When a client calls a tool with valid parameters
    Then the server should execute the command
    And return the result in the prescribed format

  @path_handling
  Scenario Outline: Tool directory parameter normalization
    Given a registered tool "npm_install"
    When executed with directory parameter "<input_dir>"
    Then the path should be normalized to "<normalized_dir>"
    And validated before command execution
    
    Examples:
      | input_dir                     | normalized_dir                  |
      | ./project                     | {project_root}/project          |
      | ../outside                    | {project_root}                  |
      | /approved/project/            | /approved/project               |
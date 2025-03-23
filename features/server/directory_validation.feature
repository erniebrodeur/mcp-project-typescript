Feature: Directory Validation
  As a developer implementing secure JS/TS tools
  I want to validate directory access
  So that operations only occur in approved paths

  @uses_path_handling

  Background:
    Given the MCP server is initialized
    And directory validation is configured
    And standardized path normalization is enabled

  Scenario: Validate approved directory operations
    When a tool attempts to operate in an approved directory
    Then the operation should be permitted
    And the directory validation should return success

  Scenario: Block unapproved directory operations
    When a tool attempts to operate in an unapproved directory
    Then the operation should be blocked
    And the directory validation should return an error message
    And the error should indicate access restriction

  Scenario Outline: Directory validation with different path formats
    When a tool attempts to access path "<path>"
    Then the validation result should be "<result>"
    
    Examples:
      | path                     | result  |
      | /approved/directory      | success |
      | /approved/directory/file | success |
      | /unapproved/directory    | error   |
      | ../escape/attempt        | error   |

  Scenario: Configure approved directories
    Given I have an initialized MCP server
    When I configure approved directories:
      | directory              |
      | /project/src           |
      | /project/test          |
    Then operations within these directories should be permitted
    And operations outside these directories should be blocked

  @path_handling
  Scenario: Resource path normalization
    When a resource URI template is defined as "resource://{path}"
    Then the path parameter should be normalized before validation
    And validated against approved directories

  Scenario Outline: Resource parameter validation
    When a URI "<uri>" is processed
    Then path parameter extraction should handle:
      | parameter | value           | validation_result |
      | path      | <extracted>     | <valid>           |
    
    Examples:
      | uri                                   | extracted                         | valid  |
      | project://./relative                  | {project_root}/relative           | true   |
      | package://../dangerous                | {project_root}                    | true   |
      | testing://unapproved/path             | unapproved/path                   | false  |
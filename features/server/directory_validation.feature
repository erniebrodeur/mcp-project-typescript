Feature: Directory Validation
  As a developer implementing secure JS/TS tools
  I want to validate directory access
  So that operations only occur in approved paths

  Background:
    Given the MCP server is initialized
    And directory validation is configured

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
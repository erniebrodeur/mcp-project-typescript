Feature: Base Resource Path Handling
  As an MCP server developer
  I want standardized resource path handling
  So all resources process paths consistently

  Background:
    Given an MCP server with resource capability
    And the following project roots:
      | ~/Projects/mcp-project-typescript |

  @path_normalization
  Scenario Outline: Resource path normalization
    When a resource is requested with "<resource_type>://<input_path>"
    Then the normalized URI should be "<resource_type>://<normalized_path>"
    
    Examples:
      | resource_type | input_path                                 | normalized_path                           |
      | project       | ./relative                                 | {project_root}/relative                   |
      | package       | ../outside                                 | {project_root}                            |
      | testing       | /absolute/path/                            | /absolute/path                            |
      | files         | ~/Projects/mcp-project-typescript/extra/   | ~/Projects/mcp-project-typescript/extra   |
      | documentation | ~/Projects/mcp-project-typescript/../other | ~/Projects/mcp-project-typescript         |

  Scenario: Common path validation
    When validating a resource path
    Then the server should:
      | validation_check           | action                                    |
      | Path traversal prevention  | Block paths with suspicious patterns      |
      | Directory existence        | Verify directory exists before processing |
      | Path normalization         | Apply consistent format to all paths      |
      | Context resolution         | Resolve relative paths against project root |
      
  @resource_errors
  Scenario Outline: Resource path validation errors
    When a resource is requested with an invalid path "<invalid_path>"
    Then the response should include error:
      | status_code | <status_code> |
      | message     | <message>     |
    
    Examples:
      | invalid_path                 | status_code | message                                      |
      | /unapproved/dir              | 403         | Directory not in approved project roots      |
      | ../../../../../etc/passwd    | 403         | Path traversal attempt detected              |
      | nonexistent/dir              | 404         | Directory does not exist                     |
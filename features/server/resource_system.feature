@uses_path_handling
Feature: Resource System
  As a developer implementing JS/TS tools
  I want to define and expose resources
  So that LLMs can access project information

  Background:
    Given the MCP server is initialized
    And resource capability is enabled
    And standardized path handling is configured

  Scenario: Register project resource
    When I register a resource with:
      | name    | uri_template       |
      | project | project://{path}   |
    Then the resource should be available to clients
    And provide project structure information for JS/TS projects

  Scenario: Register package resource
    When I register a resource with:
      | name    | uri_template       |
      | package | package://{path}   |
    Then the resource should be available to clients
    And provide package.json metadata when requested

  Scenario: Resource with dynamic content generation
    When I register a resource with dynamic content generation
    Then the resource should generate content based on request parameters
    And validate parameters before processing
    And return appropriate error for invalid parameters

  Scenario: Resource discovery mechanism
    Given I have registered multiple resources
    When a client requests available resources
    Then all registered resources should be listed
    And include their URI templates and descriptions

  Scenario: Resource read operation
    When a client reads a resource with URI "project:///path/to/project"
    Then the server should validate the directory
    And generate the resource content
    And return it in the prescribed format

  @path_handling
  Scenario: Common resource URI template handling
    When I define resource URI templates
    Then all resources should use standardized path handling for:
      | template_format     | example                    |
      | {type}://{path}     | project://{path}           |
      | {type}://{path}/{id}| files://{path}/component   |
    And apply consistent path normalization
    And apply consistent security validation
    
  Scenario: Resource path context sharing
    Given multiple resources registered with path parameters
    When resources are accessed with the same base path
    Then all resources should resolve to the same project context
    And maintain consistent path normalization across resources
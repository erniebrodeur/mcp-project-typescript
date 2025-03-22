Feature: Resource System
  As a developer implementing JS/TS tools
  I want to define and expose resources
  So that LLMs can access project information

  Background:
    Given the MCP server is initialized
    And resource capability is enabled

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
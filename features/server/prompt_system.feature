Feature: Prompt System
  As a developer implementing JS/TS tools
  I want to define and expose prompt templates
  So that LLMs can use standardized interaction patterns

  Background:
    Given the MCP server is initialized
    And prompt capability is enabled

  Scenario: Register feature prompt template
    When I register a prompt with:
      | name    | description                        |
      | feature | Generate BDD feature for resource  |
    And define parameters:
      | parameter        | type    | required | description              |
      | resource_name    | string  | true     | Name of the resource     |
      | initial_definition | string  | true   | Initial resource definition |
    Then the prompt should be available to clients
    And include parameter validation

  Scenario: Register resource documentation prompt
    When I register a prompt with:
      | name        | description                            |
      | resource_doc| Generate documentation for a resource  |
    And define parameters:
      | parameter    | type    | required | description              |
      | resource_name| string  | true     | Name of the resource     |
      | description  | string  | true     | Resource description     |
    Then the prompt should be available to clients
    And include parameter validation

  Scenario: Prompt discovery mechanism
    Given I have registered multiple prompts
    When a client requests available prompts
    Then all registered prompts should be listed
    And include their parameter schemas and descriptions

  Scenario: Prompt template retrieval
    When a client requests a prompt with parameters:
      | resource_name    | description         |
      | project          | Project information |
    Then the server should validate the parameters
    And return the formatted prompt template
    And include message structure as defined
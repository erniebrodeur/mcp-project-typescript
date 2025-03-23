@uses_path_handling
Feature: MCP Core Server
  As a developer implementing JavaScript/TypeScript tools
  I want to create an MCP server core
  So that I can expose JS/TS development tools to LLM applications

  Background:
    Given the MCP TypeScript SDK is installed
    And the required server components are available
    And standardized path handling is configured

  Scenario: Initialize server with JavaScript/TypeScript tools capability
    When I create a new McpServer instance
    And configure it with name "JSTools" and version "1.0.0"
    Then the server should be initialized with correct metadata
    And prepared to register JS/TS development tools

  Scenario: Server registers required capabilities
    Given I have an initialized McpServer
    When I register server capabilities
    Then the server should support tools for npm, testing, linting, and building
    And respond to capability discovery requests from clients

  Scenario: Server handles connection with transport layer
    Given I have an initialized McpServer
    When I connect it to a transport mechanism
    Then the server should establish communication channels
    And begin processing incoming client requests

  Scenario: Server manages client session lifecycle
    Given I have a running McpServer
    When a client connects to the server
    Then the server should maintain the client session state
    And properly clean up resources when the session ends

  @path_handling
  Scenario: Server path handling configuration
    When the server initializes
    Then it should configure path handling with:
      | setting                | value                          |
      | project_root          | process.cwd()                  |
      | path_normalization    | enabled                        |
      | path_security         | enabled                        |
    And register path utilities for use by resources and tools
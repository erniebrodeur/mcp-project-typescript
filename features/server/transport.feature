Feature: Transport System
  As a developer implementing JS/TS tools
  I want to support multiple transport mechanisms
  So that clients can connect to my MCP server

  Background:
    Given the MCP server is initialized
    And transport components are available

  Scenario: Connect server to stdio transport
    When I initialize a stdio transport
    And connect the server to this transport
    Then the server should accept messages from stdin
    And send responses to stdout
    And maintain a persistent connection

  Scenario: Connect server to HTTP/SSE transport
    When I initialize an HTTP/SSE transport with:
      | sse_endpoint     | post_endpoint  |
      | /sse             | /messages      |
    And connect the server to this transport
    Then the server should establish an SSE connection
    And accept messages via HTTP POST
    And send responses via SSE events

  Scenario: Message framing and protocol handling
    Given the server is connected to a transport
    When a raw message arrives on the transport
    Then the server should parse the JSON-RPC message
    And route it to the appropriate handler
    And send the response back through the transport

  Scenario: Multiple concurrent clients
    Given the server is connected to an HTTP/SSE transport
    When multiple clients connect concurrently
    Then the server should maintain separate sessions for each client
    And route messages to the correct session
    And handle disconnections gracefully

  Scenario: Transport error handling
    When a transport error occurs
    Then the server should log the error
    And attempt to recover if possible
    And clean up resources if the connection is lost
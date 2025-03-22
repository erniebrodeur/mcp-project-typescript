Feature: Project Structure Analysis Resource
  As an AI assistant
  I want to access TypeScript project semantic information via MCP
  So that I can understand projects without requiring manual description

  Background:
    Given an MCP server with Project resource capability
    And access to TypeScript project structures at configured paths

  Scenario Outline: Retrieve complete project metadata via MCP
    Given a <project_type> codebase at <path>
    When I request "project://<path>"
    Then I receive complete project metadata including:
      | project_type      | <project_type>      |
      | entry_points      | <entry_points>      |
      | framework         | <framework>         |
      | test_framework    | <test_framework>    |
      | key_config_files  | <key_config_files>  |
      | core_directories  | <core_directories>  |
      | node_version      | <node_version>      |
      | typescript        | <typescript>        |
      | module_system     | <module_system>     |
    
    Examples:
      | project_type | entry_points       | framework       | test_framework  | key_config_files         | core_directories          | node_version | typescript | module_system |
      | "Next.js"    | ["pages/index.ts"] | {"next":"13.4"} | {"jest":"29.5"} | {"tsconfig.json":true}   | {"pages":true,"src":true} | "18.16.0"    | true       | "ESM"         |
      | "Express"    | ["src/server.ts"]  | {"express":"4.18"} | {"mocha":"10.2"} | {"tsconfig.json":true} | {"src":true}              | "16.20.0"    | true       | "CommonJS"    |
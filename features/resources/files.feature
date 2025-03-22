Feature: File Organization Analysis Resource
  As an AI assistant
  I want to access project file organization patterns via MCP
  So that I can navigate and understand codebase structure efficiently

  Background:
    Given an MCP server with Files resource capability
    And access to JavaScript/TypeScript project files at configured paths

  Scenario Outline: Retrieve file organization patterns via MCP
    Given a <project_type> codebase at <path>
    When I request "files://<path>"
    Then I receive file organization data including:
      | organization_pattern | <organization_pattern> |
      | component_locations  | <component_locations>  |
      | api_locations        | <api_locations>        |
      | test_organization    | <test_organization>    |
      | asset_directories    | <asset_directories>    |
      | naming_conventions   | <naming_conventions>   |
    
    Examples:
      | project_type | organization_pattern | component_locations | api_locations | test_organization | asset_directories | naming_conventions |
      | "React"      | "feature-based"      | ["src/components"] | ["src/api"]   | {"pattern":"*.test.tsx"} | {"images":"public/img"} | {"components":"PascalCase.tsx"} |
      | "Node.js"    | "domain-driven"      | []                 | ["src/routes"]| {"pattern":"*.spec.ts"} | {"public":"public"} | {"controllers":"kebab-case.controller.ts"} |
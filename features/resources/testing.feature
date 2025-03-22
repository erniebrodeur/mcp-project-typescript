Feature: Testing Infrastructure Analysis Resource
  As an AI assistant
  I want to access testing infrastructure data from JavaScript/TypeScript projects via MCP
  So that I can understand test setup and coverage without manual inspection

  Background:
    Given an MCP server with Testing resource capability
    And access to JavaScript/TypeScript project test configurations at configured paths

  Scenario Outline: Retrieve testing framework metadata via MCP
    Given a <framework_name> test setup at <path>
    When I request "testing://<path>"
    Then I receive complete testing metadata including:
      | framework       | <framework>       |
      | locations       | <locations>       |
      | types           | <types>           |
      | coverage        | <coverage>        |
    
    Examples:
      | framework_name | path          | framework                          | locations                                    | types                                           | coverage                                                       |
      | "Jest"         | "project/jest"| {"name":"jest","version":"29.5.0"} | {"directories":["__tests__"],"pattern":"*.test.ts"} | {"unit":true,"component":true,"bdd":false,"e2e":false,"e2e_tool":null} | {"configured":true,"overall":85,"statements":87,"branches":80,"functions":88,"lines":86} |
      | "Mocha"        | "api/tests"   | {"name":"mocha","version":"10.2.0"}| {"directories":["test"],"pattern":"*.spec.js"}      | {"unit":true,"component":false,"bdd":true,"e2e":true,"e2e_tool":"cypress"} | {"configured":true,"overall":72,"statements":75,"branches":68,"functions":70,"lines":75} |

  Scenario: Handle missing test configuration
    Given no testing framework is configured at "incorrect/path"
    When I request "testing://incorrect/path"
    Then I receive an error response with:
      | status  | 404        |
      | message | "No testing framework configuration found" |

  Scenario Outline: Extract coverage report when available
    Given a project with <framework_name> and coverage reports at <path>
    When I request "testing://<path>?include=coverage"
    Then I receive standard testing metadata
    And I receive detailed coverage data:
      | overall        | <overall>        |
      | per_file       | <per_file>       |
      | uncovered_lines| <uncovered_lines>|
    
    Examples:
      | framework_name | path           | overall | per_file                                  | uncovered_lines                     |
      | "Jest"         | "app/coverage" | 87.5    | {"src/index.ts":95.0,"src/utils.ts":80.2} | {"src/utils.ts":[45,67,89]}         |
      | "Vitest"       | "lib/reports"  | 92.3    | {"lib/core.ts":98.1,"lib/helpers.ts":86.5}| {"lib/helpers.ts":[12,13,14,15]}    |
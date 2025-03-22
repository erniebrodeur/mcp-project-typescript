Feature: Package.json Metadata Resource
  As an AI assistant
  I want to access raw package.json metadata via MCP
  So that I can understand project dependencies and configuration directly

  Background:
    Given an MCP server with Package resource capability
    And access to JavaScript/TypeScript package.json files at configured paths

  Scenario Outline: Retrieve package.json metadata via MCP
    Given a package.json file exists at <path>
    When I request "package://<path>"
    Then I receive complete package metadata including:
      | name               | <name>               |
      | version            | <version>            |
      | main               | <main>               |
      | type               | <type>               |
      | dependencies       | <dependencies>       |
      | devDependencies    | <devDependencies>    |
      | scripts            | <scripts>            |
    
    Examples:
      | path                  | name          | version   | main          | type       | dependencies                          | devDependencies                      | scripts                             |
      | "project/package.json"| "mcp-demo"    | "1.0.0"   | "dist/index.js"| "module"   | [{"name":"zod","version":"^3.22.4"}] | [{"name":"typescript","version":"^5.0.0"}] | {"build":"tsc","test":"jest"}      |
      | "monorepo/package.json"| "mcp-monorepo"| "2.1.0"  | "index.js"    | "commonjs" | [{"name":"express","version":"^4.18.2"}] | [{"name":"jest","version":"^29.5.0"}] | {"start":"node index.js"}         |

  Scenario: Handle missing package.json file
    Given no package.json exists at "invalid/path"
    When I request "package://invalid/path"
    Then I receive an error response with:
      | status  | 404        |
      | message | "Package.json not found at specified path" |

  Scenario Outline: Extract optional package.json fields when present
    Given a package.json with optional fields at <path>
    When I request "package://<path>"
    Then I receive standard package metadata
    And I receive optional fields:
      | description       | <description>       |
      | author            | <author>            |
      | license           | <license>           |
      | private           | <private>           |
      | workspaces        | <workspaces>        |
      | peerDependencies  | <peerDependencies>  |
    
    Examples:
      | path                  | description                | author             | license  | private | workspaces    | peerDependencies                |
      | "project/package.json"| "MCP demo package"         | "MCP Team"         | "MIT"    | false   | null          | null                           |
      | "monorepo/package.json"| "MCP monorepo root"       | {"name":"MCP Team","email":"team@mcp.io"} | "MIT" | true | ["packages/*"] | [{"name":"react","version":"^18.0.0"}] |
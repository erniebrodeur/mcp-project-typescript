Feature: Documentation Analysis Resource
  As an AI assistant
  I want to access documentation resources from JavaScript/TypeScript projects via MCP
  So that I can understand available project documentation and code comment quality

  Background:
    Given an MCP server with Documentation resource capability
    And access to JavaScript/TypeScript project documentation at configured paths

  Scenario Outline: Retrieve documentation metadata via MCP
    Given a <project_type> codebase with documentation at <path>
    When I request "documentation://<path>"
    Then I receive complete documentation metadata including:
      | readme            | <readme>            |
      | code_comments     | <code_comments>     |
      | tools             | <tools>             |
      | files             | <files>             |
      | api_documentation | <api_documentation> |
    
    Examples:
      | project_type | path       | readme                                           | code_comments                           | tools                                      | files                                                            | api_documentation                                 |
      | "Library"    | "lib/docs" | {"exists":true,"format":"markdown","quality":"comprehensive"} | {"jsdoc":true,"tsdoc":false,"coverage":"extensive"} | {"name":"typedoc","config_present":true,"api_docs_generated":true} | {"docs_directory":true,"contributing_guide":true,"changelog":true,"examples_directory":true} | {"swagger_openapi":false,"graphql_schema":false,"type_definitions":true} |
      | "API"        | "api/docs" | {"exists":true,"format":"markdown","quality":"standard"}      | {"jsdoc":false,"tsdoc":true,"coverage":"moderate"}   | {"name":"swagger","config_present":true,"api_docs_generated":true} | {"docs_directory":true,"contributing_guide":false,"changelog":true,"examples_directory":false} | {"swagger_openapi":true,"graphql_schema":false,"type_definitions":true} |

  Scenario: Handle missing documentation
    Given no documentation exists at "invalid/path"
    When I request "documentation://invalid/path"
    Then I receive an error response with:
      | status  | 404        |
      | message | "No documentation found at specified path" |

  Scenario Outline: Analyze code comment quality
    Given a project with <coverage_level> code comments at <path>
    When I request "documentation://<path>?analyze=comments"
    Then I receive standard documentation metadata
    And I receive comment quality analysis:
      | file_coverage     | <file_coverage>     |
      | comment_ratio     | <comment_ratio>     |
      | quality_score     | <quality_score>     |
      | improvement_areas | <improvement_areas> |
    
    Examples:
      | coverage_level | path          | file_coverage | comment_ratio | quality_score | improvement_areas                                  |
      | "High"         | "well-doc/src"| 95.2          | 0.32          | "excellent"   | []                                                |
      | "Low"          | "poor-doc/src"| 23.7          | 0.05          | "poor"        | ["add_class_comments","document_parameters"]      |
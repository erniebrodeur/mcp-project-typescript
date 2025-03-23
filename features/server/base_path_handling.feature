Feature: Base Path Handling
  As an MCP server developer
  I want standardized path handling
  So resource URIs are consistently processed

  Background:
    Given an MCP server with path handling capability
    And the following project roots:
      | ~/Projects/mcp-project-typescript |

  Scenario Outline: Path normalization
    When a path "<input_path>" is normalized
    Then the result should be "<normalized_path>"
    
    Examples:
      | input_path                                 | normalized_path                           |
      | ./relative                                 | {project_root}/relative                   |
      | ../outside                                 | {project_root}                            |
      | /absolute/path/                            | /absolute/path                            |
      | ~/Projects/mcp-project-typescript/extra/   | ~/Projects/mcp-project-typescript/extra   |
      | ~/Projects/mcp-project-typescript/../other | ~/Projects/mcp-project-typescript         |

  Scenario Outline: URI template path extraction
    When a URI "<uri>" is processed with template "<template>"
    Then path parameter extraction should produce "<param>"
    
    Examples:
      | uri                                 | template             | param                             |
      | project://./path                    | project://{path}     | ./path                            |
      | package://~/user/project            | package://{path}     | ~/user/project                    |
      | files://path/with/subdir            | files://{path}       | path/with/subdir                  |
      | testing://~/path/to/tests/unit      | testing://{path}/{type} | ~/path/to/tests                |

  @path_examples
  Examples:
    | description      | input_path                 | normalized_result                     | security_status |
    | Relative path    | ./src                      | {project_root}/src                    | valid           |
    | Parent traversal | ../../../etc               | {project_root}                        | suspicious      |
    | Trailing slash   | /path/to/dir/              | /path/to/dir                          | valid           |
    | Symbolic links   | /path/with/symlink         | {resolved_real_path}                  | needs_validation|
    | Windows path     | C:\\Program Files\\App     | C:/Program Files/App                  | valid           |
    | Dot files        | ./project/.git             | {project_root}/.git                   | valid           |
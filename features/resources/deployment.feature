Feature: Deployment Configuration Analysis Resource
  As an AI assistant
  I want to access deployment configurations from JavaScript/TypeScript projects via MCP
  So that I can understand how projects are deployed and what CI/CD systems they use

  Background:
    Given an MCP server with Deployment resource capability
    And access to JavaScript/TypeScript project deployment files at configured paths

  Scenario Outline: Retrieve deployment configurations via MCP
    Given a <project_type> codebase with deployment setup at <path>
    When I request "deployment://<path>"
    Then I receive complete deployment metadata including:
      | ci_cd             | <ci_cd>             |
      | containerization  | <containerization>  |
      | cloud_services    | <cloud_services>    |
      | deployment_type   | <deployment_type>   |
    
    Examples:
      | project_type | path           | ci_cd                                                             | containerization                                | cloud_services                                        | deployment_type         |
      | "Web App"    | "webapp/deploy"| {"detected":{"github_actions":{"config_files":[".github/workflows/deploy.yml"]}},"config_files":["deploy.yml"]} | {"technologies":{"docker":{"dockerfile":true,"compose":true}}} | {"providers":{"aws":{"services":["s3","cloudfront"]}},"deployment_platforms":{"vercel":{}}} | "continuous_deployment" |
      | "API"        | "api/infra"    | {"detected":{"gitlab_ci":{"config_files":[".gitlab-ci.yml"]}},"config_files":[".gitlab-ci.yml"]}                | {"technologies":{"kubernetes":{"manifests":true}}}    | {"providers":{"gcp":{"services":["cloud_run"]}},"deployment_platforms":{"heroku":{}}}       | "container_orchestration" |

  Scenario: Handle missing deployment configuration
    Given no deployment configuration exists at "missing/deploy"
    When I request "deployment://missing/deploy"
    Then I receive an error response with:
      | status  | 404        |
      | message | "No deployment configuration found" |

  Scenario Outline: Analyze deployment security settings
    Given a project with <platform> deployment at <path>
    When I request "deployment://<path>?analyze=security"
    Then I receive standard deployment metadata
    And I receive deployment security analysis:
      | secrets_management | <secrets_management> |
      | access_controls    | <access_controls>    |
      | vulnerability_scan | <vulnerability_scan> |
      | risk_level         | <risk_level>         |
    
    Examples:
      | platform    | path              | secrets_management                        | access_controls                           | vulnerability_scan                       | risk_level  |
      | "AWS"       | "secure-app/infra"| {"type":"parameter_store","encrypted":true} | {"least_privilege":true,"iam_roles":true}  | {"enabled":true,"tools":["clair","trivy"]} | "low"       |
      | "Kubernetes"| "k8s-app/deploy"  | {"type":"secrets","encrypted":false}      | {"least_privilege":false,"rbac":true}      | {"enabled":false,"tools":[]}              | "medium"    |
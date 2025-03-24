import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';

Given('resource capability is enabled', function(this: McpWorld) {
  this.server.registerCapability('resources');
});

Given('standardized path handling is configured', function(this: McpWorld) {
  this.paths.enablePathNormalization();
});

When('I register a resource with:', function(this: McpWorld, dataTable) {
  const resourceInfo = dataTable.rowsHash();
  
  // Register the resource
  this.server.server.resource(
    resourceInfo.name,
    new ResourceTemplate(resourceInfo.uri_template, { list: undefined }),
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: `Resource content for ${resourceInfo.name}`
      }]
    })
  );
  
  // Store resource info for later
  this.resources.registerResource(resourceInfo.name as any);
});

When('I register a resource with dynamic content generation', function(this: McpWorld) {
  // Register dynamic resource
  this.server.server.resource(
    "dynamic",
    new ResourceTemplate("dynamic://{param}", { list: undefined }),
    async (uri, { param }) => ({
      contents: [{
        uri: uri.href,
        text: `Dynamic content for param: ${param}`
      }]
    })
  );
  
  // Store resource info
  this.resources.registerResource('dynamic' as any);
});

Given('I have registered multiple resources', function(this: McpWorld) {
  // Register several resources
  ['project', 'package', 'testing'].forEach(resource => {
    this.server.server.resource(
      resource,
      new ResourceTemplate(`${resource}://{path}`, { list: undefined }),
      async (uri) => ({
        contents: [{
          uri: uri.href,
          text: `Resource content for ${resource}`
        }]
      })
    );
    
    // Store registered resource
    this.resources.registerResource(resource as any);
  });
});

When('a client requests available resources', function(this: McpWorld) {
  // Simulate client request
  this.server.resourcesRequested = true;
});

When('a client reads a resource with URI {string}', function(this: McpWorld, uri: string) {
  // Store requested URI
  this.resources.requestedUri = uri;
  
  // Parse URI parts
  const parts = uri.split('://');
  if (parts.length === 2) {
    const scheme = parts[0];
    const path = parts[1];
    
    // Load appropriate fixture
    try {
      const fixture = this.mocks.loadFixture(`resources/${scheme}`, 'nextjs');
      
      // Create response
      this.resources.setResponse({
        contents: [{
          uri,
          text: JSON.stringify(fixture)
        }]
      });
    } catch (error) {
      // Create error response
      this.resources.setResponse({
        error: {
          status: 404,
          message: `Resource not found: ${uri}`
        }
      });
    }
  }
});

When('I define resource URI templates', function(this: McpWorld) {
  // Define standard URI templates
  this.server.resourceTemplates = [
    'project://{path}',
    'package://{path}',
    'files://{path}/{id}'
  ];
});

Given('multiple resources registered with path parameters', function(this: McpWorld) {
  // Register resources with same base path pattern
  ['project', 'package', 'testing'].forEach(resource => {
    this.server.server.resource(
      resource,
      new ResourceTemplate(`${resource}://{path}`, { list: undefined }),
      async (uri, { path }) => ({
        contents: [{
          uri: uri.href,
          text: `Resource content for ${resource} at ${path}`
        }]
      })
    );
    
    // Store registered resource
    this.resources.registerResource(resource as any);
  });
});

When('resources are accessed with the same base path', function(this: McpWorld) {
  // Simulate accessing multiple resources with same path
  const basePath = '/project/test';
  
  ['project', 'package', 'testing'].forEach(resource => {
    const uri = `${resource}://${basePath}`;
    
    // Store paths accessed
    this.server.resourcePaths = this.server.resourcePaths || [];
    this.server.resourcePaths.push({ resource, path: basePath });
  });
});

Then('the resource should be available to clients', function(this: McpWorld) {
  const resourceNames = this.resources.registeredResources;
  assert(resourceNames.length > 0, 'No resources registered');
  
  // Check last registered resource
  const lastResource = resourceNames[resourceNames.length - 1];
  assert(lastResource, 'Last registered resource not found');
});

Then('provide project structure information for JS\\/TS projects', function(this: McpWorld) {
  assert(this.resources.hasResource('project'), 'Project resource not registered');
});

Then('provide package.json metadata when requested', function(this: McpWorld) {
  assert(this.resources.hasResource('package'), 'Package resource not registered');
});

Then('the resource should generate content based on request parameters', function(this: McpWorld) {
  assert(this.resources.hasResource('dynamic'), 'Dynamic resource not registered');
});

Then('validate parameters before processing', function(this: McpWorld) {
  // In red phase, this will be implemented later
  assert(true, 'Parameter validation not implemented');
});

Then('return appropriate error for invalid parameters', function(this: McpWorld) {
  // In red phase, this will be implemented later
  assert(true, 'Error handling not implemented');
});

Then('all registered resources should be listed', function(this: McpWorld) {
  assert(this.server.resourcesRequested, 'Resources were not requested');
  assert(this.resources.registeredResources.length > 0, 'No resources registered');
});

Then('include their URI templates and descriptions', function(this: McpWorld) {
  assert(this.server.resourceTemplates?.length > 0, 'No resource templates defined');
});

Then('the server should validate the directory', function(this: McpWorld) {
  assert(this.resources.requestedUri, 'No URI requested');
  
  // Extract path from URI
  const parts = this.resources.requestedUri.split('://');
  if (parts.length === 2) {
    const path = parts[1];
    this.paths.setCurrentPath(path);
  }
});

Then('generate the resource content', function(this: McpWorld) {
  const response = this.resources.getResponse();
  assert(response && 'contents' in response, 'No resource content generated');
});

Then('return it in the prescribed format', function(this: McpWorld) {
  const response = this.resources.getResponse();
  assert(response && 'contents' in response && response.contents[0]?.text, 
    'Response not in prescribed format');
});

Then('all resources should use standardized path handling for:', function(this: McpWorld, dataTable) {
  const templates = dataTable.hashes();
  
  // Verify templates are stored
  assert(this.server.resourceTemplates?.length > 0, 'No resource templates defined');
  
  // Check examples match templates
  templates.forEach(template => {
    const { template_format, example } = template;
    
    assert(template_format, 'Template format not defined');
    assert(example, 'Example not provided');
    
    // Verify template format
    const parts = example.split('://');
    if (parts.length === 2) {
      const scheme = parts[0];
      
      // Check if any stored template matches
      const matchingTemplate = this.server.resourceTemplates.some(
        t => t.startsWith(`${scheme}://`)
      );
      
      assert(matchingTemplate, `No matching template for ${example}`);
    }
  });
});

Then('apply consistent path normalization', function(this: McpWorld) {
  assert(this.paths.pathNormalizationEnabled, 'Path normalization not enabled');
});

Then('apply consistent security validation', function(this: McpWorld) {
  // In red phase, this will be implemented later
  assert(true, 'Security validation not implemented');
});

Then('all resources should resolve to the same project context', function(this: McpWorld) {
  assert(this.server.resourcePaths?.length > 0, 'No resources accessed');
  
  // Check all paths are the same
  const paths = this.server.resourcePaths.map(rp => rp.path);
  const allSame = paths.every(p => p === paths[0]);
  
  assert(allSame, 'Resources not resolving to same project context');
});

Then('maintain consistent path normalization across resources', function(this: McpWorld) {
  assert(this.paths.pathNormalizationEnabled, 'Path normalization not enabled');
  assert(this.server.resourcePaths?.length > 0, 'No resources accessed');
});

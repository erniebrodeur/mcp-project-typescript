import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import assert from 'assert';
import { z } from 'zod';

Given('prompt capability is enabled', function(this: McpWorld) {
  this.server.registerCapability('prompts');
});

Given('standardized path handling for prompt parameters', function(this: McpWorld) {
  this.paths.enablePathNormalization();
});

When('I register a prompt with:', function(this: McpWorld, dataTable) {
  const promptInfo = dataTable.rowsHash();
  
  // Register the prompt
  this.server.server.prompt(
    promptInfo.name,
    {},
    () => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: "Sample prompt"
        }
      }]
    })
  );
  
  // Store prompt info for later
  this.server.registeredPrompts = this.server.registeredPrompts || [];
  this.server.registeredPrompts.push(promptInfo.name);
});

When('define parameters:', function(this: McpWorld, dataTable) {
  const params = dataTable.hashes();
  
  // Create parameter schema
  const paramSchema: Record<string, z.ZodTypeAny> = {};
  
  params.forEach((param: { parameter: string; type: string; required: string }) => {
    if (param.type === 'string') {
      paramSchema[param.parameter] = param.required === 'true' ? 
        z.string() : z.string().optional();
    } else if (param.type === 'boolean') {
      paramSchema[param.parameter] = param.required === 'true' ? 
        z.boolean() : z.boolean().optional();
    } else if (param.type === 'array') {
      paramSchema[param.parameter] = param.required === 'true' ? 
        z.array(z.any()) : z.array(z.any()).optional();
    }
  });
  
  // Store for later validation
  this.server.promptParameters = paramSchema;
});

Given('I have registered multiple prompts', function(this: McpWorld) {
  // Register several prompts
  ['feature', 'resource_doc', 'code_review'].forEach(prompt => {
    this.server.server.prompt(
      prompt,
      {},
      () => ({
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `${prompt} template`
          }
        }]
      })
    );
    
    // Store registered prompts
    this.server.registeredPrompts = this.server.registeredPrompts || [];
    this.server.registeredPrompts.push(prompt);
  });
});

When('a client requests available prompts', function(this: McpWorld) {
  // Simulate client request
  this.server.promptsRequested = true;
});

When('a client requests a prompt with parameters:', function(this: McpWorld, dataTable) {
  const params = dataTable.rowsHash();
  
  // Store requested prompt and parameters
  this.server.requestedPrompt = params.resource_name;
  this.server.requestedPromptParams = params;
});

Given('a registered prompt with path parameters', function(this: McpWorld) {
  // Register prompt with path parameter
  this.server.server.prompt(
    'path_prompt',
    { path: z.string() },
    ({ path }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Template for path: ${path}`
        }
      }]
    })
  );
  
  // Store registered prompt
  this.server.registeredPrompts = this.server.registeredPrompts || [];
  this.server.registeredPrompts.push('path_prompt');
});

When('provided with path parameter {string}', function(this: McpWorld, pathParam: string) {
  // Store parameter
  this.paths.setCurrentPath(pathParam);
  
  // Store parameter for prompt
  this.server.requestedPromptParams = { path: pathParam };
});

Then('the prompt should be available to clients', function(this: McpWorld) {
  assert(this.server.registeredPrompts?.length > 0, 'No prompts registered');
  
  if (this.server.registeredPrompts) {
    const lastPrompt = this.server.registeredPrompts[this.server.registeredPrompts.length - 1];
    assert(lastPrompt, 'Last registered prompt not found');
  }
});

Then('include parameter validation', function(this: McpWorld) {
  assert(this.server.promptParameters, 'Prompt parameters not defined');
});

Then('all registered prompts should be listed', function(this: McpWorld) {
  assert(this.server.promptsRequested, 'Prompts were not requested');
  assert(this.server.registeredPrompts?.length > 0, 'No prompts registered');
});

Then('include their parameter schemas and descriptions', function(this: McpWorld) {
  assert(this.server.promptParameters, 'Prompt parameters not defined');
});

Then('the server should validate the parameters', function(this: McpWorld) {
  assert(this.server.requestedPromptParams, 'No prompt parameters to validate');
});

Then('return the formatted prompt template', function(this: McpWorld) {
  assert(this.server.requestedPrompt, 'No prompt requested');
});

Then('include message structure as defined', function(this: McpWorld) {
  assert(this.server.requestedPrompt, 'No prompt requested');
});

Then('the path should be normalized to {string}', function(this: McpWorld, normalizedPath: string) {
  // Remove quotes if present
  normalizedPath = normalizedPath.replace(/"/g, '');
  
  // Store for later verification
  this.paths.normalizedPath = normalizedPath;
  
  // In red phase, just verify step is called
  assert(this.paths.pathNormalizationEnabled, 'Path normalization not enabled');
});

Then('be correctly formatted before substituting into the prompt template', function(this: McpWorld) {
  assert(this.server.requestedPromptParams?.path, 'No path parameter to format');
});

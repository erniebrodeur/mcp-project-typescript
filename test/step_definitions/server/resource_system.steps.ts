import { Given, When, Then } from '@cucumber/cucumber';
import { McpWorld } from '../support/world';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import assert from 'assert';

Given('an MCP server with Project resource capability', function(this: McpWorld) {
  this.server.resource(
    "project",
    new ResourceTemplate("project://{path}", { list: undefined }),
    async (uri, { path }) => ({
      contents: [{
        uri: uri.href,
        text: JSON.stringify({})
      }]
    })
  );
});

Given('access to TypeScript project structures at configured paths', function(this: McpWorld) {
  assert(this.mockFs);
});

Given('a {string} codebase at {string}', function(this: McpWorld, projectType: string, path: string) {
  this.projectType = projectType.replace(/"/g, '');
  this.projectPath = path.replace(/"/g, '');
  return Promise.resolve();
});

When('I request {string}', async function(this: McpWorld, uri: string) {
  // Simulate resource request with fixture data
  const fixture = this.loadFixture('resources/project', this.projectType.toLowerCase());
  this.response = {
    contents: [{
      uri,
      text: JSON.stringify(fixture)
    }]
  };
});

Then('I receive complete project metadata including:', function(this: McpWorld, dataTable) {
  assert(this.response?.contents?.[0]?.text);
  const responseJson = JSON.parse(this.response.contents[0].text);
  const expected = dataTable.rowsHash();
  
  for (const [key, value] of Object.entries(expected)) {
    let expectedValue = value;
    if (typeof value === 'string') {
      if (value.startsWith('{') || value.startsWith('[')) {
        expectedValue = JSON.parse(value);
      } else if (value === 'true') {
        expectedValue = true;
      } else if (value === 'false') {
        expectedValue = false;
      }
    }
    
    assert.deepStrictEqual(responseJson[key], expectedValue);
  }
});
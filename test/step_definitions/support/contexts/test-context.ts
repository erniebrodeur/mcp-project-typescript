/**
 * Test Context
 * Manages test fixtures, mocks, and test-specific state
 */
import { MockCommandExecutor } from '../../../helpers/mock-command-executor';
import { MockFileSystem } from '../../../helpers/mock-filesystem';
import { loadFixture } from '../utils/fixture-loader';
import { z } from 'zod';

export class TestContext {
  // Mock implementations
  mockExecutor: MockCommandExecutor;
  mockFs: MockFileSystem;
  
  // Current test state
  currentTestFeature: string = '';
  
  constructor() {
    this.mockExecutor = new MockCommandExecutor();
    this.mockFs = new MockFileSystem();
  }
  
  /**
   * Load a fixture with optional schema validation
   */
  loadFixture<T>(category: string, type: string, schema?: z.ZodType<T>): T {
    return loadFixture<T>(category, type, schema);
  }
  
  /**
   * Setup mock filesystem for a project type
   */
  async setupProject(projectPath: string, projectType: string): Promise<void> {
    await this.mockFs.setupProject(projectPath, projectType);
    
    // Setup command fixtures
    try {
      const npmListFixture = this.loadFixture('commands/npm/list', projectType.toLowerCase());
      if (npmListFixture) {
        this.mockExecutor.mockCommand('npm list --json', npmListFixture);
      }
    } catch (error) {
      console.log(`Fixture not found for ${projectType.toLowerCase()}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Reset the test context
   */
  reset(): void {
    this.mockExecutor.reset();
    this.mockFs.reset();
  }
}

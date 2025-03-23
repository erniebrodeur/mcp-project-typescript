export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class MockCommandExecutor {
  private expectedResults = new Map<string, CommandResult>();
  
  mockCommand(command: string, result: CommandResult) {
    this.expectedResults.set(command, result);
  }
  
  async execute(command: string, options?: any): Promise<CommandResult> {
    const result = this.expectedResults.get(command);
    if (!result) {
      throw new Error(`Unexpected command: ${command}`);
    }
    return result;
  }
  
  reset() {
    this.expectedResults.clear();
  }
  
  mockCommandFromFixture(command: string, category: string, name: string) {
    try {
      const fixture = require(`../../../fixtures/commands/${category}/${name}.json`);
      this.mockCommand(command, fixture);
    } catch (error) {
      throw new Error(`Failed to load command fixture: fixtures/commands/${category}/${name}.json`);
    }
  }
}
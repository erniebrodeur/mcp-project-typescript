export interface CommandOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class MockCommandExecutor {
  private mockResults: Map<string, CommandResult> = new Map();
  private executedCommands: string[] = [];
  
  mockCommand(command: string, result: CommandResult): void {
    this.mockResults.set(command, result);
  }
  
  wasExecuted(commandSubstring: string): boolean {
    return this.executedCommands.some(cmd => cmd.includes(commandSubstring));
  }
  
  getExecutedCommands(): string[] {
    return [...this.executedCommands];
  }
  
  reset(): void {
    this.mockResults.clear();
    this.executedCommands = [];
  }
  
  async execute(command: string, options: CommandOptions = {}): Promise<CommandResult> {
    this.executedCommands.push(command);
    
    // Check for direct match
    if (this.mockResults.has(command)) {
      return this.mockResults.get(command)!;
    }
    
    // Check for partial matches
    for (const [mockCmd, result] of this.mockResults.entries()) {
      if (command.includes(mockCmd)) {
        return result;
      }
    }
    
    // Default error
    return {
      stdout: '',
      stderr: `No mock result for command: ${command}`,
      exitCode: 1
    };
  }
}
import { exec } from 'child_process';
import { Tool } from './Tool';

export const runTerminalTool: Tool = {
  name: 'runTerminal',
  description: 'Executes a command in the terminal and returns its output. Use it for file system operations, running scripts, etc.',
  execute: async (args: any[], workspaceRoot?: string): Promise<string> => {
    const command = args[0];
    if (!command || typeof command !== 'string') {
        return 'Error: A command string must be provided in a JSON array, e.g., ["ls -l"].';
    }

    return new Promise((resolve, reject) => {
      const options = { cwd: workspaceRoot };
      exec(command, options, (error, stdout, stderr) => {
        // Always resolve with the full output, so the agent can see errors and warnings.
        const output = `STDOUT:\n${stdout}\nSTDERR:\n${stderr}`;
        if (error) {
          console.error(`Command failed with error: ${error.message}`);
        }
        resolve(output);
      });
    });
  },
};

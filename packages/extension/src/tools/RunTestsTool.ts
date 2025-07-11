import { Tool } from './Tool';
import { runTerminalTool } from './runTerminal';

export class RunTestsTool implements Tool {
    name = 'runTests';
    description = `Runs the project's test command. Can be used with an optional argument specifying the command, e.g., ["npm test"] or ["pytest"]. If no argument is provided, it will attempt to run a default test command (e.g., 'npm test').`;

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        let command = args[0];

        if (!command) {
            // Default test command if none is provided
            command = 'npm test'; // This is a common default, but could be improved by checking package.json or other config files
        }

        if (typeof command !== 'string') {
            return 'Error: The test command must be a string in a JSON array, e.g., ["npm test"].';
        }

        return runTerminalTool.execute([command], workspaceRoot);
    }
}

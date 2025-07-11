"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTerminalTool = void 0;
const child_process_1 = require("child_process");
exports.runTerminalTool = {
    name: 'runTerminal',
    description: 'Executes a command in the terminal and returns its output. Use it for file system operations, running scripts, etc.',
    execute: async (args, workspaceRoot) => {
        const command = args[0];
        if (!command || typeof command !== 'string') {
            return 'Error: A command string must be provided in a JSON array, e.g., ["ls -l"].';
        }
        return new Promise((resolve, reject) => {
            const options = { cwd: workspaceRoot };
            (0, child_process_1.exec)(command, options, (error, stdout, stderr) => {
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

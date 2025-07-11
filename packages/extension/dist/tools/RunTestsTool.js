"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunTestsTool = void 0;
const runTerminal_1 = require("./runTerminal");
class RunTestsTool {
    constructor() {
        this.name = 'runTests';
        this.description = `Runs the project's test command. Can be used with an optional argument specifying the command, e.g., ["npm test"] or ["pytest"]. If no argument is provided, it will attempt to run a default test command (e.g., 'npm test').`;
    }
    async execute(args, workspaceRoot) {
        let command = args[0];
        if (!command) {
            // Default test command if none is provided
            command = 'npm test'; // This is a common default, but could be improved by checking package.json or other config files
        }
        if (typeof command !== 'string') {
            return 'Error: The test command must be a string in a JSON array, e.g., ["npm test"].';
        }
        return runTerminal_1.runTerminalTool.execute([command], workspaceRoot);
    }
}
exports.RunTestsTool = RunTestsTool;

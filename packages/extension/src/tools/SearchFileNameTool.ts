import * as vscode from 'vscode';
import { Tool } from './Tool';

export class SearchFileNameTool implements Tool {
    name = 'searchFileName';
    description = 'Searches for files by name or partial name using a glob pattern. Arguments: { pattern: string }. Returns a list of matching file paths.';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        const input = args[0];
        if (typeof input !== 'object' || input === null || !('pattern' in input)) {
            return 'Error: Invalid arguments. Expected an object with a "pattern" property.';
        }

        const { pattern } = input;

        if (!pattern || typeof pattern !== 'string') {
            return 'Error: A search pattern must be provided as a string.';
        }

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return 'Error: No workspace is open.';
            }

            // Use the provided pattern directly as a glob pattern
            const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');

            if (files.length === 0) {
                return 'No files found matching the pattern.';
            } else {
                const filePaths = files.map(file => vscode.workspace.asRelativePath(file));
                return filePaths.join('\n');
            }
        } catch (error: any) {
            return `Error searching files by name: ${error.message}`;
        }
    }
}

import * as vscode from 'vscode';
import { Tool } from './Tool';

export class SearchFileContentTool implements Tool {
    name = 'searchFileContent';
    description = 'Searches for a given string or regex pattern within files in the workspace. Arguments: { pattern: string, includeGlob?: string }. Returns matching lines with file paths and line numbers.';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        const input = args[0];
        if (typeof input !== 'object' || input === null || !('pattern' in input)) {
            return 'Error: Invalid arguments. Expected an object with a "pattern" property and optional "includeGlob" property.';
        }

        const { pattern, includeGlob } = input;

        if (!pattern || typeof pattern !== 'string') {
            return 'Error: A search pattern must be provided as a string.';
        }

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return 'Error: No workspace is open.';
            }

            const rootUri = workspaceFolders[0].uri;
            const files = await vscode.workspace.findFiles(includeGlob || '**/*', '**/node_modules/**');

            let results: string[] = [];
            const regex = new RegExp(pattern, 'g');

            for (const file of files) {
                try {
                    const content = await vscode.workspace.fs.readFile(file);
                    const lines = content.toString().split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        if (regex.test(lines[i])) {
                            results.push(`${vscode.workspace.asRelativePath(file)}:${i + 1}: ${lines[i].trim()}`);
                        }
                    }
                } catch (readError: any) {
                    // Ignore errors for unreadable files (e.g., binary files)
                    // console.warn(`Could not read file ${file.fsPath}: ${readError.message}`);
                }
            }

            if (results.length === 0) {
                return 'No matches found.';
            } else {
                return results.join('\n');
            }
        } catch (error: any) {
            return `Error searching files: ${error.message}`;
        }
    }
}

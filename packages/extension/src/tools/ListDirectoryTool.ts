import * as vscode from 'vscode';
import { Tool } from './Tool';

export class ListDirectoryTool implements Tool {
    name = 'listDirectory';
    description = 'Lists the files and directories in a given path relative to the workspace root. The argument should be a relative path to the directory.';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        const dirPath = args[0];
        if (!dirPath || typeof dirPath !== 'string') {
            return 'Error: A directory path must be provided as a string in a JSON array, e.g., ["path/to/dir"].';
        }

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return 'Error: No workspace is open.';
            }
            const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, dirPath);
            const entries = await vscode.workspace.fs.readDirectory(uri);
            return entries.map(([name, type]) => `${name}${type === vscode.FileType.Directory ? '/' : ''}`).join('\n');
        } catch (error: any) {
            return `Error listing directory: ${error.message}`;
        }
    }
}

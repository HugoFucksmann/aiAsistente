import * as vscode from 'vscode';
import { Tool } from './Tool';

export class CreateDirectoryTool implements Tool {
    name = 'createDirectory';
    description = 'Creates a new directory at the specified relative path within the workspace. Argument: [path: string].';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        const dirPath = args[0];
        if (!dirPath || typeof dirPath !== 'string') {
            return 'Error: A directory path must be provided as a string in a JSON array, e.g., ["path/to/new/dir"].';
        }

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return 'Error: No workspace is open.';
            }
            const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, dirPath);
            await vscode.workspace.fs.createDirectory(uri);
            return `Successfully created directory: ${dirPath}`;
        } catch (error: any) {
            return `Error creating directory: ${error.message}`;
        }
    }
}

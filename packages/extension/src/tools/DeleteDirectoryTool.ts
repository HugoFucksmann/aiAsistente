import * as vscode from 'vscode';
import { Tool } from './Tool';

export class DeleteDirectoryTool implements Tool {
    name = 'deleteDirectory';
    description = 'Deletes a directory at the specified relative path within the workspace. Argument: [path: string]. Use with extreme caution.';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        const dirPath = args[0];
        if (!dirPath || typeof dirPath !== 'string') {
            return 'Error: A directory path must be provided as a string in a JSON array, e.g., ["path/to/dir"].';
        }

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return 'Error: No workspace is open.';
            }
            const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, dirPath);
            // The `recursive: true` option is crucial for deleting non-empty directories
            await vscode.workspace.fs.delete(uri, { recursive: true });
            return `Successfully deleted directory: ${dirPath}`;
        } catch (error: any) {
            return `Error deleting directory: ${error.message}`;
        }
    }
}

import * as vscode from 'vscode';
import { Tool } from './Tool';

export class DeleteFileTool implements Tool {
    name = 'deleteFile';
    description = 'Deletes a file at the specified relative path within the workspace. Argument: [path: string]. Use with extreme caution.';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        const filePath = args[0];
        if (!filePath || typeof filePath !== 'string') {
            return 'Error: A file path must be provided as a string in a JSON array, e.g., ["path/to/file.txt"].';
        }

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return 'Error: No workspace is open.';
            }
            const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, filePath);
            await vscode.workspace.fs.delete(uri);
            return `Successfully deleted file: ${filePath}`;
        } catch (error: any) {
            return `Error deleting file: ${error.message}`;
        }
    }
}

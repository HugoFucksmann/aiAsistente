import * as vscode from 'vscode';
import { Tool } from './Tool';

export class ReadFileTool implements Tool {
    name = 'readFile';
    description = 'Reads the content of a file in the current workspace. The argument should be a relative path to the file.';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        const filePath = args[0];
        if (!filePath || typeof filePath !== 'string') {
            return 'Error: A file path must be provided as a string in a JSON array, e.g., ["path/to/file.txt"].';
        }

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return 'Error: No workspace is open.';
            }
            const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, filePath);
            const content = await vscode.workspace.fs.readFile(uri);
            return content.toString();
        } catch (error: any) {
            return `Error reading file: ${error.message}`;
        }
    }
}

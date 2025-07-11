import * as vscode from 'vscode';
import { Tool } from './Tool';

export class WriteFileTool implements Tool {
    name = 'writeFile';
    description = 'Writes content to a file in the current workspace. The first argument should be the relative path to the file, and the second argument should be the content to write.';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        const input = args[0];
        if (typeof input !== 'object' || input === null || !('filePath' in input) || !('content' in input)) {
            return 'Error: Invalid arguments. Expected an object with "filePath" and "content" properties.';
        }

        const { filePath, content } = input;

        if (!filePath || typeof filePath !== 'string') {
            return 'Error: A file path must be provided as a string.';
        }
        if (content === undefined || content === null) {
            return 'Error: Content to write must be provided.';
        }

        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return 'Error: No workspace is open.';
            }
            const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, filePath);
            await vscode.workspace.fs.writeFile(uri, Buffer.from(content.toString()));
            return `Successfully wrote to ${filePath}`;
        } catch (error: any) {
            return `Error writing file: ${error.message}`;
        }
    }
}

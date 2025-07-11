import * as vscode from 'vscode';
import { Tool } from './Tool';

export class GetWorkspaceRootTool implements Tool {
    name = 'getWorkspaceRoot';
    description = 'Returns the absolute path to the current workspace root directory.';

    async execute(args: any[], workspaceRoot?: string): Promise<string> {
        if (!workspaceRoot) {
            return 'Error: Workspace root is not available.';
        }
        return workspaceRoot;
    }
}

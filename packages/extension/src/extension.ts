import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ChatViewProvider } from './ChatViewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating AsistenteIA extension...');

    // Load environment variables from .env file in the project root
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (workspaceRoot) {
        dotenv.config({ path: path.join(workspaceRoot, '.env') });
    }

    const provider = new ChatViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, provider));
}

export function deactivate() {
    console.log('Deactivating AsistenteIA extension.');
}


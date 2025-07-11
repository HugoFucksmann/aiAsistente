import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ReActAgent } from './agent/ReActAgent';
import { GeminiService } from './services/GeminiService';
import { OllamaService } from './services/OllamaService';
import { LLMService } from './services/LLMService';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'asistente-ia.chatView';

    private _view?: vscode.WebviewView;
    private agent!: ReActAgent;
    private currentModel: 'gemini' | 'ollama' = 'gemini';

    constructor(private readonly _extensionUri: vscode.Uri) {
        // Agent will be initialized in resolveWebviewView
    }

    private sendUpdate(type: string, content: string) {
        if (this._view) {
            this._view.webview.postMessage({ command: 'addMessage', payload: { author: 'bot', type, text: content } });
        }
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;
        const workspaceRoot = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : '';
        this.agent = new ReActAgent(this.getLLMService(), (type, content) => this.sendUpdate(type, content), workspaceRoot);

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, '..', 'webview', 'dist')
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case 'sendMessage':
                    this.handleSendMessage(message.text);
                    return;
                case 'modelChange':
                    this.currentModel = message.model;
                    const workspaceRoot = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
                        ? vscode.workspace.workspaceFolders[0].uri.fsPath
                        : '';
                    this.agent = new ReActAgent(this.getLLMService(), (type, content) => this.sendUpdate(type, content), workspaceRoot);
                    console.log('Model changed to:', message.model);
                    return;
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        });
    }

    private async handleSendMessage(text: string) {
        if (!this._view) {
            return;
        }
        // The agent will now send updates via the callback
        this.agent.run(text);
    }

    private getLLMService(): LLMService {
        if (this.currentModel === 'gemini') {
            const apiKey = "AIzaSyB_TIm1PT_BGodut3lrbSyJkHBMAzTaVcU";
            if (!apiKey) {
                vscode.window.showErrorMessage('Gemini API key not found. Please set it in your .env file.');
                // Return a dummy service to avoid crashing
                return { generateResponse: async () => "Error: Gemini API Key not configured." };
            }
            return new GeminiService(apiKey, 'gemini-1.5-flash-latest');
        } else {
            return new OllamaService();
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const webviewDistPath = path.join(this._extensionUri.fsPath, '..', 'webview', 'dist');
        const htmlPath = path.join(webviewDistPath, 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        const assetsPath = path.join(webviewDistPath, 'assets');
        const files = fs.readdirSync(assetsPath);
        const jsFile = files.find(f => f.endsWith('.js'));
        const cssFile = files.find(f => f.endsWith('.css'));

        if (jsFile && cssFile) {
            const jsUri = webview.asWebviewUri(vscode.Uri.file(path.join(assetsPath, jsFile)));
            const cssUri = webview.asWebviewUri(vscode.Uri.file(path.join(assetsPath, cssFile)));

            htmlContent = htmlContent
                .replace(/\/assets\/index-.*\.js/, jsUri.toString())
                .replace(/\/assets\/index-.*\.css/, cssUri.toString());
        }

        return htmlContent;
    }
}

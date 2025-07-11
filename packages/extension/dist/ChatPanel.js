"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatPanel = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ReActAgent_1 = require("./agent/ReActAgent");
const GeminiService_1 = require("./services/GeminiService");
const OllamaService_1 = require("./services/OllamaService");
class ChatPanel {
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (ChatPanel.currentPanel) {
            ChatPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel('chatPanel', 'Asistente IA', column || vscode.ViewColumn.Two, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, '..', 'webview', 'dist')
            ]
        });
        ChatPanel.currentPanel = new ChatPanel(panel, extensionUri);
    }
    constructor(panel, extensionUri) {
        this._disposables = [];
        this.currentModel = 'gemini';
        this._panel = panel;
        this._extensionUri = extensionUri;
        this.agent = new ReActAgent_1.ReActAgent(this.getLLMService());
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getHtmlForWebview();
        this._panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'sendMessage':
                    this.handleSendMessage(message.text);
                    return;
                case 'modelChange':
                    this.currentModel = message.model;
                    this.agent = new ReActAgent_1.ReActAgent(this.getLLMService());
                    console.log('Model changed to:', message.model);
                    return;
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    async handleSendMessage(text) {
        const result = await this.agent.run(text);
        this._panel.webview.postMessage({ command: 'addMessage', payload: { author: 'bot', text: result } });
    }
    getLLMService() {
        if (this.currentModel === 'gemini') {
            // IMPORTANT: Replace with your actual Gemini API key from .env file
            const apiKey = "AIzaSyB_TIm1PT_BGodut3lrbSyJkHBMAzTaVcU";
            if (!apiKey) {
                vscode.window.showErrorMessage('Gemini API key not found. Please set it in your .env file.');
                return new GeminiService_1.GeminiService('');
            }
            return new GeminiService_1.GeminiService(apiKey, 'gemini-1.5-flash-latest');
        }
        else {
            return new OllamaService_1.OllamaService();
        }
    }
    dispose() {
        ChatPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _getHtmlForWebview() {
        const webviewDistPath = path.join(this._extensionUri.fsPath, '..', 'webview', 'dist');
        const htmlPath = path.join(webviewDistPath, 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const assetsPath = path.join(webviewDistPath, 'assets');
        const files = fs.readdirSync(assetsPath);
        const jsFile = files.find(f => f.endsWith('.js'));
        const cssFile = files.find(f => f.endsWith('.css'));
        if (jsFile && cssFile) {
            const jsUri = this._panel.webview.asWebviewUri(vscode.Uri.file(path.join(assetsPath, jsFile)));
            const cssUri = this._panel.webview.asWebviewUri(vscode.Uri.file(path.join(assetsPath, cssFile)));
            htmlContent = htmlContent
                .replace(/\/assets\/index-.*\.js/, jsUri.toString())
                .replace(/\/assets\/index-.*\.css/, cssUri.toString());
        }
        return htmlContent;
    }
}
exports.ChatPanel = ChatPanel;

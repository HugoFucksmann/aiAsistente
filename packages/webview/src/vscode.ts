// In packages/webview/src/vscode.ts

// This script should be run within a VS Code webview
// It provides a typed API for communicating with the extension host.

interface VsCodeApi {
    postMessage(message: any): void;
    getState(): any;
    setState(newState: any): void;
}

declare const acquireVsCodeApi: () => VsCodeApi;

export const vscodeApi = acquireVsCodeApi();

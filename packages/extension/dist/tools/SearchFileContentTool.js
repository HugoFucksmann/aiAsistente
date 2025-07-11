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
exports.SearchFileContentTool = void 0;
const vscode = __importStar(require("vscode"));
class SearchFileContentTool {
    constructor() {
        this.name = 'searchFileContent';
        this.description = 'Searches for a given string or regex pattern within files in the workspace. Arguments: { pattern: string, includeGlob?: string }. Returns matching lines with file paths and line numbers.';
    }
    async execute(args, workspaceRoot) {
        const input = args[0];
        if (typeof input !== 'object' || input === null || !('pattern' in input)) {
            return 'Error: Invalid arguments. Expected an object with a "pattern" property and optional "includeGlob" property.';
        }
        const { pattern, includeGlob } = input;
        if (!pattern || typeof pattern !== 'string') {
            return 'Error: A search pattern must be provided as a string.';
        }
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return 'Error: No workspace is open.';
            }
            const rootUri = workspaceFolders[0].uri;
            const files = await vscode.workspace.findFiles(includeGlob || '**/*', '**/node_modules/**');
            let results = [];
            const regex = new RegExp(pattern, 'g');
            for (const file of files) {
                try {
                    const content = await vscode.workspace.fs.readFile(file);
                    const lines = content.toString().split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        if (regex.test(lines[i])) {
                            results.push(`${vscode.workspace.asRelativePath(file)}:${i + 1}: ${lines[i].trim()}`);
                        }
                    }
                }
                catch (readError) {
                    // Ignore errors for unreadable files (e.g., binary files)
                    // console.warn(`Could not read file ${file.fsPath}: ${readError.message}`);
                }
            }
            if (results.length === 0) {
                return 'No matches found.';
            }
            else {
                return results.join('\n');
            }
        }
        catch (error) {
            return `Error searching files: ${error.message}`;
        }
    }
}
exports.SearchFileContentTool = SearchFileContentTool;

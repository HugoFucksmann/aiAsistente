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
exports.SearchFileNameTool = void 0;
const vscode = __importStar(require("vscode"));
class SearchFileNameTool {
    constructor() {
        this.name = 'searchFileName';
        this.description = 'Searches for files by name or partial name using a glob pattern. Arguments: { pattern: string }. Returns a list of matching file paths.';
    }
    async execute(args, workspaceRoot) {
        const input = args[0];
        if (typeof input !== 'object' || input === null || !('pattern' in input)) {
            return 'Error: Invalid arguments. Expected an object with a "pattern" property.';
        }
        const { pattern } = input;
        if (!pattern || typeof pattern !== 'string') {
            return 'Error: A search pattern must be provided as a string.';
        }
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return 'Error: No workspace is open.';
            }
            // Use the provided pattern directly as a glob pattern
            const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
            if (files.length === 0) {
                return 'No files found matching the pattern.';
            }
            else {
                const filePaths = files.map(file => vscode.workspace.asRelativePath(file));
                return filePaths.join('\n');
            }
        }
        catch (error) {
            return `Error searching files by name: ${error.message}`;
        }
    }
}
exports.SearchFileNameTool = SearchFileNameTool;

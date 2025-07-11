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
exports.ListDirectoryTool = void 0;
const vscode = __importStar(require("vscode"));
class ListDirectoryTool {
    constructor() {
        this.name = 'listDirectory';
        this.description = 'Lists the files and directories in a given path relative to the workspace root. The argument should be a relative path to the directory.';
    }
    async execute(args, workspaceRoot) {
        const dirPath = args[0];
        if (!dirPath || typeof dirPath !== 'string') {
            return 'Error: A directory path must be provided as a string in a JSON array, e.g., ["path/to/dir"].';
        }
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return 'Error: No workspace is open.';
            }
            const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, dirPath);
            const entries = await vscode.workspace.fs.readDirectory(uri);
            return entries.map(([name, type]) => `${name}${type === vscode.FileType.Directory ? '/' : ''}`).join('\n');
        }
        catch (error) {
            return `Error listing directory: ${error.message}`;
        }
    }
}
exports.ListDirectoryTool = ListDirectoryTool;

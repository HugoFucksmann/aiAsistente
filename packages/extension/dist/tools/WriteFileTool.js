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
exports.WriteFileTool = void 0;
const vscode = __importStar(require("vscode"));
class WriteFileTool {
    constructor() {
        this.name = 'writeFile';
        this.description = 'Writes content to a file in the current workspace. The first argument should be the relative path to the file, and the second argument should be the content to write.';
    }
    async execute(args, workspaceRoot) {
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
        }
        catch (error) {
            return `Error writing file: ${error.message}`;
        }
    }
}
exports.WriteFileTool = WriteFileTool;

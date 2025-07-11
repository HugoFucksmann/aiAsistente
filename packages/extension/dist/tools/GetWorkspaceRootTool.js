"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWorkspaceRootTool = void 0;
class GetWorkspaceRootTool {
    constructor() {
        this.name = 'getWorkspaceRoot';
        this.description = 'Returns the absolute path to the current workspace root directory.';
    }
    async execute(args, workspaceRoot) {
        if (!workspaceRoot) {
            return 'Error: Workspace root is not available.';
        }
        return workspaceRoot;
    }
}
exports.GetWorkspaceRootTool = GetWorkspaceRootTool;

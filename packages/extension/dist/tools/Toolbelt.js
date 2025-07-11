"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbelt = void 0;
const CreateDirectoryTool_1 = require("./CreateDirectoryTool");
const DeleteDirectoryTool_1 = require("./DeleteDirectoryTool");
const DeleteFileTool_1 = require("./DeleteFileTool");
const ListDirectoryTool_1 = require("./ListDirectoryTool");
const RunTestsTool_1 = require("./RunTestsTool");
const GetWorkspaceRootTool_1 = require("./GetWorkspaceRootTool");
const ReadFileTool_1 = require("./ReadFileTool");
const runTerminal_1 = require("./runTerminal");
const SearchFileContentTool_1 = require("./SearchFileContentTool");
const WriteFileTool_1 = require("./WriteFileTool");
const SearchFileNameTool_1 = require("./SearchFileNameTool");
class Toolbelt {
    constructor() {
        this.tools = new Map();
        this.addTool(new ReadFileTool_1.ReadFileTool());
        this.addTool(new WriteFileTool_1.WriteFileTool());
        this.addTool(new ListDirectoryTool_1.ListDirectoryTool());
        this.addTool(runTerminal_1.runTerminalTool);
        this.addTool(new SearchFileContentTool_1.SearchFileContentTool());
        this.addTool(new CreateDirectoryTool_1.CreateDirectoryTool());
        this.addTool(new DeleteFileTool_1.DeleteFileTool());
        this.addTool(new DeleteDirectoryTool_1.DeleteDirectoryTool());
        this.addTool(new RunTestsTool_1.RunTestsTool());
        this.addTool(new GetWorkspaceRootTool_1.GetWorkspaceRootTool());
        this.addTool(new SearchFileNameTool_1.SearchFileNameTool());
    }
    addTool(tool) {
        this.tools.set(tool.name, tool);
    }
    getTool(name) {
        return this.tools.get(name);
    }
    getToolDescriptions() {
        return Array.from(this.tools.values())
            .map(tool => `- ${tool.name}: ${tool.description}`)
            .join('\n');
    }
}
exports.Toolbelt = Toolbelt;

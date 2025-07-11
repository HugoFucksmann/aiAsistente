import { CreateDirectoryTool } from './CreateDirectoryTool';
import { DeleteDirectoryTool } from './DeleteDirectoryTool';
import { DeleteFileTool } from './DeleteFileTool';
import { ListDirectoryTool } from './ListDirectoryTool';
import { RunTestsTool } from './RunTestsTool';
import { GetWorkspaceRootTool } from './GetWorkspaceRootTool';
import { ReadFileTool } from './ReadFileTool';
import { runTerminalTool } from './runTerminal';
import { SearchFileContentTool } from './SearchFileContentTool';
import { Tool } from './Tool';
import { WriteFileTool } from './WriteFileTool';
import { SearchFileNameTool } from './SearchFileNameTool';

export class Toolbelt {
    private tools: Map<string, Tool> = new Map();

    constructor() {
        this.addTool(new ReadFileTool());
        this.addTool(new WriteFileTool());
        this.addTool(new ListDirectoryTool());
        this.addTool(runTerminalTool);
        this.addTool(new SearchFileContentTool());
        this.addTool(new CreateDirectoryTool());
        this.addTool(new DeleteFileTool());
        this.addTool(new DeleteDirectoryTool());
        this.addTool(new RunTestsTool());
        this.addTool(new GetWorkspaceRootTool());
        this.addTool(new SearchFileNameTool());
    }

    private addTool(tool: Tool) {
        this.tools.set(tool.name, tool);
    }

    getTool(name: string): Tool | undefined {
        return this.tools.get(name);
    }

    getToolDescriptions(): string {
        return Array.from(this.tools.values())
            .map(tool => `- ${tool.name}: ${tool.description}`)
            .join('\n');
    }
}

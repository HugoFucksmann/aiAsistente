export interface Tool {
    name: string;
    description: string;
    execute: (args: any[], workspaceRoot?: string) => Promise<string>;
}

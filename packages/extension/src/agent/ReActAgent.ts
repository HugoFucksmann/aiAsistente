import { LLMService } from '../services/LLMService';
import { Toolbelt } from '../tools/Toolbelt';

type UpdateCallback = (type: string, content: string) => void;

export class ReActAgent {
    private llmService: LLMService;
    private toolbelt: Toolbelt;
    private maxIterations = 10;
    private sendUpdate: UpdateCallback;
    private workspaceRoot: string;

    constructor(llmService: LLMService, sendUpdate: UpdateCallback, workspaceRoot: string) {
        this.llmService = llmService;
        this.toolbelt = new Toolbelt();
        this.sendUpdate = sendUpdate;
        this.workspaceRoot = workspaceRoot;
    }

    public async run(prompt: string): Promise<void> {
        let iteration = 0;
        let fullPrompt = this.constructPrompt(prompt);

        while (iteration < this.maxIterations) {
            const result = await this.llmService.generateResponse(fullPrompt);
            fullPrompt += result;

            const thought = this.parseThought(result);
            if (thought) {
                this.sendUpdate('thought', thought);
            }

            const { action, args } = this.parseAction(result);

            if (action === 'Finish') {
                this.sendUpdate('final-answer', args.join(' '));
                return;
            }

            if (action) {
                const tool = this.toolbelt.getTool(action);
                if (tool) {
                    let argsDisplay = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(', ');
                    this.sendUpdate('tool-start', `Executing tool: ${action} with input: ${argsDisplay}`);
                    const observation = await tool.execute(args, this.workspaceRoot);
                    this.sendUpdate('tool-output', `Tool ${action} returned: ${String(observation)}`);
                    fullPrompt += `\nObservation: ${observation}\nThought:`;
                } else {
                    const observation = `Unknown tool '${action}'.`;
                    this.sendUpdate('tool-output', observation);
                    fullPrompt += `\nObservation: ${observation}\nThought:`;
                }
            } else {
                // If the model doesn't produce a valid action, end the loop.
                this.sendUpdate('final-answer', result);
                return;
            }

            iteration++;
        }

        this.sendUpdate('error', "Error: Max iterations reached.");
    }

    private constructPrompt(userPrompt: string): string {
        return `\nYou are a helpful AI assistant that can use tools to answer questions.\nYou have access to the following tools:\n${this.toolbelt.getToolDescriptions()}\n\nTo use a tool, you must use the following format:\nThought: I need to use a tool to do something.\nAction: The name of the tool to use.\nAction Input: A JSON array or object representing the arguments for the tool. For example, for 'writeFile' tool, Action Input could be {"filePath": "src/newFile.ts", "content": "console.log('Hello');"}. For 'listDirectory', it could be ["src"].\n\nIf you have enough information to answer the user's question, you can use the "Finish" action.\nThought: I have the final answer.\nAction: Finish\nAction Input: The final answer to the user.\n\nUser's question: ${userPrompt}\nThought:`;
    }

    private parseThought(response: string): string | null {
        const thoughtRegex = /Thought:\s*(.*)/;
        const match = response.match(thoughtRegex);
        return match ? match[1].trim() : null;
    }

    private parseAction(response: string): { action: string | null; args: any[] } {
        const actionRegex = /Action:\s*(.*?)\nAction Input:\s*(.*)/s;
        const match = response.match(actionRegex);

        if (match) {
            const action = match[1].trim();
            let args: any[] = [];
            const rawInput = match[2].trim();
            console.log(`Raw Action Input for ${action}: '${rawInput}'`); // Add this line for debugging
            try {
                const parsedArgs = JSON.parse(rawInput);
                args = Array.isArray(parsedArgs) ? parsedArgs : [parsedArgs];
            } catch (e: any) {
                console.warn(`Could not parse Action Input as JSON for action '${action}'. Treating as plain string:`, rawInput);
                args = [rawInput];
            }
            return { action, args };
        }

        return { action: null, args: [] };
    }
}
export interface LLMService {
    generateResponse(prompt: string): Promise<string>;
}

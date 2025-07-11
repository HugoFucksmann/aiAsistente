import { LLMService } from './LLMService';
import axios from 'axios';

export class OllamaService implements LLMService {
    private endpoint = 'http://localhost:11434/api/generate';

    constructor(private model: string = 'llama2') {}

    async generateResponse(prompt: string): Promise<string> {
        try {
            const response = await axios.post(this.endpoint, {
                model: this.model,
                prompt: prompt,
                stream: false // We want the full response at once
            });
            return response.data.response;
        } catch (error: any) {
            console.error("Error calling Ollama API:", error);
            if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
                return 'Error: Could not connect to Ollama. Please ensure Ollama is running.';
            }
            return `Error: Could not get a response from Ollama. ${error.message}`;
        }
    }
}


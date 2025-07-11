import { LLMService } from './LLMService';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService implements LLMService {
    private genAI: GoogleGenerativeAI;
    private modelName: string;

    constructor(private apiKey: string, modelName: string) {
        if (!apiKey) {
            throw new Error("Gemini API key is missing.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.modelName = modelName;
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        } catch (error: any) {
            console.error("Error calling Gemini API:", error);
            return `Error: Could not get a response from Gemini. ${error.message}`;
        }
    }
}


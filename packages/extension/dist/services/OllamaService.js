"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const axios_1 = __importDefault(require("axios"));
class OllamaService {
    constructor(model = 'llama2') {
        this.model = model;
        this.endpoint = 'http://localhost:11434/api/generate';
    }
    async generateResponse(prompt) {
        try {
            const response = await axios_1.default.post(this.endpoint, {
                model: this.model,
                prompt: prompt,
                stream: false // We want the full response at once
            });
            return response.data.response;
        }
        catch (error) {
            console.error("Error calling Ollama API:", error);
            if (axios_1.default.isAxiosError(error) && error.code === 'ECONNREFUSED') {
                return 'Error: Could not connect to Ollama. Please ensure Ollama is running.';
            }
            return `Error: Could not get a response from Ollama. ${error.message}`;
        }
    }
}
exports.OllamaService = OllamaService;

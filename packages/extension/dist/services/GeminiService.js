"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiService {
    constructor(apiKey, modelName) {
        this.apiKey = apiKey;
        if (!apiKey) {
            throw new Error("Gemini API key is missing.");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.modelName = modelName;
    }
    async generateResponse(prompt) {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        }
        catch (error) {
            console.error("Error calling Gemini API:", error);
            return `Error: Could not get a response from Gemini. ${error.message}`;
        }
    }
}
exports.GeminiService = GeminiService;

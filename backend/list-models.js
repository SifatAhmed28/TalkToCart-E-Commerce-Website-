import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function listAvailableModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = await genAI.listModels();

        console.log("Available Models:");
        console.log("================");

        models.models.forEach(model => {
            console.log(`- ${model.name}`);
            console.log(`  Display Name: ${model.displayName}`);
            console.log(`  Description: ${model.description}`);
            console.log(`  Supported Generation Methods: ${model.supportedGenerationMethods}`);
            console.log("---");
        });
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listAvailableModels();

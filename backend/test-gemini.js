import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // Load .env file

async function testConnection() {
    console.log("1. Testing API Key:", process.env.GEMINI_API_KEY ? "Found ✅" : "Missing ❌");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("2. Sending message to Google...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();

        console.log("3. SUCCESS! Google replied:", text);
    } catch (error) {
        console.error("\n❌ FAILED. Here is the real error:\n");
        console.error(error);
    }
}

testConnection();

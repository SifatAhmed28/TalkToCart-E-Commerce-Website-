import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

export const chatWithAI = async (req, res) => {
    try {
        const { userMessage } = req.body;

        // 1. Validate input
        if (!userMessage || userMessage.trim() === '') {
            return res.status(400).json({
                error: 'Message is required'
            });
        }

        // 2. Check if key exists
        if (!process.env.GEMINI_API_KEY) {
            console.error("⚠️ GEMINI_API_KEY is missing from environment variables");
            throw new Error("Gemini API Key is missing in .env");
        }

        // 3. Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Try gemini-2.5-flash first (more available)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.7,
            }
        });

        const prompt = `Act as a helpful shop assistant for an e-commerce website called TalkToCart. 
        User says: "${userMessage}". 
        Reply in a friendly, helpful tone. Keep it concise (1-2 sentences max).`;

        console.log(`🤖 Sending to Gemini: "${userMessage.substring(0, 50)}..."`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`✅ Gemini Response: ${text.substring(0, 100)}...`);

        res.json({
            success: true,
            reply: text
        });

    } catch (error) {
        console.error("🔥🔥 GEMINI API ERROR:", error.message);
        console.error("Full error:", error);

        // More detailed error handling
        if (error.message.includes('API_KEY_INVALID')) {
            return res.status(401).json({
                success: false,
                reply: "API key is invalid. Please check your Gemini API key.",
                error: "Invalid API Key"
            });
        }

        if (error.message.includes('quota')) {
            return res.status(429).json({
                success: false,
                reply: "API quota exceeded. Please try again later.",
                error: "Quota Exceeded"
            });
        }

        res.status(500).json({
            success: false,
            reply: "I'm having trouble processing your request. Please try again in a moment.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

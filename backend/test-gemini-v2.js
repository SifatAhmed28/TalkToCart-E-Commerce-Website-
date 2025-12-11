import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testConnection() {
    console.log("1. Testing API Key:", process.env.GEMINI_API_KEY ? "Found ✅" : "Missing ❌");
    console.log("2. Key starts with:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." : "N/A");

    try {
        // Try different model names
        const modelsToTry = [
            "gemini-pro",
            "gemini-1.0-pro",
            "gemini-1.5-pro-latest",
            "models/gemini-pro",
            "models/gemini-1.0-pro",
            "gemini-1.5-flash-latest"
        ];

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        for (const modelName of modelsToTry) {
            console.log(`\nTrying model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you working?");
                const response = await result.response;
                const text = response.text();
                console.log(`✅ SUCCESS with ${modelName}:`, text.substring(0, 100));
                return; // Stop if successful
            } catch (modelError) {
                console.log(`❌ Failed with ${modelName}:`, modelError.message.substring(0, 100));
            }
        }

        console.log("\n❌ All models failed. Trying direct API call...");

        // Try direct API call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "Hello, are you working?"
                    }]
                }]
            })
        });

        const data = await response.json();
        console.log("Direct API response:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("\n❌ FINAL ERROR:\n", error);

        // Check if it's an API key issue
        if (error.message && error.message.includes('API_KEY_INVALID')) {
            console.log("\n⚠️ Your API key might be invalid. Please check:");
            console.log("1. Go to: https://makersuite.google.com/app/apikey");
            console.log("2. Make sure the API key is enabled");
            console.log("3. Check if billing is set up (Gemini API requires billing to be enabled)");
        }
    }
}

testConnection();

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function list() {
    console.log("Fetching models with key:", apiKey ? "Found" : "Missing");
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("Response:", data);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
list();

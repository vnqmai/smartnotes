import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}

const gemeniai = new GoogleGenAI({});

export default gemeniai;
import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const MODEL_ID = "gemini-2.0-flash-001";


import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const AI_MODEL = process.env.GEMINI_MODEL;
const ai = new GoogleGenAI({ apiKey: API_KEY });

const lengthMap = {
  short: "1-2 sentences",
  medium: "3-5 sentences",
  long: "5+ sentences",
};

export default async function generateResponse(text, summaryLength) {
  try {
    const prompt = `Summarize this into a ${summaryLength} of ${
      summaryLength in lengthMap ? lengthMap[summaryLength] : summaryLength
    } paragraph :\n${text}`;

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
    });

    return { generated_text: response.text };
  } catch (error) {
    return { error: "Error generating content:", error };
  }
}

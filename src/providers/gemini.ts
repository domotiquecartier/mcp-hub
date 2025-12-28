import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function callGemini(prompt: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash" // gratuit / rapide / parfait pour résumé
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

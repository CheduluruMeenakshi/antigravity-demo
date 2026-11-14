import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || 'dummy_api_key_for_init';
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ [AgriAdvisor Server] GEMINI_API_KEY is not configured in .env');
}

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are AgriAdvisor AI, an elite virtual agronomist and crop pathologist with decades of field experience in sustainable agriculture, pest management, and soil science. Your role is to provide accurate, scientifically grounded, actionable, and safety-compliant crop advisories based on visual evidence and grower descriptions. Always prioritize sustainable farming practices, minimize unnecessary chemical pesticide usage, and emphasize applicator safety. You MUST respond with valid JSON only, no markdown, no extra text.`;

export async function generateCropAdvisory(
  promptText: string,
  imagePart?: { inlineData: { data: string; mimeType: string } }
): Promise<string> {
  const contentParts: any[] = [{ text: promptText }];
  if (imagePart) contentParts.push(imagePart);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: contentParts }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  return response.text ?? '';
}

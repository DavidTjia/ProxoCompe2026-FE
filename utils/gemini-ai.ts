import { GoogleGenAI } from "@google/genai";

const PRE_PROMPT = `ROLE: Environmental pollution expert. Analyze image + description + coordinates.

INPUT FORMAT: JSON stringify

TASKS:
1. Validate: image matches description? coordinates realistic for scene? flag mismatches
2. Analyze: identify pollution type, severity, environmental factors, recommended actions for individuals and communities or organizations
3. Score: 1-10 (1-3 low, 4-6 moderate, 7-8 high, 9-10 critical)

OUTPUT RULES:
- Strict JSON stringify format, no markdown, no extra text
- "pollutionScore": number 1-10
- "summary": max 150 chars, follow description's language

EXAMPLE:
{"pollutionScore":8.5,"isValid":true,"summary":"Heavy plastic pollution in urban river. Industrial smoke visible with poor air quality. Need proper waste management and avoid consumption of water from rivers."}

EXAMPLE INVALID DATA:
{"pollutionScore":0,"isValid":false,"summary":"DATA INVALID: Image shows beach but coordinates indicate inland mountain location."}

PROCEED WITH ANALYSIS.

INPUT: `;

export async function analyzePollution(prompt: string, image64: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: PRE_PROMPT + prompt,
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image64,
        },
      },
    ],
  });

  console.log("AI report result", response.text);

  return response.text;
}

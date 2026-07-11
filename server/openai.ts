import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY is missing. AI endpoints will fall back to Gemini or simulated engine.");
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey,
    });
  }
  return openaiClient;
}

/**
 * Helper to call OpenAI Chat Completion
 */
export async function generateOpenAIChatCompletion(systemPrompt: string, userPrompt: string, temperature = 0.7): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI client not initialized. Check your OPENAI_API_KEY.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective, lightning-fast, and extremely accurate for coding SaaS
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature,
    });
    return response.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("OpenAI Chat Completion Error:", error);
    throw error;
  }
}

/**
 * Helper to call OpenAI with JSON structured output
 */
export async function generateOpenAIStructuredOutput(systemPrompt: string, userPrompt: string, temperature = 0.2): Promise<any> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI client not initialized. Check your OPENAI_API_KEY.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature,
    });
    const content = response.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI Structured Output Error:", error);
    throw error;
  }
}

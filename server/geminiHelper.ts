import { GoogleGenAI } from "@google/genai";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GenerateConfig {
  responseMimeType?: string;
  systemInstruction?: string;
  temperature?: number;
  [key: string]: any;
}

/**
 * Executes a Gemini content generation request with built-in retry logic
 * and multiple fallback model layers to handle 503 Spikes or 429 rate limit errors.
 */
export async function generateContentWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  config: GenerateConfig = {},
  tag: string = "GENERAL"
): Promise<any> {
  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    // We will attempt up to 2 times per model if we get a transient indicator like 503 or 429
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[GEMINI HELPER] [${tag}] Attempting model list resolution - Model: ${model}, Attempt: ${attempt}/2`);
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: config
        });

        // If response is valid, return it
        if (response && (response.text || response.candidates)) {
          console.log(`[GEMINI HELPER] [${tag}] Content query succeeded using ${model}`);
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err.message || "";
        const isTransient = errMsg.includes("503") || 
                            errMsg.includes("429") || 
                            errMsg.includes("UNAVAILABLE") || 
                            errMsg.includes("Resource has been exhausted") ||
                            errMsg.includes("demand");

        console.warn(
          `[GEMINI HELPER] [${tag}] Error on model "${model}" (attempt ${attempt}/2): ${errMsg}`
        );

        if (isTransient && attempt < 2) {
          const backoff = attempt * 300; // wait 300ms, then 600ms
          console.log(`[GEMINI HELPER] [${tag}] Transient error detected. Cooling down for ${backoff}ms...`);
          await delay(backoff);
        } else {
          // Break inner loop to try the next fallback model from the outer modelsToTry sequence
          break;
        }
      }
    }
  }

  // If we reach here, all models and attempts failed. Throw the last caught error.
  throw lastError || new Error("All generative model attempts were exhausted.");
}

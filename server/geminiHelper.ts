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

  const globalTimeoutMs = 6500; // 6.5 seconds total limit to prevent gateway timeout
  const startTime = Date.now();
  let lastError: any = null;

  for (const model of modelsToTry) {
    // We will attempt up to 2 times per model if we get a transient indicator like 503 or 429
    for (let attempt = 1; attempt <= 2; attempt++) {
      const elapsed = Date.now() - startTime;
      const remainingTime = globalTimeoutMs - elapsed;

      // If we don't have enough time left for a meaningful attempt (at least 1.5s), fail fast
      if (remainingTime < 1500) {
        throw lastError || new Error(`Gemini API total execution time exceeded global limit of ${globalTimeoutMs}ms`);
      }

      // Per-attempt timeout is the minimum of 3.5s and the remaining global time
      const attemptTimeoutMs = Math.min(3500, remainingTime);

      try {
        console.log(`[GEMINI HELPER] [${tag}] Attempting model list resolution - Model: ${model}, Attempt: ${attempt}/2 (Timeout: ${attemptTimeoutMs}ms)`);
        let timerId: any;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timerId = setTimeout(() => reject(new Error(`Gemini API request timed out (${attemptTimeoutMs}ms limit exceeded)`)), attemptTimeoutMs);
        });

        const generatePromise = ai.models.generateContent({
          model: model,
          contents: prompt,
          config: config
        });

        const response = await Promise.race([generatePromise, timeoutPromise]);
        clearTimeout(timerId);

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
          // Check if we have enough remaining time to wait and then retry
          const currentElapsed = Date.now() - startTime;
          if (globalTimeoutMs - currentElapsed > backoff + 1500) {
            console.log(`[GEMINI HELPER] [${tag}] Transient error detected. Cooling down for ${backoff}ms...`);
            await delay(backoff);
          } else {
            console.log(`[GEMINI HELPER] [${tag}] Insufficient time left to perform backoff/retry. Skipping to next model.`);
            break;
          }
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

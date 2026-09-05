import type { GenerateParams, GenerateResult, ImageProvider } from "./types";
import { ProviderError } from "./types";

/**
 * Google Gemini image editing ("Nano Banana" family). This calls the
 * Generative Language API directly over REST so the project has no
 * extra SDK dependency — just fetch.
 *
 * IMPORTANT: Google ships new image models fairly often (this project
 * was wired up against `gemini-2.5-flash-image`). Check
 * https://ai.google.dev/gemini-api/docs/models for the current image
 * model id and set GEMINI_IMAGE_MODEL if it has moved on.
 *
 * Get an API key at https://aistudio.google.com/apikey and put it in
 * .env.local as GEMINI_API_KEY.
 */
const DEFAULT_MODEL = "gemini-2.5-flash-image";

export const geminiProvider: ImageProvider = {
  name: "gemini",

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new ProviderError(
        "GEMINI_API_KEY is not set. Add it to .env.local, or set IMAGE_PROVIDER=mock to run without a real model.",
      );
    }

    const model = process.env.GEMINI_IMAGE_MODEL || DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: params.prompt },
            {
              inline_data: {
                mime_type: params.mimeType,
                data: params.imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    };

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new ProviderError("Could not reach the Gemini API.", err);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new ProviderError(
        `Gemini API returned ${response.status}: ${text.slice(0, 500)}`,
      );
    }

    const json = await response.json();
    const parts: Array<Record<string, unknown>> =
      json?.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      const inline =
        (part as { inlineData?: { data?: string; mimeType?: string } })
          .inlineData ??
        (part as { inline_data?: { data?: string; mime_type?: string } })
          .inline_data;
      const data =
        (inline as { data?: string } | undefined)?.data ?? undefined;
      const mimeType =
        (inline as { mimeType?: string; mime_type?: string } | undefined)
          ?.mimeType ??
        (inline as { mime_type?: string } | undefined)?.mime_type ??
        "image/png";

      if (data) {
        return { imageBase64: data, mimeType };
      }
    }

    throw new ProviderError(
      "Gemini did not return an image. It may have refused the request — check the response text/safety fields in the raw API response for details.",
    );
  },
};

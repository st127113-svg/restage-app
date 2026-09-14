import type { GenerateParams, GenerateResult, ImageProvider, SuggestedProduct } from "./types";
import { ProviderError } from "./types";

/**
 * Delegates image generation to an n8n workflow instead of calling
 * Nano Banana (Gemini) directly from this app. This provider's only
 * job is to POST the raw inputs to an n8n webhook and parse whatever
 * comes back — the workflow itself builds the Nano Banana prompt from
 * those inputs and calls the model. See README.md's "Using n8n"
 * section for the exact request/response contract and a workflow to
 * build from.
 *
 * Set N8N_WEBHOOK_URL in .env.local (or on your host) to the
 * workflow's production webhook URL.
 */
export const n8nProvider: ImageProvider = {
  name: "n8n",

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new ProviderError(
        "N8N_WEBHOOK_URL is not set. Add it to .env.local, or set IMAGE_PROVIDER to mock/gemini instead.",
      );
    }

    let response: Response;
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: params.imageBase64,
          mimeType: params.mimeType,
          roomType: params.roomType,
          style: params.style,
          purpose: params.purpose ?? "",
          space: params.space ?? null,
          freeNote: params.freeNote ?? "",
          // The prompt this app would have used itself, in case the
          // n8n workflow would rather use it as-is instead of building
          // its own from the raw fields above.
          suggestedPrompt: params.prompt,
        }),
      });
    } catch (err) {
      throw new ProviderError("Could not reach the n8n webhook.", err);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new ProviderError(
        `n8n webhook returned ${response.status}: ${text.slice(0, 500)}`,
      );
    }

    const json = await response.json().catch(() => null);
    const imageBase64 = json?.imageBase64;
    const mimeType = typeof json?.mimeType === "string" ? json.mimeType : "image/png";

    if (!imageBase64 || typeof imageBase64 !== "string") {
      throw new ProviderError(
        'n8n webhook did not return an "imageBase64" field. Check the workflow\'s Respond to Webhook node.',
      );
    }

    // The workflow's AI Agent matches identified furniture to real Lazada
    // listings and returns them here. Defensive parsing since this comes
    // straight from an LLM's JSON output inside the workflow -- never
    // trust its shape blindly.
    const rawProducts = Array.isArray(json?.suggestedProducts) ? json.suggestedProducts : [];
    const suggestedProducts: SuggestedProduct[] = rawProducts
      .filter((p: unknown): p is Record<string, unknown> => !!p && typeof p === "object")
      .map((p: Record<string, unknown>) => ({
        item: typeof p.item === "string" ? p.item : "Item",
        matched: p.matched === true,
        name: typeof p.name === "string" ? p.name : undefined,
        price: typeof p.price === "number" ? p.price : undefined,
        currency: typeof p.currency === "string" ? p.currency : undefined,
        image: typeof p.image === "string" ? p.image : undefined,
        productUrl: typeof p.productUrl === "string" ? p.productUrl : undefined,
        reason: typeof p.reason === "string" ? p.reason : undefined,
      }));

    return { imageBase64, mimeType, suggestedProducts };
  },
};

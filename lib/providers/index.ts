import type { ImageProvider } from "./types";
import { mockProvider } from "./mock";
import { geminiProvider } from "./gemini";
import { n8nProvider } from "./n8n";

const providers: Record<string, ImageProvider> = {
  mock: mockProvider,
  gemini: geminiProvider,
  n8n: n8nProvider,
};

export function getProvider(): ImageProvider {
  const key = (process.env.IMAGE_PROVIDER || "mock").toLowerCase();
  const provider = providers[key];
  if (!provider) {
    throw new Error(
      `Unknown IMAGE_PROVIDER "${key}". Valid values: ${Object.keys(providers).join(", ")}.`,
    );
  }
  return provider;
}

export type { GenerateParams, GenerateResult, ImageProvider, SuggestedProduct } from "./types";
export { ProviderError } from "./types";

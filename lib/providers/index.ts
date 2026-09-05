import type { ImageProvider } from "./types";
import { mockProvider } from "./mock";
import { geminiProvider } from "./gemini";

const providers: Record<string, ImageProvider> = {
  mock: mockProvider,
  gemini: geminiProvider,
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

export type { GenerateParams, GenerateResult, ImageProvider } from "./types";
export { ProviderError } from "./types";

import type { SpaceDetails } from "@/lib/constants";

export interface GenerateParams {
  /** Raw base64 payload of the uploaded photo, no "data:" prefix. */
  imageBase64: string;
  /** e.g. "image/jpeg" or "image/png" */
  mimeType: string;
  roomType: string;
  style: string;
  /** Full text instruction built by lib/prompt.ts */
  prompt: string;
  /**
   * Raw context behind `prompt`, passed through as-is so a provider
   * that wants to build its own prompt (e.g. an n8n workflow) doesn't
   * have to re-derive it. mock/gemini ignore these and just use
   * `prompt`.
   */
  purpose?: string;
  space?: SpaceDetails;
  freeNote?: string;
}

export interface GenerateResult {
  /** Raw base64 payload of the generated photo, no "data:" prefix. */
  imageBase64: string;
  mimeType: string;
}

export interface ImageProvider {
  name: string;
  generate(params: GenerateParams): Promise<GenerateResult>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

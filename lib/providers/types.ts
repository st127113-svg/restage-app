export interface GenerateParams {
  /** Raw base64 payload of the uploaded photo, no "data:" prefix. */
  imageBase64: string;
  /** e.g. "image/jpeg" or "image/png" */
  mimeType: string;
  roomType: string;
  style: string;
  /** Full text instruction built by lib/prompt.ts */
  prompt: string;
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

import sharp from "sharp";
import type { GenerateParams, GenerateResult, ImageProvider } from "./types";

/**
 * A provider that needs no API key at all, so the app runs and the
 * whole upload -> configure -> generate -> result flow can be
 * demoed end to end without anyone plugging in a real model.
 *
 * It does NOT do real style transfer. It just visibly transforms the
 * uploaded photo (a hue/saturation shift keyed off the chosen style,
 * plus a watermark banner) so it's obvious this is a stand-in, not a
 * real AI result. Swap IMAGE_PROVIDER=gemini (see lib/providers/gemini.ts)
 * for the real thing.
 */
export const mockProvider: ImageProvider = {
  name: "mock",

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const { imageBase64, roomType, style } = params;

    // Simulate the couple-of-seconds latency a real model call has,
    // so the "Generating…" screen isn't instant and feels real.
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const inputBuffer = Buffer.from(imageBase64, "base64");

    const hueRotate = hashToHue(style);
    const label = `MOCK PREVIEW — ${roomType} · ${style} (connect a real provider for AI results)`;

    const metadata = await sharp(inputBuffer).metadata();
    const width = metadata.width ?? 1024;
    const bannerHeight = Math.max(36, Math.round(width * 0.035));

    const bannerSvg = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${bannerHeight}">
        <rect width="100%" height="100%" fill="#1f1a16" fill-opacity="0.72" />
        <text x="16" y="${Math.round(bannerHeight * 0.68)}" font-family="sans-serif" font-size="${Math.round(
          bannerHeight * 0.42,
        )}" fill="#ffffff">${escapeXml(label)}</text>
      </svg>`,
    );

    const output = await sharp(inputBuffer)
      .rotate()
      .modulate({ saturation: 1.15, hue: hueRotate })
      .composite([{ input: bannerSvg, top: 0, left: 0 }])
      .png()
      .toBuffer();

    return {
      imageBase64: output.toString("base64"),
      mimeType: "image/png",
    };
  },
};

function hashToHue(style: string): number {
  let hash = 0;
  for (let i = 0; i < style.length; i++) {
    hash = (hash * 31 + style.charCodeAt(i)) % 360;
  }
  return hash;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

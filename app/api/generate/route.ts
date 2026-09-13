import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { getProvider, ProviderError } from "@/lib/providers";
import { MAX_UPLOAD_BYTES, type SpaceDetails } from "@/lib/constants";

// sharp (used by the mock provider) needs the Node runtime, not edge.
export const runtime = "nodejs";
// Real image models can take a while; give this route room on hosts
// that support a longer function timeout (e.g. Vercel Pro).
export const maxDuration = 60;

interface GenerateRequestBody {
  imageBase64?: string;
  mimeType?: string;
  roomType?: string;
  style?: string;
  purpose?: string;
  space?: SpaceDetails;
  freeNote?: string;
}

export async function POST(request: NextRequest) {
  let body: GenerateRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { imageBase64, mimeType, roomType, style, purpose, space, freeNote } = body;

  if (!imageBase64 || !mimeType || !roomType || !style) {
    return NextResponse.json(
      { error: "imageBase64, mimeType, roomType, and style are all required." },
      { status: 400 },
    );
  }

  // Rough size guard. Real production uploads should go straight to
  // object storage instead of through a JSON API route — see README.
  const approxBytes = Math.ceil((imageBase64.length * 3) / 4);
  if (approxBytes > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `Image is too large. Max ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.` },
      { status: 413 },
    );
  }

  const prompt = buildPrompt(roomType, style, { purpose, space, freeNote });

  try {
    const provider = getProvider();
    const result = await provider.generate({
      imageBase64,
      mimeType,
      roomType,
      style,
      prompt,
      purpose,
      space,
      freeNote,
    });

    return NextResponse.json({
      image: result.imageBase64,
      mimeType: result.mimeType,
    });
  } catch (err) {
    const message =
      err instanceof ProviderError
        ? err.message
        : "Something went wrong generating the image.";
    console.error("[/api/generate]", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

import type { SpaceDetails } from "@/lib/constants";

export interface PromptContext {
  purpose?: string;
  space?: SpaceDetails;
  freeNote?: string;
}

/**
 * Builds the text instruction sent to the image model alongside the
 * uploaded room photo. The two things that matter most for this use
 * case are (1) telling the model to preserve the room's geometry and
 * (2) being specific about what should change. Everything from
 * PromptContext is optional — it folds in whatever the customer filled
 * in during Room & Purpose / Space Details / the free-text step.
 */
export function buildPrompt(
  roomType: string,
  style: string,
  context: PromptContext = {},
): string {
  const room = roomType.toLowerCase();
  const styleLower = style.toLowerCase();

  const lines = [
    `Redecorate this photo of a ${room} in a ${styleLower} interior design style.`,
    `Keep the room's architecture exactly as it is in the original photo: the same walls, windows, doors, ceiling height, camera angle, and perspective. Do not add, remove, or move any structural elements.`,
    `Change the furniture, decor, textiles, lighting fixtures, color palette, and finishes so the room reads as a ${styleLower} ${room}.`,
  ];

  if (context.purpose?.trim()) {
    lines.push(`How the customer actually uses this room: ${context.purpose.trim()}.`);
  }

  if (context.space?.keep?.trim()) {
    lines.push(`Keep these existing items in the redesign: ${context.space.keep.trim()}.`);
  }
  if (context.space?.remove?.trim()) {
    lines.push(`Remove these items: ${context.space.remove.trim()}.`);
  }
  if (context.space?.needs?.trim()) {
    lines.push(`The room should accommodate: ${context.space.needs.trim()}.`);
  }

  if (context.freeNote?.trim()) {
    lines.push(`Additional instructions from the customer: ${context.freeNote.trim()}.`);
  }

  lines.push(
    `Render it as a photorealistic interior photograph with natural, even lighting and high detail.`,
  );

  return lines.join(" ");
}

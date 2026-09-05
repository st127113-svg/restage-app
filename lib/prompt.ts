/**
 * Builds the text instruction sent to the image model alongside the
 * uploaded room photo. The two things that matter most for this use
 * case are (1) telling the model to preserve the room's geometry and
 * (2) being specific about what should change.
 */
export function buildPrompt(roomType: string, style: string): string {
  const room = roomType.toLowerCase();
  const styleLower = style.toLowerCase();

  return [
    `Redecorate this photo of a ${room} in a ${styleLower} interior design style.`,
    `Keep the room's architecture exactly as it is in the original photo: the same walls, windows, doors, ceiling height, camera angle, and perspective. Do not add, remove, or move any structural elements.`,
    `Change the furniture, decor, textiles, lighting fixtures, color palette, and finishes so the room reads as a ${styleLower} ${room}.`,
    `Render it as a photorealistic interior photograph with natural, even lighting and high detail.`,
  ].join(" ");
}

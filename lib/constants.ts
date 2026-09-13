export const ROOM_TYPES = [
  "Kitchen",
  "Living room",
  "Bedroom",
  "Bathroom",
  "Home office",
] as const;

export type RoomType = (typeof ROOM_TYPES)[number];

export const STYLES = [
  "Modern",
  "Scandinavian",
  "Industrial",
  "Farmhouse",
  "Minimalist",
  "Traditional",
] as const;

export type Style = (typeof STYLES)[number];

// Keep this in sync with whatever the API route will actually accept.
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

// Stage 3 — Select Room & Purpose: how the room actually gets used,
// beyond just its type. Free text, these are just prompts/examples.
export const PURPOSE_EXAMPLES: Record<RoomType, string> = {
  Kitchen: "e.g. cooking most nights, also where the kids do homework",
  "Living room": "e.g. mostly TV and hosting friends on weekends",
  Bedroom: "e.g. sleep + a reading corner, no TV",
  Bathroom: "e.g. quick mornings for two people, no tub needed",
  "Home office": "e.g. video calls most days, needs to look tidy on camera",
};

export interface SpaceDetails {
  lengthM: string;
  widthM: string;
  keep: string;
  remove: string;
  needs: string;
}

export const EMPTY_SPACE_DETAILS: SpaceDetails = {
  lengthM: "",
  widthM: "",
  keep: "",
  remove: "",
  needs: "",
};

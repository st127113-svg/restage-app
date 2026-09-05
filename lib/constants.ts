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

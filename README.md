# Restage — AI room redesign prototype

Upload a photo of a room, pick a room type and a style, and get back an
AI-redecorated version of the same room. This is a working prototype
built from the design mockup below.

**Design mockup:** https://claude.ai/code/artifact/4819bd0a-cc6c-479e-80b1-c2f7cb9ac9d9
(the 4-screen flow this app implements: upload → room & style → generating → result)

## How it works

```
Browser (app/page.tsx)
  1. UploadStep      — user drops/selects a photo, read as a data URL
  2. ConfigureStep   — user picks room type + style
  3. GeneratingStep  — shown while the request is in flight
  4. ResultStep      — before/after slider, download button
        |
        | POST /api/generate  { imageBase64, mimeType, roomType, style }
        v
app/api/generate/route.ts
  - builds a text prompt (lib/prompt.ts) describing the requested
    room type + style, instructing the model to preserve the room's
    architecture and only change decor
  - calls an image provider (lib/providers/*)
        |
        v
lib/providers/index.ts  -- picks a provider based on IMAGE_PROVIDER
  - mock.ts    -- no API key needed. Visibly tints the uploaded photo
                  and stamps a "MOCK PREVIEW" banner on it, so the
                  whole flow can be demoed/graded without anyone
                  needing to pay for a real model.
  - gemini.ts  -- calls Google's Gemini image model (see below) for a
                  real AI-redecorated image.
```

Providers share one interface (`lib/providers/types.ts`), so adding a
different backend (OpenAI's image edit endpoint, Stability, Replicate,
...) means writing one new file and registering it in
`lib/providers/index.ts` — nothing else changes.

## Why Gemini for the real provider

Room redecoration is an **image-editing** task, not text-to-image: the
model needs to take the existing photo and change only the decor while
keeping the walls, window, and camera angle intact. Gemini's image
models ("Nano Banana" family) are built for exactly this — Google's own
docs give "change only the blue sofa to be a vintage brown leather
chesterfield, keep everything else the same" as a worked example — and
pricing is low (roughly $0.02–$0.07 per image at 1K resolution,
depending on the model tier), which matters if this is graded/demoed
by more than one person hitting "generate" repeatedly.

OpenAI's `gpt-image-1` edit endpoint is a reasonable alternative and
would be a similar amount of code in a new `lib/providers/openai.ts`
file if you'd rather use that (e.g. if your class/team already has
OpenAI credits).

**Model IDs move fast.** This project is wired against
`gemini-2.5-flash-image`. Before you rely on it, check
https://ai.google.dev/gemini-api/docs/models for the current image
model id and set `GEMINI_IMAGE_MODEL` in `.env.local` if it has changed.

## Getting started

Requires Node.js 18.18+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. With no changes to `.env.local` it runs on
the **mock** provider — no API key needed, so this is enough to try
the whole flow immediately.

### Turning on real AI generation

1. Get a Gemini API key at https://aistudio.google.com/apikey (there's
   a free tier).
2. In `.env.local`:
   ```
   IMAGE_PROVIDER=gemini
   GEMINI_API_KEY=your-key-here
   ```
3. Restart `npm run dev`.

## Project layout

```
app/
  page.tsx              — top-level state machine (upload/configure/generating/result)
  api/generate/route.ts — the one API route; validates input, calls a provider
  globals.css           — palette + fonts (matches the design mockup)
components/
  UploadStep.tsx
  ConfigureStep.tsx
  GeneratingStep.tsx
  ResultStep.tsx         — before/after slider + download
  Stepper.tsx
lib/
  constants.ts           — room types, styles, upload size limit
  prompt.ts               — builds the text instruction sent to the model
  providers/
    types.ts              — the ImageProvider interface every provider implements
    mock.ts                — no-key-needed stand-in
    gemini.ts              — real Gemini image editing call
    index.ts               — picks a provider from IMAGE_PROVIDER
```

## Known limitations / what a real product would still need

This is a prototype, not production. Worth knowing before presenting
it as more than that:

- **No auth, no storage, no rate limiting.** Anyone who can reach the
  app can call `/api/generate` as much as they want. A real version
  needs accounts (or at least a session) and per-user rate limits
  before a real API key is behind it.
- **Uploads go through a JSON API route as base64**, which is simple
  but caps out around single-digit MBs on most serverless hosts
  (Vercel's default function body limit is 4.5MB). A production
  version would upload straight to object storage (S3/R2/GCS) and
  send the API route a reference, not the bytes.
- **No content moderation.** A real product should check uploads (and
  arguably the generated output) before showing or storing them.
- **No persistence.** Nothing is saved server-side; refreshing the
  page loses the result. Worth adding if people should be able to come
  back to past redesigns.
- **Gemini can refuse a request** (safety filters, an image it can't
  parse, etc.) — `lib/providers/gemini.ts` surfaces that as a plain
  error message today; a production UI would want clearer messaging
  for that case.

## Deploying

This is a standard Next.js app, so it deploys as-is to Vercel
(`vercel deploy`) or any host that runs Node.js. Set `IMAGE_PROVIDER`
and `GEMINI_API_KEY` as environment variables on the host — never
commit `.env.local`.

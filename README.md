# Restage — AI room redesign prototype

Upload a photo of a room and walk the full customer journey behind this
project — Discover → Design → Plan → Optimize → Implement — ending with
a priced, shoppable, hireable plan, not just a pretty AI image.

**Design mockup:** https://claude.ai/code/artifact/4819bd0a-cc6c-479e-80b1-c2f7cb9ac9d9
(the original 4-screen flow: upload → room & style → generating → result)

## How it works

The app is a single client-side state machine (`app/page.tsx`) that
walks through all 15 stages of the journey as real screens:

```
Discover
  1-2. UploadStep        — drop/select a photo, read as a data URL
  3.   PurposeStep        — room type + how the room is actually used
  4.   SpaceStep          — dimensions, what to keep/remove, needs

Design
  5.   StyleStep          — pick a design style
  6.   BudgetStep          — total budget + scope (furniture/décor/reno)
  7.   FreePromptStep      — anything else, in the customer's own words
        |
        | POST /api/generate { imageBase64, mimeType, roomType, style,
        |                      purpose, space, freeNote }
        v
  8.   GeneratingStep + ResultStep — the AI redesign, before/after slider,
       plus a "Request changes" box that regenerates in place (stage 9)

Plan
  10.  NeedsStep           — the design broken into furniture/materials/services
  11.  ProductsStep        — each need matched to a mock supplier + price
  12.  CostStep            — itemized estimate, scaled by budget scope

Optimize
  13.  BudgetCheckStep     — budget vs. estimated cost, side by side
  14.  AdjustStep          — swaps in cheaper alternatives if over budget

Implement
  15.  PlanStep            — final buy list, hire list, total, downloadable
```

`app/api/generate/route.ts` is the only server call in the whole flow —
everything else (stages 3-7, 9-15) is client-side, driven by
`lib/planning.ts`, which plays the same role for the planning stages
that `lib/providers/mock.ts` plays for image generation: believable,
deterministic mock data (Thai-baht prices, suppliers, contacts) standing
in for a real catalog/quote API, so the whole journey can be demoed
without needing real supplier integrations.

For the AI step: `app/api/generate/route.ts` builds a text prompt
(`lib/prompt.ts`) from the room type, style, and whatever the customer
filled in during Purpose/Space/Free-prompt, instructing the model to
preserve the room's architecture and only change decor, then calls an
image provider (`lib/providers/*`):

```
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
  page.tsx              — top-level state machine, all 15 journey stages
  api/generate/route.ts — the one API route; validates input, calls a provider
  globals.css           — palette + fonts (matches the design mockup)
components/
  UploadStep.tsx         — stage 1-2
  PurposeStep.tsx         — stage 3
  SpaceStep.tsx           — stage 4
  StyleStep.tsx           — stage 5
  BudgetStep.tsx          — stage 6
  FreePromptStep.tsx      — stage 7, triggers generation
  GeneratingStep.tsx      — stage 8 loading state
  ResultStep.tsx          — stage 8 result + stage 9 request-changes
  NeedsStep.tsx           — stage 10
  ProductsStep.tsx        — stage 11
  CostStep.tsx            — stage 12
  BudgetCheckStep.tsx     — stage 13
  AdjustStep.tsx          — stage 14
  PlanStep.tsx            — stage 15
  PhotoPreview.tsx        — shared uploaded-photo sidebar (stages 3-7)
  Stepper.tsx             — 5-phase progress indicator
lib/
  constants.ts           — room types, styles, upload size limit, space details type
  prompt.ts               — builds the text instruction sent to the model
  planning.ts             — mock catalog/pricing engine for stages 10-15
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

### GitHub Pages (static)

`.github/workflows/deploy-pages.yml` publishes a static export of this
app to GitHub Pages on every push to `main`/`master` (enable it once
under Settings → Pages → Source: GitHub Actions). Stages 1-7 and 9-15
are all client-side, so they work fine on a static export; only the
"Generate my redesign" call to `/api/generate` needs a real server
(it calls Gemini), so the workflow removes `app/api` before building
and that one step will fail with a 404 on the deployed Pages site. Use
Vercel/Node hosting above for a fully working end-to-end demo.

## Pushing this to GitLab

This folder is already a git repo with one commit. To share it:

1. On GitLab, create a new empty project (no README/license, so it
   doesn't conflict with what's already committed here).
2. Point this repo at it and push:
   ```bash
   git remote add origin <your-gitlab-project-url>.git
   git branch -M main
   git push -u origin main
   ```
3. Add teammates/your professor as members on the GitLab project
   (Project → Manage → Members) so they can view or clone it.

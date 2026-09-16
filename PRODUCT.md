# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Renters and homeowners in Thailand/APAC redecorating a single room on a set
budget. They have a real room (not an empty shell) and want to see a
believable redesign, then know what it will actually cost and where to get
it, before they commit to buying anything.

## Product Purpose

DwellWise turns a photo of a room into a redesigned version and a priced,
shoppable, hireable plan to make it real — not just an AI-generated image.
It exists to close the gap between "here's a pretty picture" and "here's
what to buy, from whom, for how much, that fits my budget." Success is a
user walking away with a concrete buy list and hire list scaled to a budget
they set, not just a redecorated photo.

## Positioning

Distinct from plain AI room-generator tools: DwellWise's mechanism is the
full 15-stage journey (Discover → Design → Plan → Optimize → Implement)
that a neighboring "upload a photo, get a redecorated image" tool could not
truthfully copy — the AI image is the midpoint, not the destination. The
output is an itemized, budget-checked, downloadable plan with real
supplier/price data behind it, adjusted automatically when it runs over
budget.

## Operating Context

- Single client-side state machine (`app/page.tsx`) walking all 15 stages
  as real screens; only stage 8 (generate) hits a server route.
- The room-redesign step preserves the room's existing architecture (walls,
  windows, camera angle) and changes only decor — an image-editing task,
  not text-to-image.
- Planning/pricing (stages 10-15) runs against a mock catalog/pricing engine
  (`lib/planning.ts`) standing in for a real supplier/quote API.
- Deployable two ways: full Node/Vercel hosting (real `/api/generate` calls
  Gemini or an n8n-delegated workflow) or a static GitHub Pages export for
  demo purposes, where the API route is stripped and generation 404s.
- Image generation is pluggable (`lib/providers/*`): mock (no key, visibly
  tinted "MOCK PREVIEW" output), Gemini (`gemini-2.5-flash-image`), or n8n
  webhook delegation — one shared interface, swappable via `IMAGE_PROVIDER`.

## Capabilities and Constraints

- Room types: Kitchen, Living room, Bedroom, Bathroom, Home office. Styles:
  Modern, Scandinavian, Industrial, Farmhouse, Minimalist, Traditional.
- Space dimensions are captured in meters; budget scope covers
  furniture/décor/renovation.
- **Thailand/APAC market is a deliberate, durable constraint** — pricing in
  Thai baht and metric units are real product decisions, not placeholder
  mock-data flavor. Future supplier/pricing work should preserve this, not
  default to USD/imperial.
- Known prototype gaps a real launch must close: no auth, no storage, no
  rate limiting on `/api/generate`; uploads are JSON base64 (caps out
  around single-digit MBs on serverless hosts, e.g. Vercel's 4.5MB function
  body limit) rather than direct-to-object-storage; no content moderation
  on uploads or generated output; no server-side persistence (a page
  refresh loses the result); Gemini refusals (safety filters, unparseable
  images) surface today as a plain error message.

## Evidence on Hand

- Design mockup (original 4-screen flow: upload → room & style →
  generating → result):
  https://claude.ai/code/artifact/4819bd0a-cc6c-479e-80b1-c2f7cb9ac9d9
- Mock provider output is intentionally marked "MOCK PREVIEW" so demo runs
  are never mistaken for real AI output.
- No real supplier integrations, testimonials, pricing benchmarks, or
  customer evidence exist yet — the mock catalog (`lib/planning.ts`) is
  believable, deterministic placeholder data standing in for a future real
  catalog/quote API. Do not treat it as validated pricing.

## Product Principles

- Priced and actionable beats pretty: every stage after the AI image
  exists to turn it into a real, budget-checked plan.
- Preserve the room, change the decor: redesigns must read as the same
  room, not a new one.
- Believable mock data everywhere a real integration doesn't exist yet, so
  the full journey stays demoable end-to-end without live dependencies.
- Thailand/APAC pricing and units are product truth, not a mock-data
  accident — keep them when adding real suppliers or currencies.
- Budget is a constraint the plan adapts to (stage 14 swaps in cheaper
  alternatives when over budget), not a number just displayed for
  reference.

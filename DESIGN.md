---
name: DwellWise
description: A hardware-superstore aisle-signage system — photo to priced, shoppable redesign plan.
colors:
  bg: "#f1f1ec"
  surface: "#ffffff"
  surface-2: "#e6e6df"
  ink: "#1e211c"
  ink-soft: "#585c53"
  ink-faint: "#666a5f"
  line: "#d7d7cf"
  line-strong: "#1e211c"
  yellow: "#f5b400"
  yellow-ink: "#1e211c"
  yellow-soft: "#fcecbc"
  green: "#2f7a4d"
  green-soft: "#e3efe5"
  red: "#c1432d"
  red-soft: "#f9e5e0"
typography:
  display:
    fontFamily: "Archivo, Arial Black, sans-serif"
    fontWeight: 900
    letterSpacing: "0.02em"
    lineHeight: 1
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.yellow-ink}"
    rounded: "{rounded.none}"
    padding: "12px 28px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 28px"
  price-tag:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.yellow-ink}"
    typography: "{typography.display}"
  shelf-item-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
---

# Design System: DwellWise

## Overview

**Creative North Star: "Aisle Signage"**

DwellWise reads as a walk down a hardware-superstore aisle — HomePro, ThaiWatsadu signage vocabulary — rather than another glossy before/after AI-photo hero. Every phase of the journey is a numbered department; every priced thing gets a die-cut tag. The system is restrained and daylight-lit: it never goes dark, never goes decorative, and spends its one committed color, safety yellow, only where money or the next action lives.

The one confirmed exception is deliberate: the Design phase (style pick, generated image, before/after result) drops the shelf-tag scaffolding to a quiet wordmark-only header so the generated redesign — the emotional peak of the product — isn't buried under signage chrome. This is a named, built pattern (`AisleHeader`'s `quiet` variant), not drift.

**Key Characteristics:**
- Daylight retail, never dark: warm off-white ground, no dark-mode surface.
- Palette-as-law: yellow (`#f5b400`) appears only on price and primary action.
- Die-cut price tags and barcode-strip shelf rows are the signature units.
- 2px ink borders, flat corners (no radius) everywhere except round dots/scrollbar.
- The aisle-directory header recedes to a quiet bar during the Design department's reveal moments.

## Colors

A warm, daylight warehouse palette: near-white ground and charcoal ink carry everything; yellow is rationed to money and momentum.

### Primary
- **Signage Yellow** (`#f5b400`): the one committed accent. Reserved for price tags, running totals, and the primary (forward-moving) button. Never used decoratively — not on icons, headers, or backgrounds outside those two roles.

### Neutral
- **Warehouse Ground** (`#f1f1ec`): page background. Always light; the system has no dark surface.
- **Surface White** (`#ffffff`): cards, rows, panels sitting on the ground.
- **Surface Dim** (`#e6e6df`): secondary-button hover, subtle recessed fill.
- **Ink** (`#1e211c`): primary text, borders, the "done"/current department states.
- **Ink Soft** (`#585c53`): secondary text, metadata.
- **Ink Faint** (`#666a5f`): tertiary text, upcoming/inactive states.
- **Line** (`#d7d7cf`): hairline dividers, default 1px borders.
- **Line Strong** (`#1e211c`): the header's bottom border and other structural 2px rules (same value as ink).

### State (budget green/red)
- **Budget Green** (`#2f7a4d`) / soft fill (`#e3efe5`): under-budget state only.
- **Budget Red** (`#c1432d`) / soft fill (`#f9e5e0`): over-budget state only.

### Named Rules
**The Palette-as-Law Rule.** Yellow spends itself on price and primary action only. If a new element wants yellow for emphasis or decoration, it doesn't get it — use ink, a border, or weight instead.

**The Budget-State Rule.** Green and red exist solely to carry the budget-check verdict (`BudgetCheckStep`, `ShelfItemRow` strike-price states). They do not double as general-purpose success/error colors elsewhere in the product.

## Typography

**Display Font:** Archivo (weights 500/700/900; with "Arial Black", sans-serif fallback)
**Body Font:** IBM Plex Sans (weights 400/500/600; with system-ui fallback)

**Character:** Archivo Black carries every number and label that needs to read like store signage — aisle numbers, department names, price numerals, button labels, all set uppercase. IBM Plex Sans carries everything a shopper actually reads at length: item names, descriptions, form labels.

### Hierarchy
- **Display** (font-black/900, uppercase, tight tracking): aisle numbers, department headers, price-tag numerals, button labels. Always `font-display` (Archivo).
- **Title** (font-black, ~15–18px): section headers within a step (e.g. shelf-row prices, screen titles).
- **Body** (400–500, 14–16px): item names, form copy, descriptions. `font-body` (IBM Plex Sans).
- **Label** (400–500, 11–13px, uppercase, wide tracking): department names, metadata, price notes, aisle sub-labels.

### Named Rules
**The Signage-Face Rule.** Archivo Black is reserved for things the world would actually print on a sign or a tag — numbers, department names, CTAs. Body copy never uses it; using the display face for prose collapses the aisle/shopper distinction the system depends on.

## Layout

Single max-width shell (`1440px`), centered, with consistent horizontal gutters (`32px` mobile → `64px` at `sm:` and up). Screens stack as vertical flow inside this shell; no sidebar or split-pane chrome. The `AisleHeader` is mounted once by `app/page.tsx` and shared across all 8 screens rather than duplicated per step, keeping the department numbering in one place.

Spacing follows a loose 4px-rooted rhythm reused throughout: `8px`/`12px`/`16px` for internal component gaps, `32px` for section padding, `64px` for page gutters. Related stages consolidate onto single screens (room type + purpose + space share `RoomDetailsStep`) rather than one stage per screen, per the product's 15-stage journey compressed into 8 built screens.

## Elevation & Depth

Mostly flat: cards and rows sit directly on the warehouse ground with a 2px ink border doing the separation work, not a shadow. Two shadow tokens exist and are used narrowly, not as general-purpose card elevation:

### Shadow Vocabulary
- **`shadow-tag`** (`0 2px 0 0 var(--line-strong)`): a hard, flat offset — not a blur — under the primary button and price tags. It is the "tactile press" device: on `:active` the element translates down 2px and the shadow disappears, simulating a physical press into the signage board. This hard-offset shadow is native to this world (the CD-ROM-console tactile-press reference named in the direction contract) and is scoped to interactive, price-bearing elements only.
- **`shadow-card`** (`0 14px 30px -18px rgb(30 33 28 / 0.28)`): a soft, diffuse ambient shadow used once, under the `GeneratingStep` card — the one moment the system lifts a surface off the ground rather than bordering it flat.

### Named Rules
**The Flat-by-Default Rule.** Borders carry separation everywhere; shadow is reserved for the tactile-press interaction (`shadow-tag`) and the single ambient-lift moment (`shadow-card`). Don't reach for a new box-shadow to add depth to an ordinary card or row.

## Shapes

No corner radius anywhere except perfect circles (status dots, scrollbar thumb) and the die-cut clip-path notches on `PriceTag` and the wordmark mark. Everything else is hard-edged. The dominant border is a 2px ink rule (`border-2 border-ink` / `border-line-strong`) on cards, buttons, inputs, and the header's bottom edge; a 1px `border-line` hairline is used for lower-emphasis dividers like shelf-row borders. `PriceTag` and the wordmark icon use an angled `clip-path` polygon (a die-cut notch with a punched circular "hole") as the system's one recurring non-rectangular silhouette.

## Components

### Buttons
- **Shape:** square corners, 2px ink border, `min-h-[52px]`.
- **Primary** (`primaryButton` in `components/buttons.ts`): yellow background, yellow-ink text, uppercase Archivo, `shadow-tag` tactile press on active. The single forward action a screen owns.
- **Secondary** (`secondaryButton`): white/surface background, ink text, same border and sizing, no shadow — a plain 1px active-state nudge instead of the tactile press.
- **Text link** (`textLink`): ink-soft, underline on hover only. Used for tertiary/skip actions, never for a primary CTA.

### Price Tag (signature component)
Die-cut yellow tag (`components/PriceTag.tsx`) with an angled clip-path notch and a punched circular hole, set in tabular Archivo Black. Reserved for hero amounts — budget entry, running totals, the final price — never for ordinary line-item prices, which stay plain tabular numerals in body rows. Three tones: `price` (yellow, the default), `under` (green-soft/green), `over` (red-soft/red) for budget-check states.

### Shelf Item Row (signature component)
`components/ShelfItemRow.tsx`: a SKU shelf-tag row with a repeating barcode-strip left edge (2px ink border, white surface). The system's item marker wherever the plan lists a real, priced thing — shopping list, budget swap panel, buy/hire lists. Supports a muted (55% opacity) state and an optional strike-through price for swapped items.

### Aisle-Directory Header (signature component)
`components/AisleHeader.tsx`, mounted once and shared by every screen. Full mode: wordmark + five-department nav strip (current department inverted ink-on-yellow-border) + an aisle number/title/stage-count sub-bar, all under a 2px `border-line-strong` rule. **Quiet variant** (`quiet` prop): collapses to a 1px-bordered wordmark-only bar with a small department·title label, used only for the Design department's three reveal screens (`designBrief`, `generating`, `result`) so the generated image — not the signage system — reads as the reward.

### Inputs / Fields
- **Style:** 2px ink border, square corners, white surface, no radius.
- **Focus:** system-wide `:focus-visible` outline (2.5px solid ink, 2px offset) rather than a per-input glow or color shift.

### Navigation
The department nav inside `AisleHeader` is the system's only navigation: five departments rendered as numbered blocks (`01`–`05`), current department inverted (ink background, yellow bottom border), done departments ink-bordered, upcoming departments faint with no border. Desktop-only (`hidden md:flex`); mobile carries the aisle-number/title sub-bar instead.

## Do's and Don'ts

### Do:
- **Do** reserve yellow (`#f5b400`) for price and primary action only — the Palette-as-Law Rule.
- **Do** use 2px ink borders and square corners as the default separation and shape language; reach for `shadow-tag`'s hard offset only on tactile, price-bearing controls (buttons, tags).
- **Do** keep the Design department's three reveal screens on the quiet `AisleHeader` variant so the generated image stays the visual peak.
- **Do** set aisle numbers, department names, and price numerals in Archivo Black, uppercase; keep body copy in IBM Plex Sans.

### Don't:
- **Don't** add rounded corners; the system has none except circular dots/holes and the die-cut clip-path notch.
- **Don't** spend green/red outside the budget-check verdict — they are not general success/error colors.
- **Don't** add a new box-shadow for ordinary card elevation; borders carry depth, and the two existing shadow tokens are each scoped to one specific moment (tactile press, single ambient lift).
- **Don't** apply the display face (Archivo Black) to body prose — it's reserved for signage-register text (numbers, labels, CTAs).

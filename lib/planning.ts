import type { RoomType } from "@/lib/constants";

/**
 * Everything downstream of "AI generates a design" — turning that image
 * into a buy list, a rough cost, and a plan that fits the customer's
 * budget. There's no real supplier network behind this yet, so — same
 * spirit as lib/providers/mock.ts for image generation — this file is a
 * believable, deterministic stand-in: real prices in Thai baht, a real
 * shape for the data, swappable for a real catalog/quote API later.
 */

export const BUDGET_SCOPES = [
  "Furniture only",
  "Furniture & décor",
  "Full renovation",
] as const;
export type BudgetScope = (typeof BUDGET_SCOPES)[number];

// Full renovation pulls in labor and fixed installation work that
// "furniture only" doesn't, so the same catalog subtotal scales up.
export const SCOPE_MULTIPLIER: Record<BudgetScope, number> = {
  "Furniture only": 1,
  "Furniture & décor": 1.15,
  "Full renovation": 1.4,
};

export type NeedCategory = "Furniture" | "Materials" | "Services";

export interface CatalogItem {
  id: string;
  category: NeedCategory;
  name: string;
  reason: string;
  supplier: string;
  contact: string;
  price: number;
  budgetPrice: number;
}

// One curated catalog per room type. Kept small and readable rather
// than exhaustive — this is a prototype, not a real supplier feed.
export const CATALOG_BY_ROOM: Record<RoomType, CatalogItem[]> = {
  Kitchen: [
    {
      id: "kitchen-island",
      category: "Furniture",
      name: "Kitchen island",
      reason: "Adds prep space and ties the new layout together.",
      supplier: "Index Living Mall",
      contact: "sales@indexlivingmall.example",
      price: 18500,
      budgetPrice: 9900,
    },
    {
      id: "bar-stools",
      category: "Furniture",
      name: "Counter stools (x2)",
      reason: "Seating at the island for quick meals.",
      supplier: "SB Furniture",
      contact: "orders@sbfurniture.example",
      price: 4200,
      budgetPrice: 2100,
    },
    {
      id: "backsplash-tile",
      category: "Materials",
      name: "Backsplash tile",
      reason: "The finish behind the counter the design calls for.",
      supplier: "Boonthavorn Tile",
      contact: "quote@boonthavorn.example",
      price: 6800,
      budgetPrice: 3500,
    },
    {
      id: "pendant-lighting",
      category: "Materials",
      name: "Pendant lighting",
      reason: "The light fixtures shown over the island.",
      supplier: "HomePro Lighting",
      contact: "lighting@homepro.example",
      price: 5200,
      budgetPrice: 2600,
    },
    {
      id: "kitchen-install",
      category: "Services",
      name: "Installation & fitting",
      reason: "A tradesperson to fit the island, tile, and lighting.",
      supplier: "Local contractor network",
      contact: "book@fixdee.example",
      price: 12000,
      budgetPrice: 7500,
    },
  ],
  "Living room": [
    {
      id: "sofa",
      category: "Furniture",
      name: "3-seat sofa",
      reason: "The anchor piece the new layout is built around.",
      supplier: "Index Living Mall",
      contact: "sales@indexlivingmall.example",
      price: 32000,
      budgetPrice: 16500,
    },
    {
      id: "coffee-table",
      category: "Furniture",
      name: "Coffee table",
      reason: "Completes the seating arrangement.",
      supplier: "SB Furniture",
      contact: "orders@sbfurniture.example",
      price: 7500,
      budgetPrice: 3900,
    },
    {
      id: "area-rug",
      category: "Materials",
      name: "Area rug",
      reason: "Grounds the furniture and adds the design's texture.",
      supplier: "Boonthavorn Home",
      contact: "quote@boonthavorn.example",
      price: 5600,
      budgetPrice: 2800,
    },
    {
      id: "wall-paint",
      category: "Materials",
      name: "Wall paint",
      reason: "The wall color shown in the redesign.",
      supplier: "TOA Paint",
      contact: "orders@toa.example",
      price: 3200,
      budgetPrice: 1900,
    },
    {
      id: "living-painter",
      category: "Services",
      name: "Painter",
      reason: "A painter to repaint the walls to match.",
      supplier: "Local contractor network",
      contact: "book@fixdee.example",
      price: 6000,
      budgetPrice: 3800,
    },
  ],
  Bedroom: [
    {
      id: "bed-frame",
      category: "Furniture",
      name: "Bed frame",
      reason: "The centerpiece the rest of the room is styled around.",
      supplier: "Index Living Mall",
      contact: "sales@indexlivingmall.example",
      price: 15000,
      budgetPrice: 7900,
    },
    {
      id: "wardrobe",
      category: "Furniture",
      name: "Wardrobe",
      reason: "Storage matching the new style.",
      supplier: "SB Furniture",
      contact: "orders@sbfurniture.example",
      price: 18000,
      budgetPrice: 9500,
    },
    {
      id: "curtains",
      category: "Materials",
      name: "Curtains",
      reason: "The window treatment shown in the design.",
      supplier: "Boonthavorn Home",
      contact: "quote@boonthavorn.example",
      price: 3400,
      budgetPrice: 1700,
    },
    {
      id: "bedside-lamps",
      category: "Materials",
      name: "Bedside lamps (x2)",
      reason: "Lighting fixtures shown either side of the bed.",
      supplier: "HomePro Lighting",
      contact: "lighting@homepro.example",
      price: 2600,
      budgetPrice: 1300,
    },
    {
      id: "bedroom-assembly",
      category: "Services",
      name: "Furniture assembly",
      reason: "Assembly and placement for the bed and wardrobe.",
      supplier: "Local contractor network",
      contact: "book@fixdee.example",
      price: 3500,
      budgetPrice: 2200,
    },
  ],
  Bathroom: [
    {
      id: "vanity-cabinet",
      category: "Furniture",
      name: "Vanity cabinet",
      reason: "Replaces the existing sink cabinet with the new look.",
      supplier: "HomePro",
      contact: "sales@homepro.example",
      price: 14500,
      budgetPrice: 7200,
    },
    {
      id: "bathroom-mirror",
      category: "Furniture",
      name: "Mirror",
      reason: "The mirror shown above the vanity.",
      supplier: "HomePro",
      contact: "sales@homepro.example",
      price: 3800,
      budgetPrice: 1900,
    },
    {
      id: "floor-tile",
      category: "Materials",
      name: "Floor tile",
      reason: "The flooring finish the design calls for.",
      supplier: "Boonthavorn Tile",
      contact: "quote@boonthavorn.example",
      price: 8200,
      budgetPrice: 4500,
    },
    {
      id: "bathroom-fixtures",
      category: "Materials",
      name: "Tap & showerhead set",
      reason: "Fixture finish to match the new palette.",
      supplier: "HomePro",
      contact: "sales@homepro.example",
      price: 5500,
      budgetPrice: 2900,
    },
    {
      id: "plumber",
      category: "Services",
      name: "Plumber",
      reason: "Fits the vanity, tile, and fixtures.",
      supplier: "Local contractor network",
      contact: "book@fixdee.example",
      price: 9000,
      budgetPrice: 5500,
    },
  ],
  "Home office": [
    {
      id: "desk",
      category: "Furniture",
      name: "Desk",
      reason: "The work surface the layout is built around.",
      supplier: "SB Furniture",
      contact: "orders@sbfurniture.example",
      price: 9500,
      budgetPrice: 4800,
    },
    {
      id: "office-chair",
      category: "Furniture",
      name: "Ergonomic chair",
      reason: "Seating matching the new setup.",
      supplier: "SB Furniture",
      contact: "orders@sbfurniture.example",
      price: 11000,
      budgetPrice: 5500,
    },
    {
      id: "shelving",
      category: "Furniture",
      name: "Shelving unit",
      reason: "Storage shown behind the desk.",
      supplier: "Index Living Mall",
      contact: "sales@indexlivingmall.example",
      price: 6200,
      budgetPrice: 3100,
    },
    {
      id: "task-lighting",
      category: "Materials",
      name: "Task lighting",
      reason: "Desk lamp matching the design's lighting.",
      supplier: "HomePro Lighting",
      contact: "lighting@homepro.example",
      price: 2400,
      budgetPrice: 1200,
    },
    {
      id: "office-setup",
      category: "Services",
      name: "Cable management & setup",
      reason: "Someone to assemble and wire everything in.",
      supplier: "Local contractor network",
      contact: "book@fixdee.example",
      price: 2000,
      budgetPrice: 1200,
    },
  ],
};

export function estimateCost(items: CatalogItem[], scope: BudgetScope): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return Math.round(subtotal * SCOPE_MULTIPLIER[scope]);
}

export interface BudgetCheckResult {
  overBudget: boolean;
  gap: number; // positive = over budget, negative = under budget
}

export function checkBudget(cost: number, budget: number): BudgetCheckResult {
  const gap = cost - budget;
  return { overBudget: gap > 0, gap };
}

export interface AdjustmentResult {
  items: CatalogItem[];
  swappedIds: string[];
  newTotal: number;
}

/**
 * Swaps the priciest items for their budget-tier alternative, one at a
 * time, until the total (scaled by scope) is at or under the target —
 * or every item has been swapped, whichever comes first.
 */
export function adjustToBudget(
  items: CatalogItem[],
  scope: BudgetScope,
  targetBudget: number,
): AdjustmentResult {
  const working = [...items].sort((a, b) => b.price - a.price);
  const swappedIds: string[] = [];
  const adjusted = new Map(items.map((item) => [item.id, item]));

  for (const item of working) {
    const currentTotal = estimateCost([...adjusted.values()], scope);
    if (currentTotal <= targetBudget) break;
    adjusted.set(item.id, { ...item, price: item.budgetPrice });
    swappedIds.push(item.id);
  }

  const finalItems = items.map((item) => adjusted.get(item.id) ?? item);
  return {
    items: finalItems,
    swappedIds,
    newTotal: estimateCost(finalItems, scope),
  };
}

export function formatBaht(amount: number): string {
  return `฿${Math.round(amount).toLocaleString("en-US")}`;
}

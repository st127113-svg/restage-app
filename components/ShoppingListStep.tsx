"use client";

import type { RoomType } from "@/lib/constants";
import type { SuggestedProduct } from "@/lib/providers";
import {
  CATALOG_BY_ROOM,
  estimateCost,
  formatBaht,
  SCOPE_MULTIPLIER,
  type BudgetScope,
  type CatalogItem,
  type NeedCategory,
} from "@/lib/planning";
import { PriceTag } from "./PriceTag";
import { ShelfItemRow } from "./ShelfItemRow";
import { primaryButton, textLink } from "./buttons";

const CATEGORY_ORDER: NeedCategory[] = ["Furniture", "Materials", "Services"];

// suggestedProducts come back as free text like "Round natural jute rug
// (Textile)" -- pull the parenthesized hint out and fold it onto our
// three-category shelf so real matches slot into the same layout the
// mock catalog used.
function inferCategory(item: string): NeedCategory {
  const hint = item.match(/\(([^)]+)\)\s*$/)?.[1]?.toLowerCase() ?? "";
  if (hint.includes("service") || hint.includes("labor") || hint.includes("install")) {
    return "Services";
  }
  if (hint.includes("furniture")) return "Furniture";
  return "Materials";
}

// Turn a real, matched product from the search tool into the same shape
// the rest of this screen (and the budget-check step after it) already
// knows how to render and total up.
function toCatalogItem(product: SuggestedProduct, index: number): CatalogItem {
  const price = product.price ?? 0;
  return {
    id: `matched-${index}`,
    category: inferCategory(product.item),
    name: product.name ?? product.item,
    reason: product.reason ?? product.item,
    supplier: "Shopee",
    contact: product.productUrl ?? "shopee.co.th",
    price,
    // No real budget-tier price for an actual matched product yet, so
    // there's nothing cheaper to swap it for -- keep it at full price.
    budgetPrice: price,
  };
}

export function ShoppingListStep({
  roomType,
  scope,
  selected,
  suggestedProducts = [],
  onToggle,
  onBack,
  onContinue,
}: {
  roomType: RoomType;
  scope: BudgetScope;
  selected: Record<string, boolean>;
  suggestedProducts?: SuggestedProduct[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onContinue: (selectedItems: CatalogItem[]) => void;
}) {
  const matchedProducts = suggestedProducts.filter((p) => p.matched);
  const hasRealMatches = matchedProducts.length > 0;
  const items = hasRealMatches
    ? matchedProducts.map((p, i) => toCatalogItem(p, i))
    : CATALOG_BY_ROOM[roomType];
  const selectedItems = items.filter((item) => selected[item.id] ?? true);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const total = estimateCost(selectedItems, scope);
  const multiplier = SCOPE_MULTIPLIER[scope];

  return (
    <div className="mx-auto flex w-full max-w-[840px] flex-1 flex-col gap-8 px-8 py-10 sm:px-16">
      <div>
        <h1 className="mb-2.5 font-display text-[28px] font-black text-ink">Shopping list &amp; cost</h1>
        <p className="max-w-[56ch] text-[15px] text-ink-soft">
          Everything this design needs, matched to real suppliers and prices.
          Uncheck anything you already have or want to source yourself.
        </p>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const inCategory = items.filter((item) => item.category === category);
        if (inCategory.length === 0) return null;
        return (
          <div key={category} className="flex flex-col gap-2.5">
            <h2 className="font-display text-base font-bold text-ink">{category}</h2>
            {inCategory.map((item) => {
              const checked = selected[item.id] ?? true;
              const buyUrl = hasRealMatches ? item.contact : undefined;
              return (
                <label key={item.id} className="cursor-pointer">
                  <ShelfItemRow
                    name={item.name}
                    meta={item.reason}
                    price={formatBaht(item.price)}
                    priceNote={
                      buyUrl ? (
                        <a
                          href={buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-ink underline-offset-4 hover:underline"
                        >
                          Buy on Shopee &rarr;
                        </a>
                      ) : (
                        `${item.supplier} · ${item.contact}`
                      )
                    }
                    muted={!checked}
                    checkbox={
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(item.id)}
                        className="h-[18px] w-[18px] shrink-0 accent-[var(--ink)]"
                      />
                    }
                  />
                </label>
              );
            })}
          </div>
        );
      })}

      {hasRealMatches && suggestedProducts.some((p) => !p.matched) && (
        <p className="text-[12px] text-ink-faint">
          Couldn&apos;t find a real product match for:{" "}
          {suggestedProducts.filter((p) => !p.matched).map((p) => p.item).join(", ")}.
        </p>
      )}

      <div className="flex flex-col gap-2 border-2 border-ink bg-surface p-6">
        <div className="flex items-center justify-between text-[15px]">
          <span className="text-ink-soft">Subtotal ({selectedItems.length} item{selectedItems.length === 1 ? "" : "s"})</span>
          <span className="tabular text-ink-soft">{formatBaht(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[15px]">
          <span className="text-ink-soft">
            {scope} adjustment ({multiplier === 1 ? "no change" : `×${multiplier}`})
          </span>
          <span className="tabular text-ink-soft">{formatBaht(total - subtotal)}</span>
        </div>
        <div className="my-2 h-0.5 bg-ink" />
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-ink">Total estimate</span>
          <PriceTag size="md">{formatBaht(total)}</PriceTag>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button onClick={() => onContinue(selectedItems)} className={primaryButton}>
          Check against my budget
        </button>
        <button onClick={onBack} className={textLink}>
          Back to design
        </button>
      </div>
    </div>
  );
}

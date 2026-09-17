"use client";

import { useState } from "react";
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

function inferCategory(item: string): NeedCategory {
  const hint = item.match(/\(([^)]+)\)\s*$/)?.[1]?.toLowerCase() ?? "";
  if (hint.includes("service") || hint.includes("labor") || hint.includes("install")) {
    return "Services";
  }
  if (hint.includes("furniture")) return "Furniture";
  return "Materials";
}

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
  const [openProductId, setOpenProductId] = useState<string | null>(null);
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
          Tap an item to view its details and purchase it.
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
              const isMatched = hasRealMatches;
              const source = isMatched
                ? matchedProducts.find((p, i) => `matched-${i}` === item.id)
                : undefined;
              const isOpen = openProductId === item.id;
              const buyUrl = source?.productUrl;

              return (
                <div key={item.id} className="border border-line bg-surface">
                  <div className="flex items-stretch">
                    <label className="flex min-w-0 flex-1 cursor-pointer">
                      <ShelfItemRow
                        name={item.name}
                        meta={item.reason}
                        price={formatBaht(item.price)}
                        priceNote={
                          isMatched
                            ? "Tap for product details"
                            : `${item.supplier} · ${item.contact}`
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
                    {isMatched && (
                      <button
                        type="button"
                        onClick={() => setOpenProductId(isOpen ? null : item.id)}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Hide" : "Show"} ${item.name} details`}
                        className="flex w-12 shrink-0 items-center justify-center border-l border-line font-display text-lg text-ink hover:bg-yellow-soft"
                      >
                        {isOpen ? "−" : "+"}
                      </button>
                    )}
                  </div>

                  {isMatched && isOpen && (
                    <div className="border-t border-line bg-bg p-4 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        {source?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={source.image}
                            alt={source.name ?? source.item}
                            className="h-32 w-full shrink-0 object-cover sm:w-40"
                          />
                        ) : (
                          <div className="flex h-32 w-full shrink-0 items-center justify-center border border-line bg-yellow-soft px-4 text-center text-[11px] uppercase tracking-wide text-ink-faint sm:w-40">
                            Product image unavailable
                          </div>
                        )}
                        <div className="flex flex-1 flex-col justify-between gap-4">
                          <div>
                            <div className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                              Matched product
                            </div>
                            <div className="mt-1 font-display text-base font-bold text-ink">
                              {source?.name ?? item.name}
                            </div>
                            {source?.reason && (
                              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                                {source.reason}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="text-[11px] uppercase tracking-wide text-ink-faint">Price</div>
                              <div className="font-display text-xl font-black text-ink">
                                {source?.price != null
                                  ? source.currency && source.currency !== "THB"
                                    ? `${source.currency} ${source.price}`
                                    : formatBaht(source.price)
                                  : formatBaht(item.price)}
                              </div>
                            </div>
                            {buyUrl ? (
                              <a
                                href={buyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${primaryButton} shrink-0`}
                              >
                                Buy this product
                                <span aria-hidden="true">-&gt;</span>
                              </a>
                            ) : (
                              <span className="text-[12px] uppercase tracking-wide text-ink-faint">
                                Purchase link unavailable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

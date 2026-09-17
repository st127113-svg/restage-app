"use client";

import { useEffect, useMemo, useState } from "react";
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
import { BudgetCheckStep } from "./BudgetCheckStep";
import { PriceTag } from "./PriceTag";
import { primaryButton, secondaryButton, textLink } from "./buttons";

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
    supplier: "Supplier",
    contact: product.productUrl ?? "",
    price,
    budgetPrice: price,
  };
}

export function ResultStep({
  beforeImage,
  afterImage,
  roomType,
  style,
  budget,
  budgetScope,
  suggestedProducts = [],
  isRefining,
  refineError,
  onRefine,
  onTryAnotherStyle,
  onStartOver,
  onContinue,
}: {
  beforeImage: string;
  afterImage: string;
  roomType: string;
  style: string;
  budget: number;
  budgetScope: BudgetScope;
  suggestedProducts?: SuggestedProduct[];
  isRefining: boolean;
  refineError: string | null;
  onRefine: (note: string) => void;
  onTryAnotherStyle: () => void;
  onStartOver: () => void;
  onContinue: (items: CatalogItem[]) => void;
}) {
  const [showModify, setShowModify] = useState(false);
  const [note, setNote] = useState("");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showBudgetCheck, setShowBudgetCheck] = useState(false);

  const matchedProducts = suggestedProducts.filter((p) => p.matched);
  const hasRealMatches = matchedProducts.length > 0;
  const items = hasRealMatches
    ? matchedProducts.map((p, i) => toCatalogItem(p, i))
    : CATALOG_BY_ROOM[roomType as RoomType];

  useEffect(() => {
    setSelected((prev) => {
      const next: Record<string, boolean> = {};
      for (const item of items) next[item.id] = prev[item.id] ?? true;
      return next;
    });
    setExpandedProductId(null);
  }, [items]);

  const selectedItems = items.filter((item) => selected[item.id] ?? true);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const total = estimateCost(selectedItems, budgetScope);
  const multiplier = SCOPE_MULTIPLIER[budgetScope];

  const realProductById = useMemo(() => {
    if (!hasRealMatches) return new Map<string, SuggestedProduct>();
    return new Map(matchedProducts.map((product, index) => [`matched-${index}`, product]));
  }, [hasRealMatches, matchedProducts]);

  function toggleProduct(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-8 pb-14 pt-8 sm:px-16">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="mb-2.5 font-display text-[30px] font-black text-ink">
            Your {roomType.toLowerCase()}, restyled.
          </h1>
          <div className="flex gap-2">
            <span className="flex h-8 items-center border border-ink px-3.5 text-[13px] font-medium uppercase tracking-wide text-ink">
              {roomType}
            </span>
            <span className="flex h-8 items-center border border-ink px-3.5 text-[13px] font-medium uppercase tracking-wide text-ink">
              {style}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0.5 border-2 border-ink bg-ink sm:grid-cols-2">
        <div className="bg-surface">
          <div className="px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-ink-soft">
            Before
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeImage} alt="Before" className="block aspect-[4/3] w-full object-cover" />
        </div>
        <div className="bg-surface">
          <div className="px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-ink-soft">
            After
          </div>
          <div className="reveal-wipe overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterImage} alt="After" className="block aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <a href={afterImage} download="dwellwise-result.png" className={secondaryButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v13m0 0 4-4m-4 4-4-4" />
              <path d="M5 20h14" />
            </svg>
            Download image
          </a>
          <button onClick={() => setShowModify((v) => !v)} className={secondaryButton}>
            {showModify ? "Hide changes" : "Request changes"}
          </button>
          <button onClick={onTryAnotherStyle} className={secondaryButton}>
            Try another style
          </button>
        </div>
        <button onClick={onStartOver} className={textLink}>
          Start over
        </button>
      </div>

      {showModify && (
        <div className="flex w-full flex-col gap-3 border-2 border-line bg-surface p-6">
          <div className="text-sm font-medium text-ink">
            Request changes — color, style, mood, specific items
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. warmer wood tones, swap the rug for something lighter"
            rows={2}
            className="w-full border border-line bg-bg p-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          {refineError && <p className="text-sm text-red">{refineError}</p>}
          <button
            onClick={() => onRefine(note)}
            disabled={isRefining || !note.trim()}
            className={`${secondaryButton} w-fit px-5 text-[13px] disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {isRefining ? "Regenerating…" : "Regenerate with these changes"}
          </button>
        </div>
      )}

      <section className="flex w-full flex-col gap-5 border-t-2 border-line-strong pt-8">
        <div>
          <h2 className="mb-2.5 font-display text-[28px] font-black text-ink">Shopping list &amp; cost</h2>
          <p className="max-w-[68ch] text-[15px] text-ink-soft">
            Everything this design needs, matched to real suppliers and prices. Tap an item to view its details and purchase it.
          </p>
        </div>

        {CATEGORY_ORDER.map((category) => {
          const inCategory = items.filter((item) => item.category === category);
          if (inCategory.length === 0) return null;
          return (
            <div key={category} className="flex flex-col gap-2.5">
              <h3 className="font-display text-base font-bold text-ink">{category}</h3>
              {inCategory.map((item) => {
                const checked = selected[item.id] ?? true;
                const product = realProductById.get(item.id);
                const expanded = expandedProductId === item.id;

                return (
                  <div key={item.id} className="border border-line bg-surface">
                    <div className="grid grid-cols-[auto_1fr_auto_auto] items-stretch">
                      <label className="flex items-center px-3 sm:px-4" aria-label={`Select ${item.name}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProduct(item.id)}
                          className="h-[18px] w-[18px] shrink-0 accent-[var(--ink)]"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setExpandedProductId(expanded ? null : item.id)}
                        aria-expanded={expanded}
                        className="min-w-0 border-l border-line px-3 py-4 text-left sm:px-4"
                      >
                        <div className={`font-medium text-ink ${checked ? "" : "opacity-50"}`}>{item.name}</div>
                        <div className={`mt-1 text-sm leading-relaxed text-ink-soft ${checked ? "" : "opacity-50"}`}>{item.reason}</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedProductId(expanded ? null : item.id)}
                        aria-label={expanded ? `Hide ${item.name} details` : `Show ${item.name} details`}
                        className="border-l border-line px-4 text-sm text-ink-soft"
                      >
                        {expanded ? "−" : "+"}
                      </button>

                      <div className="flex min-w-[108px] items-center justify-end border-l border-line px-4 text-right">
                        <PriceTag size="sm">{formatBaht(item.price)}</PriceTag>
                      </div>
                    </div>

                    {expanded && (
                      <div className="border-t border-line bg-bg p-4 sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row">
                          {product?.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt={item.name}
                              className="h-32 w-32 shrink-0 border border-line bg-surface object-cover"
                            />
                          )}
                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="font-display text-base font-bold text-ink">{item.name}</div>
                            <p className="text-sm leading-relaxed text-ink-soft">{item.reason}</p>
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <PriceTag size="sm">{formatBaht(item.price)}</PriceTag>
                              {product?.productUrl ? (
                                <a
                                  href={product.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={primaryButton}
                                >
                                  Buy this product
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-xs uppercase tracking-wide text-ink-faint">Purchase link unavailable</span>
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
              {budgetScope} adjustment ({multiplier === 1 ? "no change" : `×${multiplier}`})
            </span>
            <span className="tabular text-ink-soft">{formatBaht(total - subtotal)}</span>
          </div>
          <div className="my-2 h-0.5 bg-ink" />
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-ink">Total estimate</span>
            <PriceTag size="md">{formatBaht(total)}</PriceTag>
          </div>
        </div>

        {!showBudgetCheck && (
          <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t-2 border-line-strong pt-6">
            <p className="max-w-[60ch] text-[13px] text-ink-faint">
              AI-generated preview, for inspiration only — not a guarantee of exact final results.
            </p>
            <button onClick={() => setShowBudgetCheck(true)} className={`${primaryButton} shrink-0`}>
              Check against my budget
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}

        {showBudgetCheck && (
          <BudgetCheckStep
            items={selectedItems}
            scope={budgetScope}
            total={total}
            budget={budget}
            onBack={() => setShowBudgetCheck(false)}
            onAccept={(result) => onContinue(result.items)}
            onContinue={() => onContinue(selectedItems)}
          />
        )}
      </section>
    </div>
  );
}

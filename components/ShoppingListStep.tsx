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
  const items = CATALOG_BY_ROOM[roomType];
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

      {suggestedProducts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-base font-bold text-ink">Matched on Lazada</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {suggestedProducts
              .filter((p) => p.matched)
              .map((p, i) => (
                <a
                  key={`${p.item}-${i}`}
                  href={p.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 border-2 border-line bg-surface p-3 transition-colors hover:border-ink"
                >
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name ?? p.item} className="h-20 w-20 shrink-0 object-cover" />
                  )}
                  <div className="flex flex-1 flex-col justify-between gap-1">
                    <div>
                      <div className="text-[12px] text-ink-faint">{p.item}</div>
                      <div className="text-[14px] font-medium leading-snug text-ink">{p.name}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base tabular text-ink">
                        {typeof p.price === "number" ? formatBaht(p.price) : "—"}
                      </span>
                      <span className="text-[12px] font-medium text-ink underline-offset-4 hover:underline">
                        View on Lazada &rarr;
                      </span>
                    </div>
                  </div>
                </a>
              ))}
          </div>
          {suggestedProducts.some((p) => !p.matched) && (
            <p className="text-[12px] text-ink-faint">
              No real product match found for:{" "}
              {suggestedProducts.filter((p) => !p.matched).map((p) => p.item).join(", ")}.
            </p>
          )}
        </div>
      )}

      {CATEGORY_ORDER.map((category) => {
        const inCategory = items.filter((item) => item.category === category);
        if (inCategory.length === 0) return null;
        return (
          <div key={category} className="flex flex-col gap-2.5">
            <h2 className="font-display text-base font-bold text-ink">{category}</h2>
            {inCategory.map((item) => {
              const checked = selected[item.id] ?? true;
              return (
                <label key={item.id} className="cursor-pointer">
                  <ShelfItemRow
                    name={item.name}
                    meta={item.reason}
                    price={formatBaht(item.price)}
                    priceNote={`${item.supplier} · ${item.contact}`}
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

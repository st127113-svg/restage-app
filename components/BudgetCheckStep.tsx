"use client";

import { useMemo, useState } from "react";
import {
  adjustToBudget,
  checkBudget,
  formatBaht,
  type AdjustmentResult,
  type BudgetScope,
  type CatalogItem,
} from "@/lib/planning";
import { PriceTag } from "./PriceTag";
import { ShelfItemRow } from "./ShelfItemRow";
import { primaryButton, secondaryButton, textLink } from "./buttons";

export function BudgetCheckStep({
  items,
  scope,
  total,
  budget,
  onBack,
  onAccept,
  onContinue,
}: {
  items: CatalogItem[];
  scope: BudgetScope;
  total: number;
  budget: number;
  onBack: () => void;
  onAccept: (result: AdjustmentResult) => void;
  onContinue: () => void;
}) {
  const [showAdjust, setShowAdjust] = useState(false);
  const { overBudget, gap } = checkBudget(total, budget);
  const result = useMemo(() => adjustToBudget(items, scope, budget), [items, scope, budget]);
  const swapped = items.filter((item) => result.swappedIds.includes(item.id));

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-8 px-8 py-10 sm:px-16">
      <div>
        <h1 className="mb-2.5 font-display text-[28px] font-black text-ink">Budget check</h1>
        <p className="max-w-[56ch] text-[15px] text-ink-soft">
          Your plan, side by side with what you told us you wanted to spend.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0.5 border-2 border-ink bg-ink sm:grid-cols-2">
        <div className="bg-surface p-6">
          <div className="mb-2 text-[13px] uppercase tracking-wide text-ink-soft">Your budget</div>
          <PriceTag size="lg">{formatBaht(budget)}</PriceTag>
        </div>
        <div className="bg-surface p-6">
          <div className="mb-2 text-[13px] uppercase tracking-wide text-ink-soft">Estimated cost</div>
          <PriceTag size="lg" tone={overBudget ? "over" : "under"}>
            {formatBaht(total)}
          </PriceTag>
        </div>
      </div>

      <div
        className={
          "border-2 px-5 py-4 text-[15px] font-medium " +
          (overBudget ? "border-red bg-red-soft text-ink" : "border-green bg-green-soft text-ink")
        }
      >
        {overBudget
          ? `You're ${formatBaht(gap)} over budget right now.`
          : `You're ${formatBaht(Math.abs(gap))} under budget — nice.`}
      </div>

      {overBudget && showAdjust && (
        <div className="flex flex-col gap-5 border-2 border-line bg-surface p-6">
          <p className="text-[15px] text-ink-soft">
            {swapped.length > 0
              ? "Swapping in a budget-friendlier option for the priciest items first, keeping the overall look."
              : "Every item is already at its cheaper option — this is as low as this plan goes."}
          </p>

          {swapped.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {swapped.map((item) => {
                const adjusted = result.items.find((i) => i.id === item.id)!;
                return (
                  <ShelfItemRow
                    key={item.id}
                    name={item.name}
                    meta={`Swapped for a more affordable option from ${item.supplier}`}
                    price={formatBaht(adjusted.price)}
                    strikePrice={formatBaht(item.price)}
                  />
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between border-2 border-ink bg-surface2 px-5 py-4">
            <span className="text-[15px] text-ink-soft">New estimated total</span>
            <PriceTag size="sm" tone={result.newTotal > budget ? "over" : "under"}>
              {formatBaht(result.newTotal)}
            </PriceTag>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => onAccept(result)} className={primaryButton}>
              Accept these changes
            </button>
            <button onClick={onContinue} className={textLink}>
              Keep original plan instead
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-5">
        {overBudget ? (
          showAdjust ? (
            <button onClick={() => setShowAdjust(false)} className={secondaryButton}>
              Hide adjustment
            </button>
          ) : (
            <>
              <button onClick={() => setShowAdjust(true)} className={primaryButton}>
                Adjust to my budget
              </button>
              <button onClick={onContinue} className={textLink}>
                Keep it as-is anyway
              </button>
            </>
          )
        ) : (
          <button onClick={onContinue} className={primaryButton}>
            Continue to final plan
          </button>
        )}
        <button onClick={onBack} className={textLink}>
          Back
        </button>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import type { CatalogItem, BudgetScope, AdjustmentResult } from "@/lib/planning";
import { adjustToBudget, formatBaht } from "@/lib/planning";
import { Stepper } from "./Stepper";

export function AdjustStep({
  items,
  scope,
  budget,
  onBack,
  onAccept,
  onKeepOriginal,
}: {
  items: CatalogItem[];
  scope: BudgetScope;
  budget: number;
  onBack: () => void;
  onAccept: (result: AdjustmentResult) => void;
  onKeepOriginal: () => void;
}) {
  const result = useMemo(() => adjustToBudget(items, scope, budget), [items, scope, budget]);
  const swapped = items.filter((item) => result.swappedIds.includes(item.id));

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={14} />
      </nav>

      <div className="flex flex-1 flex-col items-center px-16 pb-16 pt-8">
        <div className="flex w-full max-w-[760px] flex-col gap-8">
          <div>
            <h1 className="mb-2.5 font-display text-[32px]">Adjust to your budget</h1>
            <p className="max-w-[56ch] text-[15px] text-ink-soft">
              {swapped.length > 0
                ? "Swapping in a budget-friendlier option for the priciest items first, keeping the overall look."
                : "Every item is already at its cheaper option — this is as low as this plan goes."}
            </p>
          </div>

          {swapped.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {swapped.map((item) => {
                const adjusted = result.items.find((i) => i.id === item.id)!;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4"
                  >
                    <div>
                      <div className="text-[15px] font-medium text-ink">{item.name}</div>
                      <div className="text-[13px] text-ink-soft">
                        Swapped for a more affordable option from {item.supplier}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] text-ink-faint line-through">
                        {formatBaht(item.price)}
                      </div>
                      <div className="font-display text-base text-ink">
                        {formatBaht(adjusted.price)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-line bg-surface2 px-5 py-4">
            <span className="text-[15px] text-ink-soft">New estimated total</span>
            <span className="font-display text-xl text-ink">{formatBaht(result.newTotal)}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onAccept(result)}
              className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
            >
              Accept these changes
            </button>
            <button onClick={onKeepOriginal} className="text-sm text-ink-soft hover:text-ink">
              Keep original plan instead
            </button>
            <button onClick={onBack} className="text-sm text-ink-soft hover:text-ink">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

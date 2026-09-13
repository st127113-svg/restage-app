"use client";

import type { CatalogItem, BudgetScope } from "@/lib/planning";
import { estimateCost, formatBaht, SCOPE_MULTIPLIER } from "@/lib/planning";
import { Stepper } from "./Stepper";

export function CostStep({
  items,
  scope,
  onBack,
  onContinue,
}: {
  items: CatalogItem[];
  scope: BudgetScope;
  onBack: () => void;
  onContinue: () => void;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = estimateCost(items, scope);
  const multiplier = SCOPE_MULTIPLIER[scope];

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={12} />
      </nav>

      <div className="flex flex-1 flex-col items-center px-16 pb-16 pt-8">
        <div className="flex w-full max-w-[760px] flex-col gap-8">
          <div>
            <span className="mb-3 inline-block rounded-full bg-[#B8862F] px-3 py-1 text-[11px] font-medium text-white">
              💰 Plan moment
            </span>
            <h1 className="mb-2.5 font-display text-[32px]">Estimated project cost</h1>
            <p className="max-w-[56ch] text-[15px] text-ink-soft">
              Priced per item, then adjusted for scope — labor and install
              costs more as the project gets bigger.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-1.5 text-[15px]">
                <span className="text-ink">{item.name}</span>
                <span className="text-ink-soft">{formatBaht(item.price)}</span>
              </div>
            ))}
            <div className="my-2 h-px bg-line" />
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-ink-soft">Subtotal</span>
              <span className="text-ink-soft">{formatBaht(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-ink-soft">
                {scope} adjustment ({multiplier === 1 ? "no change" : `×${multiplier}`})
              </span>
              <span className="text-ink-soft">{formatBaht(total - subtotal)}</span>
            </div>
            <div className="my-2 h-px bg-line" />
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-ink">Total estimate</span>
              <span className="font-display text-lg text-ink">{formatBaht(total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onContinue}
              className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
            >
              Check against my budget
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

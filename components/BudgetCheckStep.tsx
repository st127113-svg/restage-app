"use client";

import { checkBudget, formatBaht } from "@/lib/planning";
import { Stepper } from "./Stepper";

export function BudgetCheckStep({
  total,
  budget,
  onBack,
  onAdjust,
  onContinue,
}: {
  total: number;
  budget: number;
  onBack: () => void;
  onAdjust: () => void;
  onContinue: () => void;
}) {
  const { overBudget, gap } = checkBudget(total, budget);

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={13} />
      </nav>

      <div className="flex flex-1 flex-col items-center px-16 pb-16 pt-8">
        <div className="flex w-full max-w-[760px] flex-col gap-8">
          <div>
            <h1 className="mb-2.5 font-display text-[32px]">Budget check</h1>
            <p className="max-w-[56ch] text-[15px] text-ink-soft">
              Your plan, side by side with what you told us you wanted to
              spend.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            <div className="bg-surface p-6">
              <div className="mb-1.5 text-[13px] text-ink-soft">Your budget</div>
              <div className="font-display text-2xl text-ink">{formatBaht(budget)}</div>
            </div>
            <div className="bg-surface p-6">
              <div className="mb-1.5 text-[13px] text-ink-soft">Estimated cost</div>
              <div className="font-display text-2xl text-ink">{formatBaht(total)}</div>
            </div>
          </div>

          <div
            className={
              "rounded-xl border px-5 py-4 text-[15px] " +
              (overBudget
                ? "border-clay bg-clay-soft text-ink"
                : "border-line bg-surface text-ink")
            }
          >
            {overBudget
              ? `You're ${formatBaht(gap)} over budget right now.`
              : `You're ${formatBaht(Math.abs(gap))} under budget — nice.`}
          </div>

          <div className="flex items-center gap-4">
            {overBudget ? (
              <button
                onClick={onAdjust}
                className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
              >
                Adjust to my budget
              </button>
            ) : (
              <button
                onClick={onContinue}
                className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
              >
                Continue to final plan
              </button>
            )}
            {overBudget && (
              <button onClick={onContinue} className="text-sm text-ink-soft hover:text-ink">
                Keep it as-is anyway
              </button>
            )}
            <button onClick={onBack} className="text-sm text-ink-soft hover:text-ink">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

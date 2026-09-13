"use client";

import { BUDGET_SCOPES, formatBaht, type BudgetScope } from "@/lib/planning";
import { PhotoPreview } from "./PhotoPreview";
import { Stepper } from "./Stepper";

export function BudgetStep({
  imageDataUrl,
  fileName,
  amount,
  scope,
  onChangeAmount,
  onChangeScope,
  onChangePhoto,
  onBack,
  onContinue,
}: {
  imageDataUrl: string;
  fileName: string;
  amount: string;
  scope: BudgetScope;
  onChangeAmount: (v: string) => void;
  onChangeScope: (s: BudgetScope) => void;
  onChangePhoto: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const parsed = Number(amount);
  const hasAmount = amount.trim() !== "" && !Number.isNaN(parsed) && parsed > 0;

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={6} />
      </nav>

      <div className="flex flex-1 gap-16 px-16 pb-16 pt-10">
        <PhotoPreview imageDataUrl={imageDataUrl} fileName={fileName} onChangePhoto={onChangePhoto} />

        <div className="flex flex-1 flex-col gap-10">
          <section>
            <h2 className="mb-2 font-display text-2xl">What&rsquo;s your budget?</h2>
            <p className="mb-5 max-w-[52ch] text-sm text-ink-soft">
              The plan we build later will be checked against this — you&rsquo;ll
              never be shown something you can&rsquo;t afford.
            </p>
            <div className="flex max-w-[320px] items-center rounded-xl border border-line bg-surface pl-4 focus-within:border-ink">
              <span className="font-display text-lg text-ink-soft">฿</span>
              <input
                type="number"
                min={0}
                step={500}
                value={amount}
                onChange={(e) => onChangeAmount(e.target.value)}
                placeholder="20,000"
                className="w-full bg-transparent p-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
              />
            </div>
            {hasAmount && (
              <p className="mt-2 text-[13px] text-ink-faint">{formatBaht(parsed)} total budget</p>
            )}
          </section>

          <section>
            <h2 className="mb-2 font-display text-2xl">What&rsquo;s in scope?</h2>
            <div className="flex flex-col gap-2.5">
              {BUDGET_SCOPES.map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeScope(s)}
                  className={
                    "flex w-full max-w-[420px] items-center gap-3 rounded-xl border-[1.5px] px-4 py-3.5 text-left transition-colors " +
                    (s === scope ? "border-clay bg-surface" : "border-line bg-surface hover:border-ink")
                  }
                >
                  <div
                    className={
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] " +
                      (s === scope ? "border-clay" : "border-line")
                    }
                  >
                    {s === scope && <div className="h-2.5 w-2.5 rounded-full bg-clay" />}
                  </div>
                  <span className="text-[15px]">{s}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-4">
            <button
              onClick={onContinue}
              disabled={!hasAmount}
              className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
            >
              Continue
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

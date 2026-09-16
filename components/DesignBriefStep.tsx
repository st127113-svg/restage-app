"use client";

import { STYLES, type Style } from "@/lib/constants";
import { BUDGET_SCOPES, formatBaht, type BudgetScope } from "@/lib/planning";
import { PhotoPreview } from "./PhotoPreview";
import { primaryButton, textLink } from "./buttons";

const STYLE_SWATCH: Record<Style, { bg: string; accent: string }> = {
  Modern: { bg: "oklch(0.93 0.005 250)", accent: "oklch(0.3 0.01 250)" },
  Scandinavian: { bg: "oklch(0.96 0.01 90)", accent: "oklch(0.72 0.06 60)" },
  Industrial: { bg: "oklch(0.28 0.01 250)", accent: "oklch(0.55 0.02 250)" },
  Farmhouse: { bg: "oklch(0.95 0.02 80)", accent: "oklch(0.75 0.05 140)" },
  Minimalist: { bg: "oklch(0.97 0.002 0)", accent: "oklch(0.3 0 0)" },
  Traditional: { bg: "oklch(0.94 0.03 130)", accent: "oklch(0.35 0.06 150)" },
};

export function DesignBriefStep({
  imageDataUrl,
  fileName,
  style,
  onChangeStyle,
  amount,
  scope,
  onChangeAmount,
  onChangeScope,
  freeNote,
  onChangeFreeNote,
  onChangePhoto,
  onBack,
  onGenerate,
  error,
}: {
  imageDataUrl: string;
  fileName: string;
  style: Style;
  onChangeStyle: (s: Style) => void;
  amount: string;
  scope: BudgetScope;
  onChangeAmount: (v: string) => void;
  onChangeScope: (s: BudgetScope) => void;
  freeNote: string;
  onChangeFreeNote: (v: string) => void;
  onChangePhoto: () => void;
  onBack: () => void;
  onGenerate: () => void;
  error: string | null;
}) {
  const parsed = Number(amount);
  const hasAmount = amount.trim() !== "" && !Number.isNaN(parsed) && parsed > 0;

  return (
    <div className="mx-auto flex max-w-[1180px] flex-1 flex-col gap-10 px-8 py-10 sm:px-16 lg:flex-row lg:gap-16">
      <PhotoPreview imageDataUrl={imageDataUrl} fileName={fileName} onChangePhoto={onChangePhoto} />

      <div className="flex flex-1 flex-col gap-10">
        <section>
          <h1 className="mb-2 font-display text-[28px] font-black text-ink">Pick a style</h1>
          <p className="mb-5 text-sm text-ink-soft">
            You can compare a few — regenerating is free while you&rsquo;re exploring.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {STYLES.map((s) => {
              const swatch = STYLE_SWATCH[s];
              const selected = s === style;
              return (
                <button
                  key={s}
                  onClick={() => onChangeStyle(s)}
                  className={
                    "relative flex flex-col gap-0 overflow-hidden border-2 bg-surface text-left transition-colors " +
                    (selected ? "border-ink" : "border-line hover:border-ink-soft")
                  }
                >
                  {selected && (
                    <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center border-2 border-ink bg-bg">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  )}
                  <svg viewBox="0 0 100 70" className="block w-full">
                    <rect width="100" height="70" fill={swatch.bg} />
                    <rect x="0" y="48" width="100" height="22" fill={swatch.accent} />
                  </svg>
                  <div className="px-3 py-2.5 text-[14px] font-medium text-ink">{s}</div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex items-center gap-3 border-t-2 border-line-strong pt-6">
          <span className="font-display text-[11px] font-black uppercase tracking-wide text-ink-faint">
            Bay 02
          </span>
          <span className="text-[11px] uppercase tracking-wide text-ink-faint">Budget &amp; notes</span>
        </div>

        <section className="grid max-w-[680px] grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 font-display text-base font-bold text-ink">What&rsquo;s your budget?</h2>
            <p className="mb-3 text-[13px] text-ink-soft">
              Checked against the plan later — you&rsquo;ll never be shown
              something you can&rsquo;t afford.
            </p>
            <div className="flex max-w-[260px] items-center border-2 border-line bg-surface pl-4 focus-within:border-ink">
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
          </div>

          <div>
            <h2 className="mb-2 font-display text-base font-bold text-ink">What&rsquo;s in scope?</h2>
            <div className="flex flex-col gap-2">
              {BUDGET_SCOPES.map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeScope(s)}
                  className={
                    "flex w-full items-center gap-3 border-2 px-4 py-3 text-left transition-colors " +
                    (s === scope ? "border-ink bg-surface" : "border-line bg-surface hover:border-ink-soft")
                  }
                >
                  <div
                    className={
                      "flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border-2 " +
                      (s === scope ? "border-ink" : "border-line")
                    }
                  >
                    {s === scope && <div className="h-2 w-2 rounded-full bg-ink" />}
                  </div>
                  <span className="text-[14px]">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <h2 className="mb-2 font-display text-base font-bold text-ink">Anything else?</h2>
            <p className="mb-3 max-w-[56ch] text-[13px] text-ink-soft">
              A color you love, something you&rsquo;re allergic to, a mood word.
              Totally optional.
            </p>
            <textarea
              value={freeNote}
              onChange={(e) => onChangeFreeNote(e.target.value)}
              placeholder="e.g. lots of natural light, no dark colors, I have a cat"
              rows={3}
              className="w-full border-[1.5px] border-line bg-surface p-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
            />
          </div>
        </section>

        {error && <p className="text-sm text-red">{error}</p>}
        {!hasAmount && (
          <p className="text-sm text-ink-faint">Set a budget above before generating — the plan later is checked against it.</p>
        )}

        <div className="flex items-center gap-5">
          <button onClick={onGenerate} disabled={!hasAmount} className={primaryButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
            </svg>
            Generate my redesign
          </button>
          <button onClick={onBack} className={textLink}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

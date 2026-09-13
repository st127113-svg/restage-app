"use client";

import { STYLES, type Style } from "@/lib/constants";
import { PhotoPreview } from "./PhotoPreview";
import { Stepper } from "./Stepper";

const STYLE_SWATCH: Record<Style, { bg: string; accent: string }> = {
  Modern: { bg: "oklch(0.93 0.005 250)", accent: "oklch(0.3 0.01 250)" },
  Scandinavian: { bg: "oklch(0.96 0.01 90)", accent: "oklch(0.72 0.06 60)" },
  Industrial: { bg: "oklch(0.28 0.01 250)", accent: "oklch(0.55 0.02 250)" },
  Farmhouse: { bg: "oklch(0.95 0.02 80)", accent: "oklch(0.75 0.05 140)" },
  Minimalist: { bg: "oklch(0.97 0.002 0)", accent: "oklch(0.3 0 0)" },
  Traditional: { bg: "oklch(0.94 0.03 130)", accent: "oklch(0.35 0.06 150)" },
};

export function StyleStep({
  imageDataUrl,
  fileName,
  style,
  onChangeStyle,
  onChangePhoto,
  onBack,
  onContinue,
}: {
  imageDataUrl: string;
  fileName: string;
  style: Style;
  onChangeStyle: (s: Style) => void;
  onChangePhoto: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={5} />
      </nav>

      <div className="flex flex-1 gap-16 px-16 pb-16 pt-10">
        <PhotoPreview imageDataUrl={imageDataUrl} fileName={fileName} onChangePhoto={onChangePhoto} />

        <div className="flex flex-1 flex-col gap-10">
          <section>
            <h2 className="mb-2 font-display text-2xl">Pick a style</h2>
            <p className="mb-5 text-sm text-ink-soft">
              You can compare a few — regenerating is free while you&rsquo;re
              exploring.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {STYLES.map((s) => {
                const swatch = STYLE_SWATCH[s];
                const selected = s === style;
                return (
                  <button
                    key={s}
                    onClick={() => onChangeStyle(s)}
                    className={
                      "relative flex flex-col gap-3 rounded-[14px] border-[1.5px] bg-surface p-3.5 text-left transition-shadow " +
                      (selected ? "border-clay shadow-[0_0_0_1px_var(--clay)]" : "border-line")
                    }
                  >
                    {selected && (
                      <div className="absolute right-2.5 top-2.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-clay">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                    <svg viewBox="0 0 100 60" className="block w-full rounded-md">
                      <rect width="100" height="60" fill={swatch.bg} />
                      <rect x="0" y="40" width="100" height="20" fill={swatch.accent} />
                    </svg>
                    <div className="text-[15px] font-medium">{s}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="flex items-center gap-4">
            <button
              onClick={onContinue}
              className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
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

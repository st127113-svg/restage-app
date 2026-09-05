"use client";

import { ROOM_TYPES, STYLES, type RoomType, type Style } from "@/lib/constants";
import { Stepper } from "./Stepper";

const STYLE_SWATCH: Record<Style, { bg: string; accent: string }> = {
  Modern: { bg: "oklch(0.93 0.005 250)", accent: "oklch(0.3 0.01 250)" },
  Scandinavian: { bg: "oklch(0.96 0.01 90)", accent: "oklch(0.72 0.06 60)" },
  Industrial: { bg: "oklch(0.28 0.01 250)", accent: "oklch(0.55 0.02 250)" },
  Farmhouse: { bg: "oklch(0.95 0.02 80)", accent: "oklch(0.75 0.05 140)" },
  Minimalist: { bg: "oklch(0.97 0.002 0)", accent: "oklch(0.3 0 0)" },
  Traditional: { bg: "oklch(0.94 0.03 130)", accent: "oklch(0.35 0.06 150)" },
};

export function ConfigureStep({
  imageDataUrl,
  fileName,
  roomType,
  style,
  onChangeRoomType,
  onChangeStyle,
  onChangePhoto,
  onGenerate,
  error,
}: {
  imageDataUrl: string;
  fileName: string;
  roomType: RoomType;
  style: Style;
  onChangeRoomType: (r: RoomType) => void;
  onChangeStyle: (s: Style) => void;
  onChangePhoto: () => void;
  onGenerate: () => void;
  error: string | null;
}) {
  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper current={1} />
      </nav>

      <div className="flex flex-1 gap-16 px-16 pb-16 pt-10">
        <div className="flex w-[340px] flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageDataUrl} alt="Uploaded room" className="block w-full object-cover" />
          </div>
          <div className="flex items-center justify-between">
            <span className="truncate text-sm text-ink-faint">{fileName}</span>
            <button onClick={onChangePhoto} className="shrink-0 text-sm text-clay hover:text-ink">
              Change photo
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-10">
          <section>
            <h2 className="mb-2 font-display text-2xl">What room is this?</h2>
            <p className="mb-5 text-sm text-ink-soft">
              Restage uses this to keep proportions and fixtures believable.
            </p>
            <div className="flex flex-wrap gap-3">
              {ROOM_TYPES.map((r) => (
                <button
                  key={r}
                  onClick={() => onChangeRoomType(r)}
                  className={
                    "flex h-11 items-center rounded-full border px-5 text-[15px] transition-colors " +
                    (r === roomType
                      ? "border-ink bg-ink text-surface"
                      : "border-line bg-surface text-ink-soft hover:border-ink")
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </section>

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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={onGenerate}
            className="flex h-[52px] w-fit items-center gap-2.5 rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
            </svg>
            Generate my redesign
          </button>
        </div>
      </div>
    </div>
  );
}

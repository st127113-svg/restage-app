"use client";

import { useRef, useState } from "react";
import { Stepper } from "./Stepper";

export function ResultStep({
  beforeImage,
  afterImage,
  roomType,
  style,
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
  isRefining: boolean;
  refineError: string | null;
  onRefine: (note: string) => void;
  onTryAnotherStyle: () => void;
  onStartOver: () => void;
  onContinue: () => void;
}) {
  const [percent, setPercent] = useState(50);
  const [showModify, setShowModify] = useState(false);
  const [note, setNote] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, pct)));
  }

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={8} />
      </nav>

      <div className="flex flex-1 flex-col items-center gap-6 px-16 pb-14 pt-8">
        <div className="flex w-full max-w-[1180px] items-center justify-between">
          <div>
            <h1 className="mb-2.5 font-display text-[32px]">
              Your {roomType.toLowerCase()}, restyled.
            </h1>
            <div className="flex gap-2.5">
              <span className="flex h-9 items-center rounded-full bg-clay-soft px-4 text-sm font-medium">
                {roomType}
              </span>
              <span className="flex h-9 items-center rounded-full bg-clay-soft px-4 text-sm font-medium">
                {style}
              </span>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full max-w-[1180px] select-none overflow-hidden rounded-[18px] border border-line"
          onMouseMove={(e) => dragging.current && updateFromClientX(e.clientX)}
          onMouseUp={() => (dragging.current = false)}
          onMouseLeave={() => (dragging.current = false)}
          onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeImage} alt="Before" className="block w-full" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${percent}%)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterImage} alt="After" className="block w-full" />
          </div>

          <div
            className="absolute top-0 h-full w-1 cursor-ew-resize bg-white"
            style={{ left: `calc(${percent}% - 2px)` }}
            onMouseDown={() => (dragging.current = true)}
          >
            <div className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
              </svg>
            </div>
          </div>

          <div className="absolute left-6 top-5 rounded-md bg-ink/55 px-3 py-1.5 text-[13px] text-white">
            Before
          </div>
          <div className="absolute right-6 top-5 rounded-md bg-ink/55 px-3 py-1.5 text-[13px] text-white">
            After
          </div>
        </div>

        <div className="flex w-full max-w-[1180px] items-center justify-between">
          <div className="flex gap-3">
            <a
              href={afterImage}
              download="restage-result.png"
              className="flex h-[52px] items-center gap-2.5 rounded-lg bg-ink px-6 text-[15px] font-medium text-surface hover:bg-clay"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v13m0 0 4-4m-4 4-4-4" />
                <path d="M5 20h14" />
              </svg>
              Download image
            </a>
            <button
              onClick={() => setShowModify((v) => !v)}
              className="flex h-[52px] items-center rounded-lg border border-line bg-surface px-6 text-[15px] font-medium hover:border-ink"
            >
              {showModify ? "Hide changes" : "Request changes"}
            </button>
            <button
              onClick={onTryAnotherStyle}
              className="flex h-[52px] items-center rounded-lg border border-line bg-surface px-6 text-[15px] font-medium hover:border-ink"
            >
              Try another style
            </button>
          </div>
          <button onClick={onStartOver} className="text-sm text-ink-soft hover:text-ink">
            Start over
          </button>
        </div>

        {showModify && (
          <div className="flex w-full max-w-[1180px] flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
            <div className="text-sm font-medium text-ink">
              Request changes — color, style, mood, specific items
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. warmer wood tones, swap the rug for something lighter"
              rows={2}
              className="w-full rounded-xl border border-line bg-bg p-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
            />
            {refineError && <p className="text-sm text-red-600">{refineError}</p>}
            <button
              onClick={() => onRefine(note)}
              disabled={isRefining || !note.trim()}
              className="flex h-11 w-fit items-center rounded-lg bg-ink px-5 text-sm font-medium text-surface hover:bg-clay disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
            >
              {isRefining ? "Regenerating…" : "Regenerate with these changes"}
            </button>
          </div>
        )}

        <div className="flex w-full max-w-[1180px] items-center justify-between border-t border-line pt-6">
          <p className="max-w-[60ch] text-[13px] text-ink-faint">
            AI-generated preview, for inspiration only — not a guarantee of
            exact final results.
          </p>
          <button
            onClick={onContinue}
            className="flex h-[48px] shrink-0 items-center gap-2 rounded-lg bg-ink px-6 text-[15px] font-medium text-surface hover:bg-clay"
          >
            Turn this into a plan
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

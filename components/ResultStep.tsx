"use client";

import { useState } from "react";
import { primaryButton, secondaryButton, textLink } from "./buttons";

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
  const [showModify, setShowModify] = useState(false);
  const [note, setNote] = useState("");

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col items-center gap-6 px-8 pb-14 pt-8 sm:px-16">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="mb-2.5 font-display text-[30px] font-black text-ink">
            Your {roomType.toLowerCase()}, restyled.
          </h1>
          <div className="flex gap-2">
            <span className="flex h-8 items-center border border-ink px-3.5 text-[13px] font-medium uppercase tracking-wide text-ink">
              {roomType}
            </span>
            <span className="flex h-8 items-center border border-ink px-3.5 text-[13px] font-medium uppercase tracking-wide text-ink">
              {style}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0.5 border-2 border-ink bg-ink sm:grid-cols-2">
        <div className="bg-surface">
          <div className="px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-ink-soft">
            Before
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeImage} alt="Before" className="block aspect-[4/3] w-full object-cover" />
        </div>
        <div className="bg-surface">
          <div className="px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-ink-soft">
            After
          </div>
          <div className="reveal-wipe overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterImage} alt="After" className="block aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <a href={afterImage} download="dwellwise-result.png" className={secondaryButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v13m0 0 4-4m-4 4-4-4" />
              <path d="M5 20h14" />
            </svg>
            Download image
          </a>
          <button onClick={() => setShowModify((v) => !v)} className={secondaryButton}>
            {showModify ? "Hide changes" : "Request changes"}
          </button>
          <button onClick={onTryAnotherStyle} className={secondaryButton}>
            Try another style
          </button>
        </div>
        <button onClick={onStartOver} className={textLink}>
          Start over
        </button>
      </div>

      {showModify && (
        <div className="flex w-full flex-col gap-3 border-2 border-line bg-surface p-6">
          <div className="text-sm font-medium text-ink">
            Request changes — color, style, mood, specific items
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. warmer wood tones, swap the rug for something lighter"
            rows={2}
            className="w-full border border-line bg-bg p-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          {refineError && <p className="text-sm text-red">{refineError}</p>}
          <button
            onClick={() => onRefine(note)}
            disabled={isRefining || !note.trim()}
            className={`${secondaryButton} w-fit px-5 text-[13px] disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {isRefining ? "Regenerating…" : "Regenerate with these changes"}
          </button>
        </div>
      )}

      <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t-2 border-line-strong pt-6">
        <p className="max-w-[60ch] text-[13px] text-ink-faint">
          AI-generated preview, for inspiration only — not a guarantee of
          exact final results.
        </p>
        <button onClick={onContinue} className={`${primaryButton} shrink-0`}>
          Turn this into a plan
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

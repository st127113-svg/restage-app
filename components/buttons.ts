// One button system, one place. Primary is the single forward action a
// screen owns -- signage yellow, tactile press (the CD-ROM raise).
// Secondary is everything else that isn't a plain text link.

export const primaryButton =
  "inline-flex min-h-[52px] items-center justify-center gap-2.5 border-2 border-ink bg-yellow px-7 py-3 text-center font-display text-[15px] font-bold uppercase leading-tight tracking-wide text-yellow-ink shadow-tag transition-all hover:brightness-95 active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0 disabled:active:shadow-tag";

export const secondaryButton =
  "inline-flex min-h-[52px] items-center justify-center gap-2.5 border-2 border-ink bg-surface px-7 py-3 text-center font-display text-[15px] font-bold uppercase leading-tight tracking-wide text-ink transition-colors hover:bg-surface2 active:translate-y-px";

export const textLink = "text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline";

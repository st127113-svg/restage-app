// The shared shell every screen mounts under: a wordmark and an
// aisle-directory strip naming the five phases as departments, the
// current one lit. Rendered once by app/page.tsx rather than duplicated
// per step, so the department math (and the underlying 15-stage
// numbering from PRODUCT.md) lives in exactly one place.

export const DEPARTMENTS = [
  { name: "Discover", range: "1–4" },
  { name: "Design", range: "5–9" },
  { name: "Plan", range: "10–12" },
  { name: "Optimize", range: "13–14" },
  { name: "Implement", range: "15" },
] as const;

export function AisleHeader({
  department,
  title,
  stages,
  quiet = false,
  onHome,
}: {
  /** 1-indexed department, matching DEPARTMENTS. */
  department: number;
  title: string;
  stages: string;
  /** The Design phase's reveal moments recede the signage frame to a
   * quiet wordmark-only bar, per the direction contract's FIRST
   * VIEWPORT: "the aisle system receding to a quiet frame so the
   * redesign itself reads as the reward." */
  quiet?: boolean;
  /** Resets the single-page journey and returns to the upload/home screen. */
  onHome: () => void;
}) {
  const current = DEPARTMENTS[department - 1];

  const wordmark = (
    <button
      type="button"
      onClick={onHome}
      aria-label="Go to DwellWise homepage"
      className="flex items-center gap-2.5"
    >
      <span className="relative block h-4 w-4 shrink-0 bg-yellow [clip-path:polygon(0_50%,50%_0,100%_0,100%_100%,50%_100%)]">
        <span className="absolute left-[3px] top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-bg" />
      </span>
      <span className="font-display text-lg font-black uppercase tracking-tight text-ink">
        DwellWise
      </span>
    </button>
  );

  if (quiet) {
    return (
      <header className="border-b border-line bg-bg">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4 sm:px-16">
          {wordmark}
          <span className="text-xs uppercase tracking-wide text-ink-faint">
            {current.name} &middot; {title}
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b-2 border-line-strong bg-bg">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4 sm:px-16">
        {wordmark}

        <nav aria-label="Journey progress" className="hidden items-stretch gap-px md:flex">
          {DEPARTMENTS.map((dept, i) => {
            const idx = i + 1;
            const state = idx < department ? "done" : idx === department ? "current" : "upcoming";
            return (
              <div
                key={dept.name}
                className={
                  "flex flex-col items-center justify-center border-b-[3px] px-3.5 py-1.5 " +
                  (state === "current"
                    ? "border-yellow bg-ink text-bg"
                    : state === "done"
                      ? "border-line-strong text-ink"
                      : "border-transparent text-ink-faint")
                }
              >
                <span className="font-display text-[11px] font-black uppercase tracking-wide">
                  {String(idx).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wide">{dept.name}</span>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-8 pb-3 sm:px-16">
        <span className="font-display text-xs font-black uppercase tracking-wide text-ink">
          Aisle {String(department).padStart(2, "0")}
        </span>
        <span className="h-3 w-px bg-line" />
        <span className="text-xs uppercase tracking-wide text-ink-soft">{title}</span>
        <span className="ml-auto text-xs uppercase tracking-wide text-ink-faint">
          Stage {stages} of 15 &middot; {current.name}
        </span>
      </div>
    </header>
  );
}

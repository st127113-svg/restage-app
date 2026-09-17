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
      className="flex w-[180px] shrink-0 items-center justify-center rounded-none bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
    >
      <svg
        viewBox="0 0 220 150"
        role="img"
        aria-label="Dwellwise — Smart Design Within Reach"
        className="h-[78px] w-[150px]"
      >
        <g fill="none" stroke="#37412f" strokeWidth="7" strokeLinejoin="miter">
          <path d="M74 52 L110 27 L146 52 L146 105 L74 105 Z" />
          <path d="M146 52 C175 54 184 74 184 87 C184 99 174 105 153 105 L146 105" />
        </g>
        <g fill="#8a9a6b">
          <path d="M88 103 C81 91 81 76 90 67 C97 78 96 90 88 103 Z" />
          <path d="M94 103 C98 90 107 82 117 80 C116 91 108 101 94 108 Z" />
        </g>
        <g fill="#c5ad81">
          <path d="M108 63 C108 53 115 48 121 48 C127 48 134 53 134 63 Z" />
          <rect x="120" y="33" width="2" height="16" />
          <path d="M125 70 C130 69 137 70 142 75 L137 96 L119 96 Z" />
          <path d="M117 94 L114 106 L118 106 L121 95 Z M134 95 L131 106 L135 106 L138 95 Z" />
        </g>
        <g fill="#37412f">
          <text x="110" y="128" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="25" letterSpacing="1.2">Dwellwise</text>
          <text x="110" y="142" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="5.8" letterSpacing="3.3">SMART DESIGN WITHIN REACH</text>
        </g>
      </svg>
    </button>
  );

  if (quiet) {
    return (
      <header className="border-b border-line bg-bg">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-3 sm:px-16">
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
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-3 sm:px-16">
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

const STEPS = ["Upload", "Room & style", "Result"];

export function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex items-center gap-2.5">
            <div
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-xs " +
                (i < current
                  ? "bg-ink text-surface"
                  : i === current
                    ? "bg-ink text-surface"
                    : "border border-line text-ink-faint")
              }
            >
              {i < current ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={"text-sm " + (i === current ? "text-ink" : "text-ink-faint")}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className="mx-2.5 h-px w-8 bg-line" />}
        </div>
      ))}
    </div>
  );
}

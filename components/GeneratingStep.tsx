export function GeneratingStep({
  roomType,
  style,
  onCancel,
}: {
  roomType: string;
  style: string;
  onCancel: () => void;
}) {
  return (
    <div className="relative flex min-h-[900px] flex-col items-center justify-center">
      <div className="absolute left-16 top-8 font-display text-xl font-semibold">
        Restage
      </div>

      <div className="flex w-[480px] flex-col items-center gap-6 rounded-[20px] border border-line bg-surface p-14 shadow-[0_20px_60px_-20px_oklch(0.24_0.02_60_/_0.18)]">
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-spin"
          style={{ animationDuration: "1.1s" }}
        >
          <circle cx="12" cy="12" r="9.5" stroke="var(--line)" strokeWidth={2} />
          <path d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5" stroke="var(--clay)" strokeWidth={2} strokeLinecap="round" />
        </svg>

        <div className="text-center">
          <h2 className="mb-2 font-display text-[22px]">
            Restyling your {roomType.toLowerCase()}…
          </h2>
          <p className="text-[15px] text-ink-soft">
            Rendering in {style} — keeping your layout, walls and window
            exactly where they are.
          </p>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-md bg-surface2">
          <div className="h-full w-1/3 animate-pulse rounded-md bg-line" />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[13px] text-ink-faint">
            Usually takes 20–40 seconds
          </span>
          <div className="h-3.5 w-px bg-line" />
          <button onClick={onCancel} className="text-[13px] text-clay hover:text-ink">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-20">
      <div className="flex w-full max-w-[480px] flex-col items-center gap-6 border-2 border-ink bg-surface p-8 shadow-card sm:p-12">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-spin"
          style={{ animationDuration: "1.1s" }}
        >
          <circle cx="12" cy="12" r="9.5" stroke="var(--line)" strokeWidth={2.5} />
          <path d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5" stroke="var(--ink)" strokeWidth={2.5} strokeLinecap="round" />
        </svg>

        <div className="text-center">
          <h2 className="mb-2 font-display text-xl font-black text-ink">
            Restyling your {roomType.toLowerCase()}&hellip;
          </h2>
          <p className="text-[15px] text-ink-soft">
            Rendering in {style} — keeping your layout, walls and window
            exactly where they are.
          </p>
        </div>

        <div className="h-2 w-full overflow-hidden border border-line bg-surface2">
          <div className="h-full w-1/3 animate-pulse bg-yellow" />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[13px] text-ink-faint">Usually takes 20–40 seconds</span>
          <div className="h-3.5 w-px bg-line" />
          <button onClick={onCancel} className="text-[13px] font-medium text-ink underline-offset-4 hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

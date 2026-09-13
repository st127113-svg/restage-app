"use client";

import type { RoomType } from "@/lib/constants";
import { CATALOG_BY_ROOM, formatBaht } from "@/lib/planning";
import { Stepper } from "./Stepper";

export function ProductsStep({
  roomType,
  selected,
  onToggle,
  onBack,
  onContinue,
}: {
  roomType: RoomType;
  selected: Record<string, boolean>;
  onToggle: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const items = CATALOG_BY_ROOM[roomType];

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={11} />
      </nav>

      <div className="flex flex-1 flex-col items-center px-16 pb-16 pt-8">
        <div className="flex w-full max-w-[760px] flex-col gap-8">
          <div>
            <span className="mb-3 inline-block rounded-full bg-clay px-3 py-1 text-[11px] font-medium text-surface">
              🛒 Realize moment
            </span>
            <h1 className="mb-2.5 font-display text-[32px]">Products & professionals</h1>
            <p className="max-w-[56ch] text-[15px] text-ink-soft">
              Matched to real suppliers and prices, so you don&rsquo;t have to
              search for any of this yourself. Uncheck anything you already
              have or want to source on your own.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {items.map((item) => {
              const checked = selected[item.id] ?? true;
              return (
                <label
                  key={item.id}
                  className={
                    "flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 transition-colors " +
                    (checked ? "border-line bg-surface" : "border-line bg-surface2 opacity-60")
                  }
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(item.id)}
                    className="h-[18px] w-[18px] shrink-0 accent-[var(--clay)]"
                  />
                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div>
                      <div className="text-[15px] font-medium text-ink">{item.name}</div>
                      <div className="text-[13px] text-ink-soft">
                        {item.supplier} · {item.category}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-display text-base text-ink">{formatBaht(item.price)}</div>
                      <div className="text-[12px] text-ink-faint">{item.contact}</div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onContinue}
              className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
            >
              Estimate total cost
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

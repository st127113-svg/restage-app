"use client";

import type { RoomType } from "@/lib/constants";
import { CATALOG_BY_ROOM, type NeedCategory } from "@/lib/planning";
import { Stepper } from "./Stepper";

const CATEGORY_ORDER: NeedCategory[] = ["Furniture", "Materials", "Services"];

export function NeedsStep({
  roomType,
  onBack,
  onContinue,
}: {
  roomType: RoomType;
  onBack: () => void;
  onContinue: () => void;
}) {
  const items = CATALOG_BY_ROOM[roomType];

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={10} />
      </nav>

      <div className="flex flex-1 flex-col items-center px-16 pb-16 pt-8">
        <div className="flex w-full max-w-[760px] flex-col gap-8">
          <div>
            <div className="mb-1.5 text-[13px] text-ink-soft">Turning the design into a plan</div>
            <h1 className="mb-2.5 font-display text-[32px]">
              Here&rsquo;s what this look needs
            </h1>
            <p className="max-w-[56ch] text-[15px] text-ink-soft">
              We broke the design down into what to buy and what to hire — the
              next steps match each of these to real prices and suppliers.
            </p>
          </div>

          {CATEGORY_ORDER.map((category) => {
            const inCategory = items.filter((item) => item.category === category);
            if (inCategory.length === 0) return null;
            return (
              <div key={category}>
                <h2 className="mb-3 font-display text-lg">{category}</h2>
                <div className="flex flex-col gap-2.5">
                  {inCategory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 rounded-xl border border-line bg-surface px-5 py-4"
                    >
                      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                      <div>
                        <div className="text-[15px] font-medium text-ink">{item.name}</div>
                        <div className="text-[13px] text-ink-soft">{item.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-4">
            <button
              onClick={onContinue}
              className="flex h-[52px] items-center rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
            >
              Find products & professionals
            </button>
            <button onClick={onBack} className="text-sm text-ink-soft hover:text-ink">
              Back to design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

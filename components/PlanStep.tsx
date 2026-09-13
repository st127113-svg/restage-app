"use client";

import type { RoomType, Style } from "@/lib/constants";
import type { CatalogItem, BudgetScope } from "@/lib/planning";
import { formatBaht } from "@/lib/planning";
import { Stepper } from "./Stepper";

function buildPlanText(
  roomType: RoomType,
  style: Style,
  scope: BudgetScope,
  items: CatalogItem[],
  total: number,
): string {
  const buy = items.filter((i) => i.category !== "Services");
  const hire = items.filter((i) => i.category === "Services");
  const lines = [
    `Restage — Implementation Plan`,
    `${roomType} · ${style} · ${scope}`,
    ``,
    `BUY LIST`,
    ...buy.map((i) => `- ${i.name} — ${formatBaht(i.price)} (${i.supplier})`),
    ``,
    `HIRE LIST`,
    ...hire.map((i) => `- ${i.name} — ${formatBaht(i.price)} (${i.supplier}, ${i.contact})`),
    ``,
    `TOTAL: ${formatBaht(total)}`,
  ];
  return lines.join("\n");
}

export function PlanStep({
  roomType,
  style,
  scope,
  items,
  total,
  onStartOver,
}: {
  roomType: RoomType;
  style: Style;
  scope: BudgetScope;
  items: CatalogItem[];
  total: number;
  onStartOver: () => void;
}) {
  const buyList = items.filter((i) => i.category !== "Services");
  const hireList = items.filter((i) => i.category === "Services");

  function handleDownload() {
    const text = buildPlanText(roomType, style, scope, items, total);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "restage-implementation-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-[900px] flex-col">
      <nav className="flex items-center justify-between px-16 pt-8">
        <div className="font-display text-xl font-semibold">Restage</div>
        <Stepper stage={15} />
      </nav>

      <div className="flex flex-1 flex-col items-center px-16 pb-16 pt-8">
        <div className="flex w-full max-w-[760px] flex-col gap-8">
          <div>
            <div className="mb-1.5 text-[13px] text-ink-soft">
              {roomType} · {style} · {scope}
            </div>
            <h1 className="mb-2.5 font-display text-[32px]">Your implementation plan</h1>
            <p className="max-w-[56ch] text-[15px] text-ink-soft">
              Everything from the last few steps, compiled into one checklist —
              this is what you'd actually go buy and hire.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg">Buy list</h2>
            <div className="flex flex-col gap-2.5">
              {buyList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4"
                >
                  <div>
                    <div className="text-[15px] font-medium text-ink">{item.name}</div>
                    <div className="text-[13px] text-ink-soft">{item.supplier}</div>
                  </div>
                  <div className="font-display text-base text-ink">{formatBaht(item.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {hireList.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-lg">Hire list</h2>
              <div className="flex flex-col gap-2.5">
                {hireList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4"
                  >
                    <div>
                      <div className="text-[15px] font-medium text-ink">{item.name}</div>
                      <div className="text-[13px] text-ink-soft">
                        {item.supplier} · {item.contact}
                      </div>
                    </div>
                    <div className="font-display text-base text-ink">{formatBaht(item.price)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface2 px-6 py-5">
            <span className="font-display text-lg text-ink">Total</span>
            <span className="font-display text-xl text-ink">{formatBaht(total)}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="flex h-[52px] items-center gap-2.5 rounded-lg bg-ink px-7 text-base font-medium text-surface hover:bg-clay"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v13m0 0 4-4m-4 4-4-4" />
                <path d="M5 20h14" />
              </svg>
              Download plan
            </button>
            <button onClick={onStartOver} className="text-sm text-ink-soft hover:text-ink">
              Start a new redesign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

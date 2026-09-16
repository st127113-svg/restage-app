"use client";

import type { RoomType, Style } from "@/lib/constants";
import type { CatalogItem, BudgetScope } from "@/lib/planning";
import { formatBaht } from "@/lib/planning";
import { PriceTag } from "./PriceTag";
import { ShelfItemRow } from "./ShelfItemRow";
import { primaryButton, textLink } from "./buttons";

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
    `DwellWise — Implementation Plan`,
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
    a.download = "dwellwise-implementation-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-8 px-8 py-10 sm:px-16">
      <div>
        <div className="mb-1.5 text-[13px] uppercase tracking-wide text-ink-soft">
          {roomType} · {style} · {scope}
        </div>
        <h1 className="mb-2.5 font-display text-[28px] font-black text-ink">Your implementation plan</h1>
        <p className="max-w-[56ch] text-[15px] text-ink-soft">
          Everything from the last few steps, compiled into one checklist —
          this is what you&rsquo;d actually go buy and hire.
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-display text-base font-bold text-ink">Buy list</h2>
        <div className="flex flex-col gap-2.5">
          {buyList.map((item) => (
            <ShelfItemRow key={item.id} name={item.name} meta={item.supplier} price={formatBaht(item.price)} />
          ))}
        </div>
      </div>

      {hireList.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-base font-bold text-ink">Hire list</h2>
          <div className="flex flex-col gap-2.5">
            {hireList.map((item) => (
              <ShelfItemRow
                key={item.id}
                name={item.name}
                meta={`${item.supplier} · ${item.contact}`}
                price={formatBaht(item.price)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-2 border-ink bg-surface2 px-6 py-5">
        <span className="font-display text-lg font-bold text-ink">Total</span>
        <PriceTag size="lg">{formatBaht(total)}</PriceTag>
      </div>

      <div className="flex items-center gap-5">
        <button onClick={handleDownload} className={primaryButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v13m0 0 4-4m-4 4-4-4" />
            <path d="M5 20h14" />
          </svg>
          Download plan
        </button>
        <button onClick={onStartOver} className={textLink}>
          Start a new redesign
        </button>
      </div>
    </div>
  );
}

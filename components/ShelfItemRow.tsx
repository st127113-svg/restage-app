// A SKU shelf-tag row: the barcode strip on the left is this world's
// item marker, the way a die-cut tag marks a price. Used anywhere the
// plan lists a real, priced thing -- the shopping list, the budget
// swap panel, the final buy/hire lists.

const BARCODE_BG =
  "repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 3px, var(--ink) 3px 4px, transparent 4px 6px, var(--ink) 6px 9px, transparent 9px 11px, var(--ink) 11px 12px, transparent 12px 15px)";

export function ShelfItemRow({
  name,
  meta,
  price,
  priceNote,
  strikePrice,
  muted = false,
  checkbox,
}: {
  name: string;
  meta?: React.ReactNode;
  price: React.ReactNode;
  priceNote?: React.ReactNode;
  strikePrice?: React.ReactNode;
  muted?: boolean;
  checkbox?: React.ReactNode;
}) {
  return (
    <div
      className={
        "flex items-stretch gap-4 border border-line bg-surface pr-5 transition-opacity " +
        (muted ? "opacity-55" : "")
      }
    >
      <div className="w-2 shrink-0" style={{ backgroundImage: BARCODE_BG }} aria-hidden />
      <div className="flex flex-1 items-start gap-4 py-3.5 sm:items-center">
        {checkbox}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="text-[15px] font-medium text-ink">{name}</div>
            {meta && <div className="text-[13px] text-ink-soft">{meta}</div>}
          </div>
          <div className="shrink-0 sm:text-right">
            {strikePrice && (
              <div className="text-[13px] text-ink-faint line-through">{strikePrice}</div>
            )}
            <div className="font-display text-base tabular text-ink">{price}</div>
            {priceNote && <div className="text-[12px] text-ink-faint">{priceNote}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// A die-cut price tag: the signature unit of the Aisle Signage world.
// Reserved for hero amounts (budget entry, running totals, the final
// price) -- palette-as-law means yellow never spends itself on
// decoration, so ordinary line-item prices stay plain tabular numerals.

const TONE = {
  price: "bg-yellow text-yellow-ink",
  under: "bg-green-soft text-green",
  over: "bg-red-soft text-red",
} as const;

export function PriceTag({
  children,
  tone = "price",
  size = "md",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE;
  size?: "sm" | "md" | "lg";
}) {
  const padY = size === "lg" ? "py-3.5" : size === "sm" ? "py-1.5" : "py-2.5";
  const padRight = size === "lg" ? "pr-6" : size === "sm" ? "pr-3.5" : "pr-5";
  const padLeft = size === "lg" ? "pl-[38px]" : size === "sm" ? "pl-[22px]" : "pl-[30px]";
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-lg";
  const hole = size === "lg" ? "h-2 w-2 left-[11px]" : size === "sm" ? "h-1 w-1 left-[7px]" : "h-1.5 w-1.5 left-[9px]";

  return (
    <span
      className={
        "relative inline-flex items-center font-display font-black leading-none tabular " +
        `${padY} ${padRight} ${padLeft} ${text} ${TONE[tone]}`
      }
      style={{ clipPath: "polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)" }}
    >
      <span className={"absolute top-1/2 -translate-y-1/2 rounded-full bg-bg " + hole} />
      {children}
    </span>
  );
}

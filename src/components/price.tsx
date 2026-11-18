import { formatPrice } from "@/lib/format";

export function Price({ price, compareAt, size = "md" }: { price: number; compareAt?: number | null; size?: "sm" | "md" | "lg" }) {
  const sale = compareAt != null && compareAt > price;
  const big = size === "lg" ? "text-[32px] md:text-[38px]" : size === "sm" ? "text-[16px]" : "text-[18px]";
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={`font-display ${big} ${sale ? "text-rose" : ""}`}>{formatPrice(price)}</span>
      {sale && <s className={`text-mute ${size === "lg" ? "text-[16px]" : "text-[12.5px]"}`}>{formatPrice(compareAt!)}</s>}
    </span>
  );
}

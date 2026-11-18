import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-10 md:pt-14">
      <div className="text-center">
        <p className="rise kicker text-mauve">Захиалга</p>
        <h1 className="rise display mt-2 text-[44px] md:text-[68px]" style={{ "--d": "100ms" } as React.CSSProperties}>
          Миний сагс
        </h1>
      </div>
      <div className="mt-10">
        <Checkout />
      </div>
    </div>
  );
}

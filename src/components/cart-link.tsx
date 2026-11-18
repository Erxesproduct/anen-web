"use client";

import Link from "next/link";
import { cartCount, useCart } from "@/lib/cart";
import { BasketIcon } from "./icons";

export function CartLink() {
  const n = cartCount(useCart());
  return (
    <Link href="/cart" className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-blush hover:text-rose" aria-label={n ? `Сагс, ${n} бараа` : "Сагс"}>
      <BasketIcon size={21} />
      {n > 0 && (
        <span key={n} className="bloom absolute top-0.5 right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1 text-[10.5px] font-semibold text-white">
          {n}
        </span>
      )}
    </Link>
  );
}

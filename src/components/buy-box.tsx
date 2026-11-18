"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, maxQty, useCart } from "@/lib/cart";
import { getLite } from "@/lib/lite";
import { BasketIcon, CheckIcon, MinusIcon, PlusIcon } from "./icons";

/** Quantity + «Сагсанд хийх». */
export function BuyBox({ slug }: { slug: string }) {
  const p = getLite(slug)!;
  const items = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = items.find((i) => i.slug === slug)?.qty ?? 0;
  const room = maxQty(slug, null) - inCart;

  if (p.k === 0)
    return (
      <div className="rounded-3xl border border-line bg-white/70 p-5">
        <p className="display text-[24px]">Одоогоор дууссан</p>
        <p className="mt-1 text-[14px] text-ink-2">Дахин ирэх хугацааг Facebook эсвэл утсаар асуугаарай.</p>
      </div>
    );

  return (
    <div>
      <div className="flex gap-3">
        <div className="flex h-14 items-center rounded-full border border-line bg-white">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-14 w-12 place-items-center rounded-full hover:text-rose" aria-label="Цөөлөх">
            <MinusIcon size={16} />
          </button>
          <span className="w-6 text-center font-semibold" aria-live="polite">
            {qty}
          </span>
          <button type="button" onClick={() => setQty((q) => Math.min(Math.max(1, room), q + 1))} disabled={qty >= room} className="grid h-14 w-12 place-items-center rounded-full hover:text-rose disabled:opacity-30" aria-label="Нэмэх">
            <PlusIcon size={16} />
          </button>
        </div>
        <button
          type="button"
          disabled={room <= 0}
          onClick={() => {
            cart.add(slug, null, qty);
            setAdded(true);
            setQty(1);
            window.setTimeout(() => setAdded(false), 1800);
          }}
          className={`btn h-14 flex-1 disabled:opacity-50 ${added ? "btn-ink" : "btn-rose"}`}
        >
          {added ? <CheckIcon size={18} /> : <BasketIcon size={18} />}
          {added ? "Сагсанд орлоо" : "Сагсанд хийх"}
        </button>
      </div>
      {inCart > 0 && (
        <p className="fade-in mt-3 text-center text-[13.5px] text-ink-2">
          Сагсанд {inCart} ширхэг ·{" "}
          <Link href="/cart" className="font-semibold text-rose underline underline-offset-4">
            захиалга өгөх
          </Link>
        </p>
      )}
      {room <= 0 && inCart > 0 && <p className="mt-1 text-center text-[12.5px] text-mute">Үлдэгдэл бүгд сагсанд байна.</p>}
    </div>
  );
}

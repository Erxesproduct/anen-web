"use client";

import { useState } from "react";
import { cart, maxQty, useCart } from "@/lib/cart";
import { CheckIcon, PlusIcon } from "./icons";

/** Round «+» on a product photo: adds one to the cart and blooms into a tick. */
export function QuickAdd({ slug, name }: { slug: string; name: string }) {
  const items = useCart();
  const [done, setDone] = useState(false);
  const inCart = items.find((i) => i.slug === slug)?.qty ?? 0;
  const full = inCart >= maxQty(slug, null);
  return (
    <button
      type="button"
      disabled={full && !done}
      onClick={() => {
        cart.add(slug, null);
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
      aria-label={`${name}: сагсанд хийх`}
      className={`absolute right-3 bottom-3 z-10 grid h-10 w-10 translate-y-0 place-items-center rounded-full shadow-[0_10px_24px_-10px_rgb(168_17_79/0.6)] transition duration-500 disabled:opacity-40 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 ${done ? "bg-sage text-white" : "bg-white text-rose hover:bg-rose hover:text-white"}`}
    >
      {done ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
    </button>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/catalog";

/** The shop's photos in a tall arch, thumbnails beside it; the big photo cross-fades when another is picked. */
export function Gallery({ images, name }: { images: Photo[]; name: string }) {
  const [i, setI] = useState(0);
  const img = images[i] ?? images[0];
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto p-1 md:flex-col" role="tablist" aria-label="Зургууд">
          {images.map((m, k) => (
            <button key={m.src} type="button" role="tab" aria-selected={k === i} aria-label={`Зураг ${k + 1}`} onClick={() => setI(k)} className="relative h-[92px] w-[74px] shrink-0 overflow-hidden rounded-2xl bg-white opacity-60 ring-rose ring-offset-2 ring-offset-porcelain transition duration-500 hover:opacity-100 aria-selected:opacity-100 aria-selected:ring-1">
              <Image src={m.thumb.src} alt="" fill sizes="74px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="arch aspect-[4/5] flex-1 shadow-[0_30px_60px_-40px_rgb(58_38_48/0.6)]">
        {img ? (
          <Image key={img.src} src={img.src} alt={name} width={img.w} height={img.h} priority sizes="(min-width: 1024px) 560px, 100vw" className="fade-in absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-blush">
            <span className="display text-[44px] tracking-[0.2em] text-mauve">ANEN</span>
          </span>
        )}
      </div>
    </div>
  );
}

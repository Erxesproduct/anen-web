import Image from "next/image";
import Link from "next/link";
import { brandName, discount, soldOut, type Product } from "@/lib/catalog";
import { Price } from "./price";
import { QuickAdd } from "./quick-add";

/** A product in a soft 4:5 frame: the photo eases in on hover, a «+» adds it to the cart without leaving the page. */
export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const img = p.images[0];
  const off = discount(p);
  const out = soldOut(p);
  return (
    <article className="group">
      <div className="relative">
        <Link href={`/p/${p.slug}`} tabIndex={-1} aria-hidden className="frame zoom block aspect-[4/5] shadow-[0_18px_36px_-30px_rgb(58_38_48/0.6)]">
          {img ? (
            <Image src={img.thumb.src} alt="" fill priority={priority} sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 46vw" className={`object-cover ${out ? "opacity-50 grayscale-[40%]" : ""}`} />
          ) : (
            <span className="absolute inset-0 grid place-items-center bg-blush">
              <span className="display text-[28px] tracking-[0.2em] text-mauve">ANEN</span>
            </span>
          )}
        </Link>
        <span className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {off > 0 && !out && <span className="tag bg-rose text-white">−{off}%</span>}
          {p.bestseller && !out && <span className="tag bg-white/90 text-rose-deep">♥ Их захиалагддаг</span>}
          {out && <span className="tag bg-ink text-white">Дууссан</span>}
        </span>
        {!out && <QuickAdd slug={p.slug} name={p.name} />}
      </div>
      <Link href={`/p/${p.slug}`} className="block">
        <p className="kicker mt-3.5 !text-[10px] text-mauve">{brandName(p.brand)}</p>
        <h3 className="mt-1 line-clamp-2 text-[14.5px] leading-snug font-medium transition group-hover:text-rose">{p.name}</h3>
        <div className="mt-1.5">
          <Price price={p.price} compareAt={p.compareAt} size="sm" />
        </div>
      </Link>
    </article>
  );
}
